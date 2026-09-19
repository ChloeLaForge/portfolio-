import type { AssistantPage } from '../../shared/assistant.js';
import type { Topic } from './types.js';

/**
 * Deterministic topic and fallback detection. No model call: everything here
 * is keyword rules over the visitor's question and the assistant's reply, so
 * results are free, repeatable and easy to adjust.
 */

type Project = 'AI Notebook' | 'Barclay Woods' | 'CS 1501';

/** Wide patterns for what visitors type (they say "the course", "the HOA", "vendors"). */
const QUESTION_PROJECTS: Record<Project, RegExp> = {
  'AI Notebook': /\bnotebooks?\b/i,
  'Barclay Woods': /\b(barclay|hoa|homeowners?|vendors?|residents?|households?|stripe)\b/i,
  'CS 1501': /\b(cs[- ]?1501|1501|ai friend|course|curriculum|slides|pre-?class|teach(es|ing)?|taught)\b/i,
};

/** Strict patterns for the assistant's reply: only the project names themselves. */
const REPLY_PROJECTS: Record<Project, RegExp> = {
  'AI Notebook': /\bnotebook\b/i,
  'Barclay Woods': /\bbarclay\b/i,
  'CS 1501': /\bcs[- ]?1501\b|\b1501\b/i,
};

const CROSS_PROJECT =
  /\b(connect(s|ed|ion|ions)?|compar(e|es|ed|ison)|relat(e|es|ed|ionship|ionships)|across|together|in common|evol(ve|ved|ution)|progression|other projects?|each project|which (project|one)|between (the|these|her) )/i;

const PORTFOLIO =
  /\b(portfolio|projects|her work|chloe'?s work|what (did|has|does) (she|chloe) (build|built|make|made|create|created|do))\b/i;

const ABOUT_CHLOE =
  /\b(george|dog|bernedoodle|brothers?|siblings?|family|hometown|spring lake|new jersey|uva|university|virginia|systems engineering|engineering business|major|minor|studies|study|studying|third[- ]year|what year|how old|age|fun fact|something (fun|interesting)|about (chloe|her|herself)|who is (chloe|she)|background|hobbies|hobby|outside (of )?(the )?(technical|work)|favorite)\b/i;

function projectsIn(text: string, patterns: Record<Project, RegExp>): Project[] {
  return (Object.keys(patterns) as Project[]).filter((name) => patterns[name].test(text));
}

const PAGE_PROJECT: Partial<Record<AssistantPage, Project>> = {
  notebook: 'AI Notebook',
  barclay: 'Barclay Woods',
  cs1501: 'CS 1501',
};

/**
 * Order of precedence: what the visitor named, then general portfolio
 * themes, then what the reply talked about. A vague follow-up such as
 * "what database did she use?" is therefore filed under the project the
 * answer was about. If a request failed there is no reply, so the page the
 * visitor was on is the last resort.
 */
export function classifyTopic(question: string, response: string | null, page: AssistantPage, fallbackUsed: boolean): Topic {
  const named = projectsIn(question, QUESTION_PROJECTS);
  if (named.length >= 2) return 'Cross-project';
  if (named.length === 1) return CROSS_PROJECT.test(question) ? 'Cross-project' : named[0];

  if (CROSS_PROJECT.test(question)) return 'Cross-project';
  if (PORTFOLIO.test(question)) return 'Portfolio';
  if (ABOUT_CHLOE.test(question)) return 'About Chloe';

  if (response) {
    if (fallbackUsed) return 'Unknown / Other';
    const discussed = projectsIn(response, REPLY_PROJECTS);
    if (discussed.length >= 2) return 'Cross-project';
    if (discussed.length === 1) return discussed[0];
    return 'Unknown / Other';
  }
  return PAGE_PROJECT[page] ?? 'Unknown / Other';
}

/**
 * The model is asked to end an unknown-answer reply with this token (see
 * assistant-rules.md). It is removed before the visitor sees the reply.
 */
const FALLBACK_MARKER = /\s*\[\[\s*fallback\s*\]\]\s*/gi;

export function extractFallbackMarker(text: string): { text: string; declared: boolean } {
  const declared = /\[\[\s*fallback\s*\]\]/i.test(text);
  return { text: declared ? text.replace(FALLBACK_MARKER, ' ').trim() : text, declared };
}

/**
 * Backup for when the model forgets the marker: phrases the tone guide's
 * "When You Don't Know the Answer" section leads to. It can miss unusual
 * wording, so treat the Fallback Used column as a reliable signal, not a
 * perfect one.
 */
const FALLBACK_PHRASES: RegExp[] = [
  /\bdidn'?t make it into\b/i,
  /\b(i )?(don'?t|do not) (have|know)\b/i,
  /\bi can'?t (say|confirm|speak to|tell you)\b/i,
  /\b(won'?t|will not|can'?t|cannot|not going to) (invent|make up|fabricate|guess)\b/i,
  /\bnot brave enough\b/i,
  /\b(is|are|isn'?t|aren'?t|not) (not )?(specified|documented)\b/i,
  /\b(doesn'?t|does not) (say|specify|give|list|mention|document|cover)\b/i,
  /\bportfolio (context )?(doesn'?t|does not)\b/i,
  /\bno (documented|official|exact) (number|count|duration|timeline|metric|figure|detail)/i,
  /\b(context|chloe) (table|database)\b/i,
  /\bschema oversight\b/i,
];

export function looksLikeFallback(response: string): boolean {
  return FALLBACK_PHRASES.some((pattern) => pattern.test(response));
}

/** Keeps keys and connection strings out of stored text, even if a visitor pastes one or the model echoes one. */
export function redactSecrets(text: string): string {
  let out = text.replace(/\bsk-[A-Za-z0-9_-]{16,}/g, '[redacted]');
  for (const name of ['OPENAI_API_KEY', 'ANALYTICS_ADMIN_KEY', 'DATABASE_URL']) {
    const value = process.env[name]?.trim();
    if (value && value.length >= 8) out = out.split(value).join('[redacted]');
  }
  return out;
}
