import type { AssistantPage } from '../../shared/assistant.js';

/** The fixed set of topic labels written to the Topic column. */
export const TOPICS = ['AI Notebook', 'Barclay Woods', 'CS 1501', 'About Chloe', 'Cross-project', 'Portfolio', 'Unknown / Other'] as const;
export type Topic = (typeof TOPICS)[number];

/** Page codes are stored as sent; these labels are only for the Excel export. */
export const PAGE_LABELS: Record<AssistantPage, string> = {
  home: 'Home',
  barclay: 'Barclay Woods',
  notebook: 'AI Notebook',
  cs1501: 'CS 1501',
  other: 'Other',
};

export type ChatStatus = 'success' | 'error';

/** One visitor question and what happened to it. Deliberately holds nothing that identifies a visitor. */
export interface ChatRecord {
  createdAt: Date;
  sessionId: string;
  page: AssistantPage;
  question: string;
  /** Null when the request failed before an answer existed. */
  response: string | null;
  topic: Topic;
  fallbackUsed: boolean;
  status: ChatStatus;
  /** A short safe category such as provider_timeout, never a raw error message. */
  errorType: string | null;
  model: string;
}

export type NewChatRecord = Omit<ChatRecord, 'createdAt'>;
