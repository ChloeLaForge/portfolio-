import { readFileSync } from 'node:fs';
import path from 'node:path';
import type { AssistantPage } from '../../shared/assistant.js';
import { CONTEXT_DIR, CONTEXT_FILES, PAGE_DESCRIPTIONS } from './config.js';

type ProjectKey = keyof typeof CONTEXT_FILES.projects;
const PROJECT_KEYS = Object.keys(CONTEXT_FILES.projects) as ProjectKey[];

/** Read once in production; re-read on every request in dev so markdown edits show up immediately. */
const cache = new Map<string, string>();

function readContext(file: string): string {
  const cached = cache.get(file);
  if (cached !== undefined) return cached;
  const text = readFileSync(path.resolve(process.cwd(), CONTEXT_DIR, file), 'utf8').trim();
  if (process.env.NODE_ENV === 'production') cache.set(file, text);
  return text;
}

function documentBlock(name: string, body: string): string {
  return `<document name="${name}">\n${body}\n</document>`;
}

/** Which project file belongs to the page, if any. */
function projectForPage(page: AssistantPage): ProjectKey | null {
  return page === 'notebook' || page === 'barclay' || page === 'cs1501' ? page : null;
}

/**
 * Builds the full instruction text for one request.
 *
 * Order encodes priority: rules, tone guide, global context, the project
 * the visitor is viewing, the remaining projects, then the current page.
 * The leading blocks are identical for every visitor so OpenAI's automatic
 * prompt caching can reuse them.
 */
export function buildInstructions(page: AssistantPage): string {
  const current = projectForPage(page);
  const projectOrder = current ? [current, ...PROJECT_KEYS.filter((key) => key !== current)] : PROJECT_KEYS;

  const parts = [
    readContext(CONTEXT_FILES.rules),
    'The reference documents follow. They are the only source of facts about Chloe.',
    documentBlock('Tone guide (voice, format, fallback behavior)', readContext(CONTEXT_FILES.tone)),
    documentBlock('Global portfolio context', readContext(CONTEXT_FILES.global)),
    ...projectOrder.map((key) => {
      const { file, name } = CONTEXT_FILES.projects[key];
      const label = key === current ? `${name} (the project the visitor is viewing)` : name;
      return documentBlock(`Project detail: ${label}`, readContext(file));
    }),
    `The visitor is currently viewing ${PAGE_DESCRIPTIONS[page]}.`,
  ];

  return parts.join('\n\n');
}

/** Fails fast at boot if a context file was renamed or deleted. */
export function assertContextFilesExist(): void {
  buildInstructions('home');
}
