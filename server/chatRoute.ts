import type { Request, Response } from 'express';
import OpenAI from 'openai';
import {
  ASSISTANT_PAGES,
  MAX_HISTORY_TURNS,
  MAX_HISTORY_TURN_CHARS,
  MAX_MESSAGE_CHARS,
  type AssistantPage,
  type ChatErrorBody,
  type ChatErrorCode,
  type ChatSuccessBody,
  type ChatTurn,
} from '../shared/assistant.js';
import { logInteraction } from './analytics/log.js';
import { AssistantUnavailableError, EmptyReplyError, generateReply } from './assistant/respond.js';
import { checkRateLimit } from './rateLimit.js';

interface ValidRequest {
  message: string;
  history: ChatTurn[];
  currentPage: AssistantPage;
  sessionId: string | undefined;
}

/** Short, safe labels for the analytics Error Type column. Never contains provider messages. */
function errorTypeOf(err: unknown): string {
  if (err instanceof AssistantUnavailableError) return 'not_configured';
  if (err instanceof EmptyReplyError) return 'empty_reply';
  if (err instanceof OpenAI.APIConnectionTimeoutError) return 'provider_timeout';
  if (err instanceof OpenAI.APIConnectionError) return 'provider_connection';
  if (err instanceof OpenAI.APIError) {
    if (err.status === 401 || err.status === 403) return 'provider_auth';
    if (err.status === 404) return 'provider_model_not_found';
    if (err.status === 429) return 'provider_quota_or_rate_limit';
    if (err.status !== undefined && err.status >= 500) return 'provider_server_error';
    return 'provider_error';
  }
  return 'unknown_server_error';
}

function fail(res: Response, status: number, code: ChatErrorCode, retryAfterSec?: number): void {
  if (retryAfterSec) res.set('Retry-After', String(retryAfterSec));
  res.status(status).json({ error: { code } } satisfies ChatErrorBody);
}

/** Returns a cleaned request, or null if the body is not something we should send to the model. */
function parseBody(body: unknown): ValidRequest | null {
  if (typeof body !== 'object' || body === null) return null;
  const { message, history, currentPage, sessionId } = body as Record<string, unknown>;

  if (typeof message !== 'string') return null;
  const trimmed = message.trim();
  if (!trimmed || trimmed.length > MAX_MESSAGE_CHARS) return null;

  const page = ASSISTANT_PAGES.find((p) => p === currentPage) ?? 'other';

  const turns: ChatTurn[] = [];
  if (history !== undefined) {
    if (!Array.isArray(history)) return null;
    for (const turn of history.slice(-MAX_HISTORY_TURNS)) {
      if (typeof turn !== 'object' || turn === null) return null;
      const { role, content } = turn as Record<string, unknown>;
      if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null;
      const text = content.trim().slice(0, MAX_HISTORY_TURN_CHARS);
      if (text) turns.push({ role, content: text });
    }
  }

  return { message: trimmed, history: turns, currentPage: page, sessionId: typeof sessionId === 'string' ? sessionId : undefined };
}

/** Turns a failed model call into a friendly response. Provider detail goes to the server log only. */
function respondToFailure(res: Response, err: unknown): void {
  if (err instanceof AssistantUnavailableError) return fail(res, 503, 'unavailable');
  if (err instanceof OpenAI.APIError) {
    console.error(`[assistant] OpenAI request failed: ${err.status ?? 'no status'} ${err.code ?? ''} ${err.message}`);
    const configProblem = err.status === 401 || err.status === 403 || err.status === 404 || err.status === 429;
    return fail(res, configProblem ? 503 : 502, configProblem ? 'unavailable' : 'failed');
  }
  console.error('[assistant] Unexpected error:', err);
  fail(res, 500, 'failed');
}

export async function handleChat(req: Request, res: Response): Promise<void> {
  const parsed = parseBody(req.body);
  if (!parsed) return fail(res, 400, 'bad_request');

  // Analytics is recorded after the visitor has their answer, and can never affect it.
  const record = (outcome: { response: string | null; fallbackDeclared?: boolean; errorType: string | null }) =>
    logInteraction({
      sessionId: parsed.sessionId,
      page: parsed.currentPage,
      question: parsed.message,
      status: outcome.errorType === null ? 'success' : 'error',
      ...outcome,
    });

  const verdict = checkRateLimit(req.ip ?? 'unknown');
  if (!verdict.ok) {
    fail(res, 429, verdict.reason, verdict.retryAfterSec);
    // A too-fast repeat is a double-submit, not a new question, so only real limits are recorded.
    if (verdict.reason === 'rate_limited') record({ response: null, errorType: 'rate_limited' });
    return;
  }

  try {
    const { reply, fallbackDeclared } = await generateReply(parsed.message, parsed.history, parsed.currentPage);
    res.json({ reply } satisfies ChatSuccessBody);
    record({ response: reply, fallbackDeclared, errorType: null });
  } catch (err) {
    respondToFailure(res, err);
    record({ response: null, errorType: errorTypeOf(err) });
  }
}
