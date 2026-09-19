import OpenAI from 'openai';
import type { AssistantPage, ChatTurn } from '../../shared/assistant.js';
import { ASSISTANT_MODEL, MAX_OUTPUT_TOKENS, OPENAI_TIMEOUT_MS, REASONING_EFFORT } from './config.js';
import { extractFallbackMarker } from '../analytics/classify.js';
import { buildInstructions } from './context.js';

/** Thrown for failures the route maps to a friendly status; never carries provider detail to visitors. */
export class AssistantUnavailableError extends Error {}

/** The model answered but produced no text (for example it ran out of output tokens). */
export class EmptyReplyError extends Error {}

export interface AssistantReply {
  reply: string;
  /** True when the model flagged this as an unknown-answer reply; used only for analytics. */
  fallbackDeclared: boolean;
}

let client: OpenAI | null = null;

/** Created lazily so a missing key surfaces as a handled error, not a crash at boot. */
function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    console.error('[assistant] OPENAI_API_KEY is not set. Add it to the server environment (or a local .env file).');
    throw new AssistantUnavailableError('OPENAI_API_KEY missing');
  }
  client ??= new OpenAI({ apiKey, timeout: OPENAI_TIMEOUT_MS, maxRetries: 1 });
  return client;
}

/** The model is told to avoid dashes; this catches the occasional slip so UI copy stays consistent. */
function stripDashes(text: string): string {
  return text.replace(/\s*[–—]\s*/g, ', ');
}

/**
 * Asks the model for one reply. No tools are passed, so web search and every
 * other hosted tool are off, and `store: false` keeps the exchange from being
 * retained on OpenAI's side for later retrieval.
 */
export async function generateReply(message: string, history: ChatTurn[], page: AssistantPage): Promise<AssistantReply> {
  const openai = getClient();

  const response = await openai.responses.create({
    model: ASSISTANT_MODEL,
    instructions: buildInstructions(page),
    input: [...history, { role: 'user', content: message }],
    reasoning: { effort: REASONING_EFFORT },
    max_output_tokens: MAX_OUTPUT_TOKENS,
    store: false,
  });

  const text = response.output_text?.trim();
  if (!text) {
    console.error(`[assistant] Empty reply (status: ${response.status}, reason: ${response.incomplete_details?.reason ?? 'none'}).`);
    throw new EmptyReplyError('empty model reply');
  }
  const { text: visible, declared } = extractFallbackMarker(text);
  return { reply: stripDashes(visible), fallbackDeclared: declared };
}
