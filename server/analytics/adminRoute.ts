import { createHash, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';
import { analyticsConfigured, fetchAllChatRecords } from './store.js';
import { buildWorkbook } from './workbook.js';

export const ANALYTICS_EXPORT_PATH = '/api/admin/analytics/export';

/** A short key is guessable, so refuse to run with one rather than pretend to be protected. */
const MIN_KEY_LENGTH = 16;

const digest = (value: string) => createHash('sha256').update(value).digest();

let warnedKey = false;
function warnOnce(message: string): void {
  if (warnedKey) return;
  warnedKey = true;
  console.error(`[analytics] ${message}`);
}

/**
 * The key is compared as hashes with a constant-time check, and only ever
 * accepted from the Authorization header so it never lands in URLs or access logs.
 */
function isAuthorized(req: Request): boolean {
  const configured = process.env.ANALYTICS_ADMIN_KEY?.trim();
  if (!configured) {
    warnOnce('ANALYTICS_ADMIN_KEY is not set, so the analytics export is disabled.');
    return false;
  }
  if (configured.length < MIN_KEY_LENGTH) {
    warnOnce(`ANALYTICS_ADMIN_KEY is shorter than ${MIN_KEY_LENGTH} characters, so the analytics export is disabled. Use a long random value.`);
    return false;
  }
  const match = /^Bearer\s+(\S+)$/i.exec(req.get('authorization') ?? '');
  return match !== null && timingSafeEqual(digest(match[1]), digest(configured));
}

export async function handleAnalyticsExport(req: Request, res: Response): Promise<void> {
  res.set('Cache-Control', 'no-store');

  if (!isAuthorized(req)) {
    console.error('[analytics] Rejected an analytics export request: missing or invalid credential.');
    res.status(401).json({ error: 'unauthorized' });
    return;
  }
  if (!analyticsConfigured()) {
    res.status(503).json({ error: 'analytics storage is not configured (DATABASE_URL)' });
    return;
  }

  try {
    const workbook = await buildWorkbook(await fetchAllChatRecords());
    res.set({
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': 'attachment; filename="portfolio-chat-analytics.xlsx"',
    });
    res.send(workbook);
  } catch (err) {
    console.error(`[analytics] Export failed: ${(err as Error).message}`);
    res.status(500).json({ error: 'export failed' });
  }
}
