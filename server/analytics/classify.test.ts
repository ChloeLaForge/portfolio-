import assert from 'node:assert/strict';
import { test } from 'node:test';
import { classifyTopic, extractFallbackMarker, looksLikeFallback, redactSecrets } from './classify.js';

const topic = (q: string, r: string | null = null, page: Parameters<typeof classifyTopic>[2] = 'home', fb = false) => classifyTopic(q, r, page, fb);

test('names a project when the visitor does', () => {
  assert.equal(topic('How does AI Notebook work?'), 'AI Notebook');
  assert.equal(topic('Why did Chloe build Barclay Woods?'), 'Barclay Woods');
  assert.equal(topic('Tell me about CS 1501.'), 'CS 1501');
  assert.equal(topic('What do vendors do in the HOA platform?'), 'Barclay Woods');
  assert.equal(topic('What is the course about?'), 'CS 1501');
});

test('two projects, or a connecting question, is cross-project', () => {
  assert.equal(topic('How is Notebook different from Barclay Woods?'), 'Cross-project');
  assert.equal(topic('What is the connection between these projects?'), 'Cross-project');
  assert.equal(topic('Which project involved databases?'), 'Cross-project');
  assert.equal(topic('How did the portfolio projects evolve?'), 'Cross-project');
});

test('portfolio-level and personal questions', () => {
  assert.equal(topic('What did Chloe build?'), 'Portfolio');
  assert.equal(topic('Tell me about the projects'), 'Portfolio');
  assert.equal(topic('Who is George?'), 'About Chloe');
  assert.equal(topic('What does Chloe study?'), 'About Chloe');
  assert.equal(topic('Tell me something fun about Chloe'), 'About Chloe');
});

test('vague follow-ups use what the reply was about', () => {
  assert.equal(topic('What database did she use?', 'For **AI Notebook**, the design points to Supabase.'), 'AI Notebook');
  assert.equal(topic('Any hard parts?', 'Both Notebook and Barclay Woods had tricky parts.'), 'Cross-project');
});

test('unanswerable or off-topic questions are Unknown / Other, but a named project keeps its topic', () => {
  assert.equal(topic("What's the weather today?", 'That is outside what I am here for.'), 'Unknown / Other');
  assert.equal(topic("What is Chloe's GPA?", "That didn't make it into my Chloe database. I can tell you about AI Notebook, Barclay Woods and CS 1501.", 'home', true), 'Unknown / Other');
  assert.equal(topic('How many hours did AI Notebook take?', "I don't have an official hour count.", 'notebook', true), 'AI Notebook');
});

test('failed requests have no reply, so the page is the last resort', () => {
  assert.equal(topic('what was the hardest part?', null, 'notebook'), 'AI Notebook');
  assert.equal(topic('what was the hardest part?', null, 'home'), 'Unknown / Other');
});

test('detects the fallback marker and removes it', () => {
  const { text, declared } = extractFallbackMarker('- No data on that.\n- Want the quick version?\n[[FALLBACK]]');
  assert.equal(declared, true);
  assert.equal(text, '- No data on that.\n- Want the quick version?');
  assert.deepEqual(extractFallbackMarker('A normal answer.'), { text: 'A normal answer.', declared: false });
  assert.equal(extractFallbackMarker('x [[ fallback ]] y').text.includes('['), false);
});

test('fallback phrases from the tone guide are recognised; normal answers are not', () => {
  for (const reply of [
    "That one didn't make it into my Chloe database. Tragic schema oversight.",
    "I don't have an official hour count, and I'm not brave enough to fabricate Chloe's Git history.",
    'Apparently nobody thought to add favorite_food to my context table.',
    "My financial-reporting department is currently just me, so I won't invent a number.",
    "The portfolio doesn't give an exact timeline for that one.",
    'The exact duration is not specified in the portfolio.',
  ]) assert.equal(looksLikeFallback(reply), true, reply);

  for (const reply of [
    '- **AI Notebook** is a visual human-AI workspace.\n- The user can accept, reject, or redirect proposals.',
    'Barclay Woods does not directly collect card credentials; checkout is handed to Stripe.',
    'Chloe is a third-year Systems Engineering student at UVA.',
  ]) assert.equal(looksLikeFallback(reply), false, reply);
});

test('redacts key-shaped strings and configured secrets', () => {
  process.env.ANALYTICS_ADMIN_KEY = 'test-admin-key-value-1234567890';
  assert.equal(redactSecrets('my key is sk-abcdefghijklmnop1234 ok'), 'my key is [redacted] ok');
  assert.equal(redactSecrets('use test-admin-key-value-1234567890 to log in'), 'use [redacted] to log in');
  assert.equal(redactSecrets('nothing secret here'), 'nothing secret here');
  delete process.env.ANALYTICS_ADMIN_KEY;
});
