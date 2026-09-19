import pg from 'pg';
import type { AssistantPage } from '../../shared/assistant.js';
import type { ChatRecord, ChatStatus, NewChatRecord, Topic } from './types.js';

/**
 * Permanent storage for chat analytics: one Postgres table, reached through
 * the DATABASE_URL environment variable. Render's local disk is wiped on every
 * deploy and restart, so nothing here touches the filesystem.
 */

const SCHEMA = `
CREATE TABLE IF NOT EXISTS chat_log (
  id            BIGSERIAL PRIMARY KEY,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  session_id    TEXT        NOT NULL,
  page          TEXT        NOT NULL,
  question      TEXT        NOT NULL,
  response      TEXT,
  topic         TEXT        NOT NULL,
  fallback_used BOOLEAN     NOT NULL DEFAULT FALSE,
  status        TEXT        NOT NULL,
  error_type    TEXT,
  model         TEXT        NOT NULL
);
CREATE INDEX IF NOT EXISTS chat_log_created_at_idx ON chat_log (created_at);
CREATE INDEX IF NOT EXISTS chat_log_session_idx ON chat_log (session_id);
`;

let pool: pg.Pool | null = null;
let schemaReady: Promise<void> | null = null;

export function analyticsConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

function getPool(): pg.Pool {
  if (pool) return pool;

  const url = new URL(process.env.DATABASE_URL!.trim());
  // Decide TLS ourselves: hosted databases need it, a local one does not. The
  // certificate is not verified because Render's private network uses self-signed ones.
  const mode = url.searchParams.get('sslmode');
  url.searchParams.delete('sslmode');
  const local = ['localhost', '127.0.0.1', '::1', '[::1]'].includes(url.hostname);
  const ssl = local || mode === 'disable' ? false : { rejectUnauthorized: false };

  pool = new pg.Pool({ connectionString: url.toString(), ssl, max: 3, connectionTimeoutMillis: 5_000, idleTimeoutMillis: 30_000 });
  // Without this handler a dropped idle connection would crash the whole server.
  pool.on('error', (err) => console.error(`[analytics] Database connection error: ${err.message}`));
  return pool;
}

/** Creates the table on first use. A failure is not cached, so the next call retries. */
export function ensureSchema(): Promise<void> {
  schemaReady ??= getPool()
    .query(SCHEMA)
    .then(() => undefined)
    .catch((err) => {
      schemaReady = null;
      throw err;
    });
  return schemaReady;
}

export async function insertChatRecord(record: NewChatRecord): Promise<void> {
  await ensureSchema();
  await getPool().query(
    `INSERT INTO chat_log (session_id, page, question, response, topic, fallback_used, status, error_type, model)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
    [record.sessionId, record.page, record.question, record.response, record.topic, record.fallbackUsed, record.status, record.errorType, record.model],
  );
}

export async function fetchAllChatRecords(): Promise<ChatRecord[]> {
  await ensureSchema();
  const { rows } = await getPool().query(
    `SELECT created_at, session_id, page, question, response, topic, fallback_used, status, error_type, model
     FROM chat_log ORDER BY created_at ASC, id ASC`,
  );
  return rows.map((row) => ({
    createdAt: row.created_at as Date,
    sessionId: row.session_id as string,
    page: row.page as AssistantPage,
    question: row.question as string,
    response: row.response as string | null,
    topic: row.topic as Topic,
    fallbackUsed: row.fallback_used as boolean,
    status: row.status as ChatStatus,
    errorType: row.error_type as string | null,
    model: row.model as string,
  }));
}

/** Called once at boot so a wrong DATABASE_URL shows up in the logs immediately, not on the first visitor. */
export async function initAnalytics(): Promise<void> {
  if (!analyticsConfigured()) {
    console.error('[analytics] DATABASE_URL is not set. Chat interactions are NOT being recorded until it is.');
    return;
  }
  try {
    await ensureSchema();
    console.log('[analytics] Connected. chat_log table is ready.');
  } catch (err) {
    console.error(`[analytics] Could not reach the database: ${(err as Error).message}`);
  }
}
