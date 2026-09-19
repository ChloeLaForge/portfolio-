/**
 * Contract shared by the browser widget and the API route. Nothing secret
 * lives here, so both sides may import it.
 */

/** Which portfolio page the visitor is looking at when they ask. */
export const ASSISTANT_PAGES = ['home', 'barclay', 'notebook', 'cs1501', 'other'] as const;
export type AssistantPage = (typeof ASSISTANT_PAGES)[number];

export type ChatRole = 'user' | 'assistant';

export interface ChatTurn {
  role: ChatRole;
  content: string;
}

export interface ChatRequestBody {
  message: string;
  history: ChatTurn[];
  currentPage: AssistantPage;
  /** Random anonymous id for this chat session; only groups questions, never identifies a visitor. */
  sessionId: string;
}

export interface ChatSuccessBody {
  reply: string;
}

/** Error codes the client turns into friendly copy. */
export type ChatErrorCode = 'bad_request' | 'too_fast' | 'rate_limited' | 'unavailable' | 'failed';

export interface ChatErrorBody {
  error: { code: ChatErrorCode };
}

/** Limits enforced by the server and mirrored in the input UI. */
export const MAX_MESSAGE_CHARS = 500;
/** Prior turns the client sends and the server accepts. */
export const MAX_HISTORY_TURNS = 8;
/** Assistant replies are longer than questions, so history turns get more room. */
export const MAX_HISTORY_TURN_CHARS = 2000;

export const CHAT_ENDPOINT = '/api/chat';
