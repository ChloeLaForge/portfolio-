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

## Deploying

Static build. `npm run build` → deploy `dist/`. On Netlify/Vercel, add an SPA
rewrite (all paths → `/index.html`) so `/notebook` works on a hard refresh.
