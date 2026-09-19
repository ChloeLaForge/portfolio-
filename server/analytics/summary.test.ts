import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildSummary, groupCommonQuestions, normalizeQuestion } from './summary.js';
import type { ChatRecord } from './types.js';

let clock = Date.UTC(2026, 8, 1);
const rec = (over: Partial<ChatRecord>): ChatRecord => ({
  createdAt: new Date((clock += 60_000)),
  sessionId: 's1',
  page: 'home',
  question: 'q',
  response: 'r',
  topic: 'Portfolio',
  fallbackUsed: false,
  status: 'success',
  errorType: null,
  model: 'm',
  ...over,
});

test('summary counts, sessions, fallbacks and error breakdown', () => {
  const records = [
    rec({ sessionId: 'a', page: 'notebook', topic: 'AI Notebook' }),
    rec({ sessionId: 'a', page: 'notebook', topic: 'AI Notebook', fallbackUsed: true }),
    rec({ sessionId: 'b', page: 'home', topic: 'About Chloe' }),
    rec({ sessionId: 'b', page: 'home', topic: 'Portfolio', status: 'error', response: null, errorType: 'provider_timeout' }),
  ];
  const s = buildSummary(records);
  assert.equal(s.totalQuestions, 4);
  assert.equal(s.totalSessions, 2);
  assert.equal(s.successful, 3);
  assert.equal(s.errors, 1);
  assert.equal(s.fallbacks, 1);
  assert.ok(Math.abs(s.fallbackRate - 1 / 3) < 1e-9);
  assert.equal(s.byTopic['AI Notebook'], 2);
  assert.equal(s.byTopic['Barclay Woods'], 0);
  assert.equal(s.byPage.notebook, 2);
  assert.equal(s.fallbacksByTopic['AI Notebook'], 1);
  assert.deepEqual(s.errorsByType, { provider_timeout: 1 });
});

test('empty log does not divide by zero', () => {
  const s = buildSummary([]);
  assert.equal(s.fallbackRate, 0);
  assert.equal(s.errorRate, 0);
  assert.equal(s.firstAt, null);
});

test('similar wordings share a normalized key', () => {
  assert.equal(normalizeQuestion('What is AI Notebook?'), normalizeQuestion('tell me about ai notebook'));
  assert.equal(normalizeQuestion('Why did Chloe build Barclay Woods?'), normalizeQuestion('why did she build barclay woods'));
  assert.notEqual(normalizeQuestion('What is AI Notebook?'), normalizeQuestion('What is Barclay Woods?'));
  assert.notEqual(normalizeQuestion('hi'), normalizeQuestion('yo'));
});

test('common questions group, count, and sort', () => {
  const groups = groupCommonQuestions([
    rec({ sessionId: 'a', question: 'What is AI Notebook?', topic: 'AI Notebook' }),
    rec({ sessionId: 'b', question: 'tell me about ai notebook', topic: 'AI Notebook', fallbackUsed: true }),
    rec({ sessionId: 'b', question: 'Who is George?', topic: 'About Chloe' }),
  ]);
  assert.equal(groups.length, 2);
  assert.equal(groups[0].timesAsked, 2);
  assert.equal(groups[0].sessions, 2);
  assert.equal(groups[0].fallbackCount, 1);
  assert.equal(groups[0].question, 'tell me about ai notebook'); // most recent wording
  assert.deepEqual(groups[0].otherWordings, ['What is AI Notebook?']);
});
