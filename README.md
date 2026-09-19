# Chloe LaForge — portfolio

React + TypeScript + Vite. No UI framework, no CSS-in-JS, no animation library.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # typecheck + production build to dist/
```

## Where things are

```
src/
├── content/          ← edit these first
│   ├── site.ts       nav links, hero copy, about copy, LinkedIn link
│   ├── projects.ts   project titles, routes, homepage preview media
│   └── media.ts      the Media type + the slot() helper
├── sections/         homepage only: Hero, Core (branch diagram), Work, About
├── components/       reusable across project pages
├── pages/            Home + one file per project route
├── styles/
│   ├── tokens.css    ← all colour, type, spacing, motion lives here
│   └── base.css      reset, layout primitives, reveal + route transitions
└── lib/              three small hooks
```

**Change the look:** `src/styles/tokens.css`. Every colour and size on the site
resolves to a variable in that file.

**Change the words:** `src/content/site.ts`.

**Change a project:** `src/content/projects.ts` for its name, route and homepage
preview; `src/pages/<Project>.tsx` for the page itself.

**Change the media:** see `public/portfolio/README.md`.

## Routes

`/` · `/notebook` · `/barclay-woods` · `/cs1501`

Project pages are shells. Each composes a different sequence of blocks on
purpose — reorder, delete, or add from `src/components` freely:

`ProjectHero` `LargeMedia` `VideoBlock` `ImageGrid` `TextSection`
`CaptionedMedia` `ProcessSection` `FullBleedMedia` `NextProject`

All of them import from `'../components'`.

## Placeholders

Two kinds, both deliberately visible:

- **Media slots** render as a ruled well printing the file path they want.
- **`<Placeholder>`** renders grey copy with the source file that contains it.

If you can see either one on the live site, it still needs your content.

## Portfolio assistant

A chat panel on every page, answering from the markdown in
`server/assistant/content/`. The browser only ever calls `POST /api/chat` on
our own server, which calls OpenAI. The key never reaches the client.

```
src/assistant/            launcher, panel, chat hook, API helper
src/content/assistant.ts  every visitor-facing string
shared/assistant.ts       request/response types and input limits
server/                   Express API (+ serves dist/ when it exists)
server/assistant/config.ts   model, token cap, rate limits, file names
server/assistant/content/    the knowledge + tone + rules (edit these)
```

**Change what it knows or how it sounds:** edit the `.md` files in
`server/assistant/content/` and redeploy. `assistant-rules.md` holds the
guardrails; `ai-portfolio-tone.md` is the voice.
**Change the model:** `ASSISTANT_MODEL` in `server/assistant/config.ts`, or set
`OPENAI_MODEL` in the environment.

```bash
cp .env.example .env     # then set OPENAI_API_KEY (server-side only, gitignored)
npm run dev              # /api/chat is served by the Vite dev server
npm run build && npm start   # production server: API + built site
```

## Chat analytics

Every real visitor question is recorded (timestamp, anonymous session id, page,
question, answer, topic, fallback flag, status, error type, model) in a
PostgreSQL table, `chat_log`, so you can review what visitors ask. No IP
address, cookie or other identifier is stored. Logging happens after the reply
is sent and can never break a chat. Code lives in `server/analytics/`.

```bash
# Set DATABASE_URL and ANALYTICS_ADMIN_KEY (16+ random characters) on the server, then:
curl -H "Authorization: Bearer $ANALYTICS_ADMIN_KEY" \
  https://<your-service>.onrender.com/api/admin/analytics/export -o portfolio-chat-analytics.xlsx
```

The workbook has `CHAT LOG`, `SUMMARY` and `COMMON QUESTIONS` sheets. Topics and
fallback detection are plain keyword rules (`server/analytics/classify.ts`), and
`npm test` runs their unit tests. Without `DATABASE_URL` the chat still works and
the server log says nothing is being recorded.

## Deploying

The site is still a static build (`dist/`). The assistant needs the Node server,
so it deploys as a Render **Web Service** (build `npm install && npm run build:server`,
start `npm start`, env vars `OPENAI_API_KEY`, `DATABASE_URL`, `ANALYTICS_ADMIN_KEY`). Either keep the static site and
add a rewrite `/api/*` -> `https://<web-service>.onrender.com/api/*` above its
catch-all rewrite, or serve everything from the Web Service
(build `npm install && npm run build`). A static host needs an SPA rewrite
(all paths to `/index.html`) so `/notebook` works on a hard refresh.
