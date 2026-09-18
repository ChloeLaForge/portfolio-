# Notebook — screen-recording asset index

> **Delivery status — 2026-09-09.** The nine on-page clips (01–04, 06–10) now
> ship a browser-safe sibling encode: `notebook-NN-*.mp4` (H.264, **audio
> track removed**, scaled to 1600 px wide, same frames — no trim, no speed
> change) plus a `notebook-NN-*-poster.jpg` still. Encoded with an
> AVFoundation export (no `ffmpeg` on this machine); the `.mov` originals in
> this folder are untouched. `notebook-05` was not encoded (omitted from the
> page). 2× playback stays a runtime setting in `MediaVideo`, never baked in.
> The case study (`src/content/case-studies/notebook.ts`) references the
> `.mp4`s. Curated stills from `../ASSET_MANIFEST.md` (multi-tree-page,
> contextual-question, proposal-approval, focus-shift, geometry-inspector,
> table-proposal) were **not** found as clean cropped originals on this
> machine and are still missing; poster frames stand in for that intent.


Ten screen recordings of the Notebook application, kept in the sequence the
author numbered them (1–10). The number is the intended order; the name after
it describes what the recording shows.

- **Location:** `public/portfolio/notebook/videos/` (served at
  `/portfolio/notebook/videos/<file>`).
  This repo namespaces media under `public/portfolio/<project>/` (see
  `public/portfolio/README.md`), not the `public/projects/notebook/videos/`
  path in the brief; the brief's convention-check clause applies, so the repo
  convention wins, with a `videos/` subfolder because these are numbered
  source captures in `.mov`, distinct from the flat delivery assets named in
  `../ASSET_MANIFEST.md`.
- **Untouched originals.** Files were moved verbatim from
  `~/chloelaforge/<n>-notebook.mov` (SHA-256 verified identical before the
  originals were removed). No edit, crop, compress, convert, or speed change.
  `.mov` / H.264 / 3132×2008, audio track still present. Any 2× playback,
  muting, looping, or `.mp4` transcode is a delivery-time concern, not done
  here.
- **Phase labels** follow the brief: PHASE 1 — DEFINE (idea → intake →
  summarized understanding → approval), PHASE 2 — BUILD (human + AI build →
  contextual questions → proposals → approval → tree growth), PHASE 3 —
  ORGANIZE (developed structure → usable representation → tables). "Supporting"
  is used where a clip demonstrates an inspection/navigation affordance rather
  than a phase beat.
- Descriptions are of on-screen behaviour only. Case-study framing is not part
  of this pass.

> ⚠️ **`notebook-05` is 0.5 seconds long** (≈15 frames, 452 KB). It is a valid,
> non-zero, playable file and its content is legible, but it is effectively a
> freeze-frame and is far shorter than every other clip. It reads as a
> truncated / mis-fired capture. Confirm whether it is intentional or should be
> re-recorded before it is used anywhere.

---

### Notebook 01
Original: `~/chloelaforge/1-notebook.mov`
New filename: `notebook-01-intake-and-questions.mov`
Phase: PHASE 1 — DEFINE
Feature: Idea intake + structured pre-build questions
One-sentence description: A one-line "What do you want to build?" description is
typed, Notebook says "Thinking about what I need to know…", then asks a short
structured set (Question 2 of 4 "Which features are most important", Question 4
of 4 "Anything else…"), and "Build my notebook" kicks off with "Almost ready…".
Potential portfolio role: Opening beat / hero for the DEFINE phase — an
ambiguous idea entering the tool and being turned into a small, answerable
intake.

### Notebook 02
Original: `~/chloelaforge/2-notebook.mov`
New filename: `notebook-02-summary-page-approval.mov`
Phase: PHASE 1 — DEFINE
Feature: Summary page — summarized understanding organised into Pages, with
Accept / Reject on proposed Page directions
One-sentence description: The Summary page ("organizes the project into the
smallest coherent set of standard Notebook Pages") shows proposed Page
directions (Local Context, Booking Ticket Queue) with Accept / Reject; accepting
one creates its Page and adds it to the Pages list while the user stays on the
Summary to keep reviewing.
Potential portfolio role: The "summarized understanding → human approval" beat —
shows the AI's read-back of the idea as discrete Pages the person signs off on
before any building.

### Notebook 03
Original: `~/chloelaforge/3-notebook.mov`
New filename: `notebook-03-contextual-question-proposal.mov`
Phase: PHASE 2 — BUILD
Feature: Contextual Build-Assistant question docked at the relevant subtree,
related nodes highlighted, Yes / No / Other, then a PROPOSED (not-yet-part-of-
the-page) structure with Accept / Deny / Other and tree growth on accept
One-sentence description: On the Community Features tree the assistant asks
"Should 'Push Notifications' focus on email notifications first?" beside the
lit-up Push Notifications node ("About Push Notifications and 3 related items");
the user picks "Other" and types an answer, a "PROPOSED — NOT YET PART OF THE
PAGE" set of notification options appears with Accept / Deny / Other, and
accepting grows the tree (new notification-type and Communication Channels
branches).
Potential portfolio role: Flagship contextual-AI clip — AI reasoning beside the
user at the exact structure it concerns, with proposed vs. accepted structure
kept visually distinct and gated by a human decision.

### Notebook 04
Original: `~/chloelaforge/4-notebook.mov`
New filename: `notebook-04-build-from-here-purpose-previews.mov`
Phase: PHASE 2 — BUILD (supporting)
Feature: "Build from here" dock on a node + hover "Why this is here" purpose
previews
One-sentence description: A short clip on the Community Features canvas showing
the "BUILD FROM HERE — Building from 'Volunteer Opportunities'" input (with
"Mark complete for now") and, with "Show purpose previews" on, a hover popover
"WHY THIS IS HERE" giving a node's rationale ("ensures immediate delivery of
news updates to users…").
Potential portfolio role: Supporting detail — how a person moves around the
canvas and inspects why a given piece of structure exists, and continues the
build from any node.

### Notebook 05
Original: `~/chloelaforge/5-notebook.mov`
New filename: `notebook-05-contextual-question-on-tree.mov`
Phase: PHASE 2 — BUILD (supporting)
Feature: A contextual Build-Assistant question docked on a large accepted tree;
Geometry panel present but idle
One-sentence description: A ~0.5-second freeze-frame of the Booking Ticket Queue
page — a deep accepted tree (Support Resources → FAQs / Contact information /
Support availability hours) with the assistant asking "Should we provide a
specific date for the refund request deadline?" ("About Refund request deadline
and 2 related items") and the Geometry inspector panel visible but unused.
Potential portfolio role: Weak on its own (too short to play). At most a still
of "a contextual question on a mature tree"; it is the pre-state of the
Geometry clip (06). Re-record if motion is needed.

### Notebook 06
Original: `~/chloelaforge/6-notebook.mov`
New filename: `notebook-06-geometry-inspector.mov`
Phase: Supporting / Other
Feature: Geometry inspector overlays — Node bounds, Subtree bounds, Tree
bounds, Anchors
One-sentence description: On the same Booking Ticket Queue tree, the Geometry
panel's checkboxes are toggled on and dashed node/subtree/tree bounding boxes
plus connector-anchor dots render over the tree, with the panel stating
"Visualises the production geometry engine's own bounds. Inspection only — no
effect on layout, nodes, AI or saving."
Potential portfolio role: Evidence that a deterministic geometry engine owns
placement (AI decides structure, not coordinates) and that the tool carries a
real system's size and depth — an inspection/tooling aside, not a phase beat.

### Notebook 07
Original: `~/chloelaforge/7-notebook.mov`
New filename: `notebook-07-tables-choose-objective.mov`
Phase: PHASE 3 — ORGANIZE
Feature: Tables view — "Recommend ways to organize" produces objective options,
each "Organize this way"
One-sentence description: The Tables tab of Booking Ticket Queue says "There's
enough accepted structure here to organize into a table", "Recommend ways to
organize" returns four objectives (Booking Process Workflow, Roles in Ticket
Purchasing, Implementing Ticket Queue Features, Comprehensive Support
Structure), and picking one starts it building ("Nothing is generated until you
choose one").
Potential portfolio role: Entry to the ORGANIZE phase — accepted hierarchy is
re-expressed deliberately: the user picks the objective, the tool proposes the
representation.

### Notebook 08
Original: `~/chloelaforge/8-notebook.mov`
New filename: `notebook-08-table-package-generation.mov`
Phase: PHASE 3 — ORGANIZE
Feature: Generated multi-table package with a PURPOSE column and tree
provenance, Accept package / Deny / Other, then start another objective
One-sentence description: A "PROPOSED — Comprehensive Support Structure for
Ticket Booking" package renders several tables (Booking Process Overview, Ticket
Queue Functionality, Ticket Purchasing Experience, Event Timeline and
Deadlines, Support Resources), each with a PURPOSE column and "Derived from Tree
5, 6, 7, 8 · N source concepts"; "Accept package" moves it to ACCEPTED and the
user starts a second objective (Booking Process Workflow → Building…).
Potential portfolio role: The strongest "table generation" clip — the
transformation from visual tree structure into organised, purpose-annotated
tables, itself a proposal the user accepts, with visible provenance back to the
trees.

### Notebook 09
Original: `~/chloelaforge/9-notebook.mov`
New filename: `notebook-09-multi-tree-proposal-expansion.mov`
Phase: PHASE 2 — BUILD
Feature: Proposed multiple Trees on one Page (Accept / Deny / Other), then
successive branch-expansion proposals
One-sentence description: On the Local Context page a "PROPOSED — NOT YET PART OF
THE PAGE" set of ghosted trees (Demographic Information, Community
Characteristics, Engagement Challenges and Opportunities, Platform Usage
Comparison) is accepted into real trees, then a follow-up proposal adds
population details and the Age Distribution branch expands into age brackets.
Potential portfolio role: Shows a Page as several independent systems and the
iterative human-gated growth of that structure — proposed breadth accepted,
then depth added branch by branch.

### Notebook 10
Original: `~/chloelaforge/10-notebook.mov`
New filename: `notebook-10-developed-system-overview.mov`
Phase: PHASE 3 — ORGANIZE (also: canvas navigation / inspection)
Feature: Zoom-out to the whole developed Page, "Color by → Hierarchy"
depth colouring, all Geometry bounds enabled
One-sentence description: The Community Features page is zoomed out from ~92% to
53% to show four large accepted trees at once (Key Resident Features, Local News
Enhancements, Communication Channels, Volunteer and Event Management), then
"Color by Hierarchy" tints nodes by depth (Root / L1 / L2 / L3+) and every
Geometry bound is switched on.
Potential portfolio role: The "developed visual structure" beat — a completed
multi-tree system seen whole, with depth and geometry made legible; also usable
as the canvas-scale / navigation shot.

---

## Move log (for reversal)

| # | Original (removed after SHA-256 match) | New path |
|---|---|---|
| 01 | `~/chloelaforge/1-notebook.mov`  | `public/portfolio/notebook/videos/notebook-01-intake-and-questions.mov` |
| 02 | `~/chloelaforge/2-notebook.mov`  | `public/portfolio/notebook/videos/notebook-02-summary-page-approval.mov` |
| 03 | `~/chloelaforge/3-notebook.mov`  | `public/portfolio/notebook/videos/notebook-03-contextual-question-proposal.mov` |
| 04 | `~/chloelaforge/4-notebook.mov`  | `public/portfolio/notebook/videos/notebook-04-build-from-here-purpose-previews.mov` |
| 05 | `~/chloelaforge/5-notebook.mov`  | `public/portfolio/notebook/videos/notebook-05-contextual-question-on-tree.mov` |
| 06 | `~/chloelaforge/6-notebook.mov`  | `public/portfolio/notebook/videos/notebook-06-geometry-inspector.mov` |
| 07 | `~/chloelaforge/7-notebook.mov`  | `public/portfolio/notebook/videos/notebook-07-tables-choose-objective.mov` |
| 08 | `~/chloelaforge/8-notebook.mov`  | `public/portfolio/notebook/videos/notebook-08-table-package-generation.mov` |
| 09 | `~/chloelaforge/9-notebook.mov`  | `public/portfolio/notebook/videos/notebook-09-multi-tree-proposal-expansion.mov` |
| 10 | `~/chloelaforge/10-notebook.mov` | `public/portfolio/notebook/videos/notebook-10-developed-system-overview.mov` |

The 16 `~/chloelaforge/*-barclay.mov` files were not read, moved, or altered.
