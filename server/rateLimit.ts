import { RATE_LIMIT } from './assistant/config.js';

/**
 * In-memory sliding-window limiter. Fine for a single portfolio server:
 * state resets on restart and is not shared across instances, which is an
 * acceptable trade for a public site with no accounts.
 */

type Verdict = { ok: true } | { ok: false; reason: 'too_fast' | 'rate_limited'; retryAfterSec: number };

const perVisitor = new Map<string, number[]>();
let globalHits: number[] = [];

function recent(hits: number[], windowMs: number, now: number): number[] {
  return hits.filter((t) => now - t < windowMs);
}

export function checkRateLimit(visitor: string, now = Date.now()): Verdict {
  const { minGapMs, perVisitor: visitorLimit, global } = RATE_LIMIT;

  const hits = recent(perVisitor.get(visitor) ?? [], visitorLimit.windowMs, now);
  globalHits = recent(globalHits, global.windowMs, now);

  const last = hits[hits.length - 1];
  if (last !== undefined && now - last < minGapMs) {
    return { ok: false, reason: 'too_fast', retryAfterSec: 1 };
  }
  if (hits.length >= visitorLimit.max) {
    return { ok: false, reason: 'rate_limited', retryAfterSec: Math.ceil((hits[0] + visitorLimit.windowMs - now) / 1000) };
  }
  if (globalHits.length >= global.max) {
    return { ok: false, reason: 'rate_limited', retryAfterSec: Math.ceil((globalHits[0] + global.windowMs - now) / 1000) };
  }

  hits.push(now);
  globalHits.push(now);
  perVisitor.set(visitor, hits);
  return { ok: true };
}

/** Drop visitors whose window has fully expired so the map cannot grow without bound. */
setInterval(() => {
  const now = Date.now();
  for (const [visitor, hits] of perVisitor) {
    if (recent(hits, RATE_LIMIT.perVisitor.windowMs, now).length === 0) perVisitor.delete(visitor);
  }
}, 5 * 60_000).unref();
