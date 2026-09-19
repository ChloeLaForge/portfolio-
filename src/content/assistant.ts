/* ============================================================
   ASSISTANT COPY
   Every visitor-facing string the portfolio assistant shows.
   What the assistant knows and how it sounds lives on the
   server, in server/assistant/content/*.md.
   ============================================================ */

import type { ChatErrorCode } from '../../shared/assistant';

export const assistantCopy = {
  title: 'Portfolio Assistant',
  subtitle: 'Ask me about Chloe’s work',
  launcherLabel: 'Ask Chloe’s AI',
  intro: 'Hi! I’m Chloe’s portfolio assistant. I can tell you about her projects, how they were built, or the thinking behind them.',
  starters: ['How does AI Notebook work?', 'Why did Chloe build Barclay Woods?', 'Tell me about CS 1501.'],
  placeholder: 'Ask about a project',
  thinking: 'Thinking',
  retry: 'Try again',
} as const;

export type AssistantErrorKey = ChatErrorCode | 'network';

export const assistantErrors: Record<AssistantErrorKey, string> = {
  failed: 'I hit a tiny technical snag. Try that again in a second.',
  bad_request: 'I hit a tiny technical snag. Try that again in a second.',
  too_fast: 'That was a quick one. Give me a second, then try again.',
  rate_limited: 'I’m getting a lot of questions right now. Please try again in a few minutes.',
  unavailable: 'I’m taking a short break and can’t answer right now. Please try again a little later.',
  network: 'I couldn’t reach the server. Check your connection and try again.',
};
