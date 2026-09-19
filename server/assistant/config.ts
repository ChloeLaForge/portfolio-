/**
 * Everything tunable about the portfolio assistant, in one place.
 * Change the model, limits or context file names here; nothing else
 * in the server needs to know.
 */

/** Model used for every reply. Set OPENAI_MODEL to override without a code change. */
export const ASSISTANT_MODEL = process.env.OPENAI_MODEL?.trim() || 'gpt-5.6-sol';

/** Portfolio Q&A is lookup and summary work; low reasoning keeps replies fast and cheap. */
export const REASONING_EFFORT = 'low' as const;

/** Hard cap on generated tokens. On reasoning models this includes the reasoning tokens. */
export const MAX_OUTPUT_TOKENS = 1200;

/** Give up on the model call after this long. */
export const OPENAI_TIMEOUT_MS = 30_000;

export const RATE_LIMIT = {
  /** Minimum gap between requests from one visitor; stops double-submits. */
  minGapMs: 1_500,
  /** Requests per visitor per window. */
  perVisitor: { max: 20, windowMs: 10 * 60_000 },
  /** Requests across all visitors per window; a ceiling on total spend. */
  global: { max: 400, windowMs: 60 * 60_000 },
};

/** Where the markdown lives, relative to the project root (the working directory). */
export const CONTEXT_DIR = 'server/assistant/content';

/** Assembly order below the rules is: tone, global context, then project files. */
export const CONTEXT_FILES = {
  rules: 'assistant-rules.md',
  tone: 'ai-portfolio-tone.md',
  global: 'ai-assistant-portfolio-context.md',
  projects: {
    notebook: { file: 'ai-notebook.md', name: 'AI Notebook' },
    barclay: { file: 'community-barclay-instructions.md', name: 'Barclay Woods' },
    cs1501: { file: 'cs-1501.md', name: 'CS 1501: Building Software with AI Systems' },
  },
} as const;

/** How the visitor's current page is described to the model. */
export const PAGE_DESCRIPTIONS = {
  home: 'the portfolio homepage, which introduces all three projects',
  barclay: 'the Barclay Woods project page',
  notebook: 'the AI Notebook project page',
  cs1501: 'the CS 1501 project page',
  other: 'a page outside the main portfolio projects',
} as const;
