import express from 'express';
import { CHAT_ENDPOINT } from '../shared/assistant.js';
import { ANALYTICS_EXPORT_PATH, handleAnalyticsExport } from './analytics/adminRoute.js';
import { handleChat } from './chatRoute.js';

/**
 * The API only, with no static files. Used directly by the Vite dev server
 * and mounted under the static file server in production (see index.ts).
 */
export function createApiApp() {
  const api = express();
  api.disable('x-powered-by');
  // Render (and most hosts) sit behind one proxy; trust it so req.ip is the visitor.
  api.set('trust proxy', 1);

  api.post(CHAT_ENDPOINT, express.json({ limit: '32kb' }), handleChat);

  // Admin-only: protected by ANALYTICS_ADMIN_KEY inside the handler, never linked from the site.
  api.get(ANALYTICS_EXPORT_PATH, handleAnalyticsExport);

  // Malformed JSON or an oversized body lands here, still without leaking details.
  api.use(CHAT_ENDPOINT, (err: unknown, _req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (!err) return next();
    res.status(400).json({ error: { code: 'bad_request' } });
  });

  api.use('/api', (_req, res) => {
    res.status(404).json({ error: { code: 'bad_request' } });
  });

  return api;
}
