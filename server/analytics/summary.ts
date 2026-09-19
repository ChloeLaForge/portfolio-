import { ASSISTANT_PAGES, type AssistantPage } from '../../shared/assistant.js';
import { TOPICS, type ChatRecord, type Topic } from './types.js';

/** Pure aggregation over stored records; no I/O, so it is easy to test. */

export interface Summary {
  totalQuestions: number;
  totalSessions: number;
  successful: number;
  errors: number;
  fallbacks: number;
  /** Fallbacks as a share of successful responses, 0 to 1. */
  fallbackRate: number;
  errorRate: number;
  byTopic: Record<Topic, number>;
  byPage: Record<AssistantPage, number>;
  fallbacksByTopic: Record<Topic, number>;
  errorsByType: Record<string, number>;
  firstAt: Date | null;
  lastAt: Date | null;
}

export function buildSummary(records: ChatRecord[]): Summary {
  const byTopic = Object.fromEntries(TOPICS.map((t) => [t, 0])) as Record<Topic, number>;
  const fallbacksByTopic = { ...byTopic };
  const byPage = Object.fromEntries(ASSISTANT_PAGES.map((p) => [p, 0])) as Record<AssistantPage, number>;
  const errorsByType: Record<string, number> = {};
  const sessions = new Set<string>();
  let successful = 0;
  let errors = 0;
  let fallbacks = 0;

  for (const r of records) {
    sessions.add(r.sessionId);
    byTopic[r.topic] = (byTopic[r.topic] ?? 0) + 1;
    byPage[r.page] = (byPage[r.page] ?? 0) + 1;
    if (r.status === 'success') successful++;
    else {
      errors++;
      const type = r.errorType ?? 'unknown_server_error';
      errorsByType[type] = (errorsByType[type] ?? 0) + 1;
    }
    if (r.fallbackUsed) {
      fallbacks++;
      fallbacksByTopic[r.topic] = (fallbacksByTopic[r.topic] ?? 0) + 1;
    }
  }

  return {
    totalQuestions: records.length,
    totalSessions: sessions.size,
    successful,
    errors,
    fallbacks,
    fallbackRate: successful ? fallbacks / successful : 0,
    errorRate: records.length ? errors / records.length : 0,
    byTopic,
    byPage,
    fallbacksByTopic,
    errorsByType,
    firstAt: records[0]?.createdAt ?? null,
    lastAt: records[records.length - 1]?.createdAt ?? null,
  };
}

/* ---------- Common questions ---------- */

const STOP_WORDS = new Set(
  (
    'a an the is are was were be been do does did done how what why when where which who whom whose tell me about of to in on for ' +
    'and or with it its this that these those can could would should will you your i my we us please explain describe give show ' +
    'more some any have has had chloe chloes she her hers he his they their there here at as by from into than then so if but not no yes ' +
    'just also really actually quick quickly little bit'
  ).split(' '),
);

function stem(word: string): string {
  return word.length > 3 && word.endsWith('s') && !word.endsWith('ss') ? word.slice(0, -1) : word;
}

/**
 * Deterministic grouping key: lowercase, drop punctuation and filler words,
 * collapse plurals, ignore word order. "What is AI Notebook?" and
 * "Tell me about AI notebook" share a key. Falls back to the plain text when
 * nothing meaningful is left, so short questions never merge into one bucket.
 */
export function normalizeQuestion(question: string): string {
  const words = question
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .split(' ')
    .filter((w) => w && !STOP_WORDS.has(w))
    .map(stem);
  const key = [...new Set(words)].sort().join(' ');
  return key || question.toLowerCase().trim();
}

export interface CommonQuestion {
  question: string;
  otherWordings: string[];
  timesAsked: number;
  sessions: number;
  topic: Topic;
  fallbackCount: number;
  firstAsked: Date;
  lastAsked: Date;
}

export function groupCommonQuestions(records: ChatRecord[]): CommonQuestion[] {
  const groups = new Map<string, ChatRecord[]>();
  for (const r of records) {
    const key = normalizeQuestion(r.question);
    const list = groups.get(key);
    if (list) list.push(r);
    else groups.set(key, [r]);
  }

  const result: CommonQuestion[] = [];
  for (const list of groups.values()) {
    const latest = list[list.length - 1]; // records arrive oldest first
    const topicCounts = new Map<Topic, number>();
    for (const r of list) topicCounts.set(r.topic, (topicCounts.get(r.topic) ?? 0) + 1);
    const topic = [...topicCounts.entries()].sort((a, b) => b[1] - a[1])[0][0];
    const wordings = [...new Set(list.map((r) => r.question.trim()))].filter((q) => q !== latest.question.trim());

    result.push({
      question: latest.question.trim(),
      otherWordings: wordings.slice(-3),
      timesAsked: list.length,
      sessions: new Set(list.map((r) => r.sessionId)).size,
      topic,
      fallbackCount: list.filter((r) => r.fallbackUsed).length,
      firstAsked: list[0].createdAt,
      lastAsked: latest.createdAt,
    });
  }
  return result.sort((a, b) => b.timesAsked - a.timesAsked || b.lastAsked.getTime() - a.lastAsked.getTime());
}
