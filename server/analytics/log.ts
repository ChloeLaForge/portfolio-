import type { AssistantPage } from '../../shared/assistant.js';
import { ASSISTANT_MODEL } from '../assistant/config.js';
import { classifyTopic, looksLikeFallback, redactSecrets } from './classify.js';
import { analyticsConfigured, insertChatRecord } from './store.js';
import type { ChatStatus } from './types.js';

/**
 * Records one visitor question. Always fire-and-forget: the chat response has
 * already been sent, and nothing in here is allowed to throw or to make the
 * visitor wait. Failures go to the server log for the developer only.
 */

export interface Interaction {
  sessionId: string | undefined;
  page: AssistantPage;
  question: string;
  response: string | null;
  /** True when the model itself flagged an unknown-answer reply. */
  fallbackDeclared?: boolean;
  status: ChatStatus;
  errorType: string | null;
}

/** Anonymous ids only: random tokens from the browser, never anything derived from the visitor. */
const SESSION_ID = /^[A-Za-z0-9_-]{8,64}$/;

/**
 * Rate-limited requests are the only rows a spammer could mass-produce, so
 * their rows are capped per hour. Real questions and provider failures are
 * already bounded by the chat rate limiter.
 */
const REJECTED_CAP = { max: 60, windowMs: 60 * 60_000 };
let rejectedTimes: number[] = [];

function withinRejectedCap(now = Date.now()): boolean {
  rejectedTimes = rejectedTimes.filter((t) => now - t < REJECTED_CAP.windowMs);
  if (rejectedTimes.length >= REJECTED_CAP.max) return false;
  rejectedTimes.push(now);
  return true;
}

let warnedNotConfigured = false;

export function logInteraction(interaction: Interaction): void {
  try {
    if (!analyticsConfigured()) {
      if (!warnedNotConfigured) {
        warnedNotConfigured = true;
        console.error('[analytics] DATABASE_URL is not set, so this chat interaction was not recorded.');
      }
      return;
    }
    if (interaction.errorType === 'rate_limited' && !withinRejectedCap()) return;

    const question = redactSecrets(interaction.question);
    const response = interaction.response === null ? null : redactSecrets(interaction.response);
    const fallbackUsed = response !== null && (interaction.fallbackDeclared === true || looksLikeFallback(response));

    void insertChatRecord({
      sessionId: interaction.sessionId && SESSION_ID.test(interaction.sessionId) ? interaction.sessionId : 'unknown',
      page: interaction.page,
      question,
      response,
      topic: classifyTopic(question, response, interaction.page, fallbackUsed),
      fallbackUsed,
      status: interaction.status,
      errorType: interaction.errorType,
      model: ASSISTANT_MODEL,
    }).catch((err: Error) => {
      console.error(`[analytics] Failed to save chat record: ${err.message}`);
    });
  } catch (err) {
    console.error(`[analytics] Failed to prepare chat record: ${(err as Error).message}`);
  }
}
