import { existsSync } from 'node:fs';
import path from 'node:path';
import compression from 'compression';
import express from 'express';
import { initAnalytics } from './analytics/store.js';
import { assertContextFilesExist } from './assistant/context.js';
import { createApiApp } from './app.js';

// Local convenience: load .env if present. Hosts like Render inject real environment variables instead.
try {
  process.loadEnvFile();
} catch {
  /* no .env file, which is expected in production */
}

process.env.NODE_ENV ??= 'production';

assertContextFilesExist();
if (!process.env.OPENAI_API_KEY?.trim()) {
  console.error('[assistant] OPENAI_API_KEY is not set. The site will run, but the assistant will answer "unavailable" until it is.');
}

void initAnalytics();

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(compression());
app.use(createApiApp());

// Serve the built site too when dist/ exists, so one service can host everything.
// An API-only deployment simply omits the build step for the frontend.
const distDir = path.resolve(process.cwd(), 'dist');
if (existsSync(path.join(distDir, 'index.html'))) {
  app.use(
    express.static(distDir, {
      index: false,
      setHeaders(res, filePath) {
        // Vite fingerprints everything in /assets, so it can be cached indefinitely.
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        }
      },
    }),
  );
  // Single-page app fallback: unknown paths (e.g. /notebook on a hard refresh) get index.html.
  app.use((req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next();
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(distDir, 'index.html'));
  });
}

const port = Number(process.env.PORT) || 8787;
app.listen(port, () => {
  console.log(`[server] listening on :${port}`);
});
