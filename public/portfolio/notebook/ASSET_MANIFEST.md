# Notebook — case-study media manifest

> **Status — 2026-09-09.** This curated-stills plan is still valid and is
> **not** superseded — the numbered `.mov` recordings and these stills are
> both intentional; a Notebook section may mix video and a still where a
> paused state reads better. None of S1–S7 (`multi-tree-page.png`,
> `contextual-question.png`, `proposal-approval.png`, `focus-shift.png`,
> `geometry-inspector.png`, `table-proposal.png`) were locatable as clean
> cropped originals on this machine — the only Notebook captures found are
> mid-workflow fragments or carry Safari chrome. Poster frames pulled from
> the numbered clips (`videos/notebook-NN-*-poster.jpg`) stand in for that
> intent for now. `live-build.mp4` is covered by the numbered `.mp4` encodes.


Asset-selection pass. Nothing here is the case-study page — this is the
shortlist, the naming, and the point each asset has to make.

Destination folder (repo convention): `public/portfolio/notebook/`
→ served at `/portfolio/notebook/<file>`
(The brief said `public/projects/notebook/`; this repo's convention is
`public/portfolio/notebook/` — see `public/portfolio/README.md`.)

Preserve originals: copy at native resolution, no crop, no edits, no browser
frame, no annotation, no recolor.

---

## Selected — in case-study order

| # | File | Media | Aspect | Source (supplied) | The system-design point |
|---|------|-------|--------|-------------------|-------------------------|
| 1 | `live-build.mp4` + `live-build-poster.jpg` | video | 16/9 | Live-build screen recording (see "Video" below) | AI builds *beside* the user: it proposes structure, the person accepts it, the accepted structure joins the page. The middle ground between hand-mapping a system and letting AI generate one unattended. |
| 2 | `multi-tree-page.png` | static | native (~16/10) | S1 — "Community Features" at 53%, several independent trees stacked down the page, "Build from here" prompt, Geometry panel open | A Notebook page is *several independent systems* on one surface, each its own tree/lane — not one flowchart. Scale and structure are native to the tool. |
| 3 | `contextual-question.png` | static | native | S3 — a Yes/No/Other question sitting beside "Surveys / Polls", those nodes lit, header "About Surveys and 5 related items" | Spatial AI: a short decision appears at the exact tree context it concerns, with that context highlighted, instead of every AI exchange being pushed into a chat panel. |
| 4 | `proposal-approval.png` | static | native | S2 — "PROPOSED — NOT YET PART OF THE PAGE", muted proposed child nodes under an accepted parent, `Accept / Deny / Other` | Proposed structure stays visually distinct from accepted architecture and does not enter the system without a human decision. |
| 5 | `focus-shift.png` | static | native | S5 — "User Engagement" page, view moved down to a second tree, "Incentives for Participation" subtree lit, proposal docked to its right | The environment moves and focuses around the part of the system under discussion — AI reasons about a *specific* region, framed and illuminated, then moves on. |
| 6 | `geometry-inspector.png` | static | native | S4 — hierarchy-depth colouring on, Geometry inspector on (node / subtree / tree bounds + connector anchors), 149% | A deterministic geometry engine owns placement (AI decides structure, not coordinates). Evidence the tool carries a real system's size and depth, not a toy graph. |
| 7 | `table-proposal.png` | static | native | S6 — Tables view, "Comprehensive Support Structure for Ticket Booking", generated tables each with a PURPOSE column | Accepted hierarchy can be re-expressed as a deliberate table (rows / entities / stages), with rationale — and that transformation is itself a proposal the user accepts. |

### Optional 8th (held, not selected)
| `inline-refinement.png` | static | native | S7 — "Community Features" at 72%, hierarchy + geometry bounds, "Added a first detail under 'Polls'. Adjust or expand from here." with an inline text field | If the story wants an "iterate on a proposal in place" beat. Omitted from the core set because S1 already carries multi-tree scale and S4 carries geometry. |

---

## Omitted

- **S7** — folded into "optional 8th" above; redundant with S1 + S4 for the
  core seven.
- **Full-screen Notebook screenshots on the Desktop** (pages "Target
  Audience", "Key Features", "User Insights", "Summary") — same UI, but
  captured with Safari chrome / dock / other windows visible. The supplied
  set is already cropped to the app; using these would mean adding or
  cropping a browser frame. The supplied versions win.
- **`Screen Recording 2026-08-02` / `2026-08-15` (.mov)** — predate this
  rebuilt UI (Geometry panel, hierarchy colouring, Tables, "PROPOSED — NOT
  YET PART OF THE PAGE"). Mixing them in would show an inconsistent product.

---

## Video (asset 1)

Presumed source: `Screen Recording 2026-09-04 at 2.08.33 PM.mov`
(~2.85 MB; same working session as the stills; only post-rebuild recording).
Not yet verified frame-by-frame — see blocker 3.

Target encode: H.264 MP4, **no audio track**, ~1600 px wide, ≤ ~8 MB,
trimmed to a clean loop (no visible cut — the hero runs without controls).

Playback, per the brief:

- autoplay / muted / loop / `playsInline` — already done by the site's
  `MediaVideo` component (`src/components/Media.tsx`).
- reduced-motion static fallback — already done: it holds on `poster` with a
  Play control.
- **no visible controls** — not default; pass `controls={false}` to the
  hero's `Media` / `VideoBlock`.
- **2× playback** — set `video.playbackRate = 2` in code (add a `rate?` prop
  to `VideoMedia` or set it in a `useEffect` in `MediaVideo`). **Do not
  re-encode the file to fake 2×** — `playbackRate` is exact, reversible, and
  keeps the original intact.
- `poster` frame — export one still at native resolution from a moment that
  shows a proposal on the canvas with the tree visible (not a blank canvas).
  `.jpg`, no edits.

---

## Placement (blocked — see below)

Once the files are in a readable location, each asset is one copy, e.g.:

```
cp "<readable>/Screenshot ... (S1).png"  public/portfolio/notebook/multi-tree-page.png
cp "<readable>/Screenshot ... (S3).png"  public/portfolio/notebook/contextual-question.png
cp "<readable>/Screenshot ... (S2).png"  public/portfolio/notebook/proposal-approval.png
cp "<readable>/Screenshot ... (S5).png"  public/portfolio/notebook/focus-shift.png
cp "<readable>/Screenshot ... (S4).png"  public/portfolio/notebook/geometry-inspector.png
cp "<readable>/Screenshot ... (S6).png"  public/portfolio/notebook/table-proposal.png
# video: transcode the .mov → live-build.mp4 (strip audio), export live-build-poster.jpg
```

### Blockers (this pass could not place files)

1. **This shell cannot read `~/Desktop`** (macOS privacy protection). The
   supplied stills and the `.mov` live there. They can be *viewed* (Read
   tool) but not *copied* into this folder. Fix: move the 7 chosen stills +
   the chosen `.mov` into `~/Downloads/…`, or grant the terminal Full Disk
   Access. Then the copies above run as-is.
2. **No `ffmpeg` / `ffprobe`** in this environment — cannot transcode the
   video, cut the poster, or read its dimensions/length here.
3. **Hero recording not yet confirmed.** `Screen Recording 2026-09-04 …
   .mov` is inferred from date + size + being the only post-rebuild capture.
   Needs one look once readable; if it doesn't clearly show *AI proposes →
   human accepts → structure lands*, a fresh capture is the better hero.
