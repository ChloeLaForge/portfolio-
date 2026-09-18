# tools — Barclay Woods media prep

Portfolio-only media derivation. Nothing here touches the Barclay Woods
application; it reads the screen-recording `.mov` originals (kept untouched in
`public/portfolio/barclay-woods/videos/`) and produces the web delivery assets.

## cropvid.swift → `cropvid`

Crops the Safari chrome + black rounded-corner margin off a recording and emits
an audio-stripped, bitrate-capped H.264 `.mp4` (1280 px wide) plus a first-frame
`-poster.jpg`. **No trim, no speed change** — 2× playback stays the site's
`playbackRate` (see `src/components/Media.tsx`).

```
swiftc -O cropvid.swift -o cropvid
./cropvid <in.mov> <out.mp4> <poster.jpg>
```

Crop rect (native 2872×2008, identical for every clip): `x=112 y=214 w=2648 h=1596`
→ delivered 1280×772. Derived by visually inspecting early/mid/late frames
(via a one-off AVAssetImageGenerator dump, not the delivered/cropped files) of
three representative recordings (01 vendor, 10 management ticket, 13 service
types) and finding each edge of the actual browser-window/app viewport
independently — not a symmetric "shrink the margins" guess:

- **left = 112**: the recording window's true left edge (verified: pixel 111
  is black, 112 is the window's first content column). The app's own sidebar
  background starts a little further in, at native x≈148 — the region
  112–148 is the window's own light inset, not black, so cropping at 148+
  would eat into the sidebar.
- **top = 214**: sits right after the Safari toolbar/tab-bar band and right
  at (2px above) the sidebar's top-left rounded corner (measured start:
  y=216). The main content card starts later still (~y=295), so nothing is
  clipped. (Checked again 2026-09-14 for headroom to recover: nothing but
  flat page background sits between the toolbar and y=216, so left as-is.)
- **right = 2759** (`x + w` inclusive): the window's true right edge (pixel
  2759 is content, 2760 is black).
- **bottom = 1809** (`y + h` inclusive, 2026-09-14, was 1859): the window's
  bottom edge is *rounded*, not square — row-by-row inspection at x=112 shows
  a smooth anti-aliased fade from full content down to pure (0,0,0) starting
  around y≈1781 and reaching solid black by y≈1812, identical in every
  sampled frame (clean and modal-dimmed alike). A rect that runs to the
  window's outer bounding box (1859, the previous value) therefore always
  bakes in a visible black wedge in the bottom-left and bottom-right corners
  once scaled down for delivery. y=1809 is the largest bottom value with zero
  fully-black pixels at the corners while still fully including the floating
  "View as" control, whose own last non-background pixel is y=1807.

Three earlier rects were tried and superseded:
1. original `x=170 y=214 w=2598 h=1722` — cut ~22px into the sidebar's left
   edge (170 vs. the window's true left edge of 112) and left a ~75px-tall
   black bar under the window (bottom overshot by that much).
2. `x=170 y=214 w=2590 h=1652` — fixed the black bar but not the sidebar cut.
3. `x=112 y=214 w=2648 h=1646` — fixed the sidebar cut but ran the bottom
   edge flush to the window's outer bounding box, which bakes in the rounded
   corners' anti-aliased black wedge in both bottom corners.

This rect (`h=1596`, 2026-09-14) was checked against all four edges on all
three representative clips, including two clips with an open modal (whose
darkened backdrop was ruled out as a confound — see above), before being
applied to the rest.

On-page clips processed and deployed (2026-09-09, re-cropped 2026-09-14):
`barclay-01, 03, 08, 10, 11, 12, 13, 16`. The pre-crop encodes for the clips no
longer used on the page (`05, 06, 07`) are in `precrop-backup/`.

## cropstill.swift → `cropstill`

Same crop, for the five product screenshots. Resolution-independent (crop is a
fraction of the frame), scales to ≤1600 px wide, writes PNG.

```
swiftc -O cropstill.swift -o cropstill
./cropstill <in.png> <out.png> [maxWidth]
```

### Pending: the five stills

The case study (`src/content/case-studies/barclay.ts`) references these; drop the
raw exports somewhere and run `cropstill` into place:

| target file (in `public/portfolio/barclay-woods/`) | screen |
|---|---|
| `barclay-home.png` | Home (resident) |
| `barclay-calendar.png` | Community Calendar |
| `barclay-operations.png` | Ticket Queue → Service Types |
| `barclay-payments.png` | Account / statement |
| `barclay-community-chat.png` | Community Chat (management view) |

```
./cropstill ~/raw/home.png ../public/portfolio/barclay-woods/barclay-home.png
# …one per screen
```

`precrop-backup/` holds the original uncropped `.mp4` + poster encodes, in case a
future pass wants a clip that is not currently on the page.

## cropshot.swift → `cropshot`

For the Notebook + Barclay **product screenshots** supplied with Safari chrome on
top (`~/chloelaforge/barclay-*.png`, `~/chloelaforge/notebook-*.png`). Unlike the
recordings these are full-bleed browser content — no black desktop margin — so
the only thing to remove is the toolbar band across the top. The crop is a single
top inset expressed as a fraction of the frame height, so it is
resolution-independent across the mixed capture sizes in the set.

```
swiftc -O cropshot.swift -o cropshot
./cropshot <in.png> <out.png> <topFrac> [maxWidth] [sideFrac] [botFrac]
```

Pass 2026-09-09: `topFrac 0.05`, `maxWidth 1600`, sides/bottom 0 — removes the
full Safari toolbar on both the ~1830×1230 (Barclay) and ~1520×930 (Notebook)
captures while leaving a few px of headroom above the app's own top bar.
Derivatives written:

| source (`~/chloelaforge/`) | portfolio derivative |
|---|---|
| `barclay-1.png` | `public/portfolio/barclay-woods/barclay-home.png` |
| `barclay-2.png` | `public/portfolio/barclay-woods/barclay-calendar.png` |
| `barclay-3.png` | `public/portfolio/barclay-woods/barclay-operations.png` |
| `barclay-4.png` | `public/portfolio/barclay-woods/barclay-payments.png` |
| `barclay-5.png` | `public/portfolio/barclay-woods/barclay-community-chat.png` |
| `notebook-7.png` | `public/portfolio/notebook/images/notebook-system-view.png` |
| `notebook-1.png` | `public/portfolio/notebook/images/notebook-live-build.png` |
| `notebook-5.png` | `public/portfolio/notebook/images/notebook-contextual-ai.png` |
| `notebook-3.png` | `public/portfolio/notebook/images/notebook-focus.png` |
| `notebook-4.png` | `public/portfolio/notebook/images/notebook-proposal.png` |
| `notebook-6.png` | `public/portfolio/notebook/images/notebook-decision.png` |
| `notebook-2.png` | `public/portfolio/notebook/images/notebook-tables.png` |

Originals in `~/chloelaforge/` are never modified.
