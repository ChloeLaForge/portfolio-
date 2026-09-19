import {
  CHAT_ENDPOINT,
  type ChatErrorBody,
  type ChatErrorCode,
  type ChatRequestBody,
  type ChatSuccessBody,
} from '../../shared/assistant';

/** Long enough for a sleeping free-tier host (about a minute to wake) plus the model's reply. */
const REQUEST_TIMEOUT_MS = 75_000;

const ERROR_CODES: readonly string[] = ['bad_request', 'too_fast', 'rate_limited', 'unavailable', 'failed'];

/** A failure the UI can describe to a visitor. Carries a code, never server detail. */
export class ChatRequestError extends Error {
  constructor(readonly code: ChatErrorCode | 'network') {
    super(code);
  }
}

/** Sends one question to our own API route. The browser never talks to OpenAI. */
export async function sendChat(body: ChatRequestBody): Promise<string> {
  let response: Response;
  try {
    response = await fetch(CHAT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    throw new ChatRequestError('network');
  }

  let payload: Partial<ChatSuccessBody & ChatErrorBody> | null = null;
  try {
    payload = await response.json();
  } catch {
    /* Non-JSON body, e.g. a host error page. Handled below. */
  }

  if (response.ok && typeof payload?.reply === 'string') return payload.reply;

  const code = payload?.error?.code;
  throw new ChatRequestError(code && ERROR_CODES.includes(code) ? code : 'failed');
}
