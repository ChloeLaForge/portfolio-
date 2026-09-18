# PORTFOLIO_IMPLEMENTATION.md

Master implementation specification for the final portfolio. This document is
the source of truth for the build pass that follows it.

**Status:** specification only. No application code, styles, routes, media, or
video files were changed in the pass that produced this file. Nothing below is
implemented yet.

**Repo:** `/Users/chloelaforge/Downloads/portfolio` — React 18 + TypeScript +
Vite, React Router 6. No UI framework, no CSS-in-JS, no animation library.
Not currently a git repository.

---

## 0. How to read this document

- Sections 1–14 are the content and design brief for the three case studies and
  the homepage.
- Section 15 is the implementation checklist.
- Section 16 is the explicit list of media that is intentionally optional or
  omitted.
- Section 17 records conflicts found between documentation, the video indexes,
  and the current portfolio. Resolve these before or during implementation;
  do not silently paper over them in code.

### Source-of-truth rule (do not violate)

| For… | Authoritative source |
|---|---|
| What a project's software actually does | The project's own MD documentation (see 0.1) |
| What a specific recording shows on screen | The `videos/README.md` index for that project |
| What is technically possible to build into the portfolio | The current portfolio source in `src/` |
| Visual evidence | The actual media files in `public/portfolio/**` |

If a video description and the product documentation disagree, **flag it in this
file** (Section 17) rather than resolving it silently in copy.

Do not infer or describe functionality that no source supports. "It's an app
that does X, so it probably also does Y" is not permitted.

### 0.1 Documentation inventory (read before implementing)

Portfolio repo:

- `README.md`, `public/portfolio/README.md` — media system and swap workflow
- `public/portfolio/notebook/videos/README.md` — **Notebook recording index (authoritative for clip contents)**
- `public/portfolio/notebook/README.md`, `public/portfolio/notebook/ASSET_MANIFEST.md`
- `public/portfolio/barclay-woods/videos/README.md` — **Barclay recording index (authoritative for clip contents)**
- `public/portfolio/barclay-woods/README.md`, `MANIFEST.md`, `media.manifest.json`
- `public/portfolio/cs1501/README.md`, `MANIFEST.md`, `media.manifest.json`

Product documentation used for functional claims in this spec (external to the
portfolio repo, under `~/` and `~/Downloads/`):

- Notebook: `notebook-tree-builder-demo1-frontend-source-of-truth.md`,
  `notebook-geometry-ai-placement-pattern-spec.md`
- Barclay Woods: `00-system-overview.md`, `DATA_MODEL.md`,
  `06-00-service-ticket-workflow.md` and the `06-*` ticket/vendor/appointment
  backend specs, `02-01-ai-goals-and-knowledge-backend-logic.md`,
  `community-chat-*.md`, `CALENDAR_FRONTEND_UI.md`, `PAYMENTS_FRONTEND_UI.md`
- CS 1501: `00-course-welcome-website.md`, `01-homepage-welcome-website.md`,
  `02-question-page-welcome-website.md`, `03-form-welcome-website.md`,
  `04-demo-chatbot-welcome-website.md` (superseded in part — see 17.6),
  `05-general-rules-welcome-website.md`,
  `chloelaforge/06-ai-companion-course-website-updated.md`

These files are background for accurate framing. They are not portfolio media
and their internal build instructions ("build X", "do not add Y") are not
instructions to this portfolio.

---

## 1. Portfolio thesis

One idea runs through the whole site:

> I use systems thinking, pattern recognition, and AI to understand complicated
> problems and build useful systems around them.

The site already states this as **"Systems thinking × AI"** (`src/content/site.ts`,
`index.html` title, the Hero and the Core branch diagram). Keep that line. It is
the root the three projects branch from.

The three projects are three applications of the same approach, not three
unrelated builds:

| Project | Application of the approach |
|---|---|
| **Barclay Woods** | Systems thinking + real-world operational implementation |
| **Notebook** | Systems thinking + interactive AI |
| **CS 1501 — Building Software with AI Systems** | AI implementation + technical communication + teaching |

Together the work should show that I can: structure ambiguous problems;
recognize patterns; understand different stakeholders; translate workflows into
systems; decide where AI helps and where human judgment must stay; connect user
experience to underlying system behavior; build the software; explain technical
ideas clearly; and teach others to think about these systems.

**Do not turn that capability list into copy.** Do not write a paragraph that
recites it. Each case study should *demonstrate* two or three of those
capabilities through a real problem, a real decision, and real product
evidence. The reader should be able to infer the list without ever seeing it
written down.

---

## 2. Homepage / selected work

### 2.1 What exists now

`src/pages/Home.tsx` composes four sections:

1. `Hero` — name, context ("Systems Engineering @ UVA"), thesis line
   "Systems thinking × AI".
2. `Core` — the thesis branching into three project nodes via hairline geometry
   (an SVG-free rule diagram that draws itself in, collapses to a single spine
   below 860px). Reads from `src/content/projects.ts`.
3. `Work` — three large, deliberately uniform project previews. Each is a
   `<Link>` wrapping a head (index / title / branch line), a `preview__frame`
   holding one `Media`, and a foot (subtitle + "View project").
4. `About` — three sentences and a resume link.

`src/content/projects.ts` is the single source of project identity: `id`,
`index`, `title`, `branch` (one-line role), `subtitle`, `route`, `meta`,
`preview` (homepage media). The Core diagram, the Work previews, and the
"next project" footer all read from this array. Current array order is
`notebook`, `barclay-woods`, `cs1501`; each `preview` is a placeholder `slot()`
pointing at `/portfolio/<project>/preview.mp4`.

### 2.2 Intended homepage structure

Keep all four sections and the branch-diagram concept. Changes:

**Order.** Present the three projects in this order everywhere the array drives
(Core diagram, Work previews, next-project wraparound):

1. **Barclay Woods**
2. **Notebook**
3. **CS 1501**

Reorder the `projects` array in `src/content/projects.ts` to achieve this. The
`index` strings (`'01'`/`'02'`/`'03'`) are presentational and must be updated to
match the new order (Barclay `01`, Notebook `02`, CS 1501 `03`). The
`getNextProject` wraparound then runs Barclay → Notebook → CS 1501 → Barclay.

**Homepage media — three strong pieces shown together.** Replace each `preview`
placeholder with real media:

| Project | Homepage `preview` | Notes |
|---|---|---|
| Barclay Woods | Its strongest representative application media. First choice: a short silent loop cut from **`barclay-10-management-ticket-vendor-pool.mov`** (the operational ticket record) or **`barclay-13-management-service-types.mov`** (service-type configuration) — whichever reads most clearly at preview size. Acceptable fallback: a single high-resolution screenshot of the same surface. | The homepage frame renders at `aspect="3/2"`, roughly half screen width. A 49 s source must be trimmed to a clean 8–15 s loop for this use. |
| Notebook | A **looping application video** — this is a hard requirement from the brief. Use a trimmed silent loop from **`notebook-03-contextual-question-proposal.mov`** (contextual AI proposal → accept → tree grows) or **`notebook-09-multi-tree-proposal-expansion.mov`**. Pick the segment that reads as "AI proposes, human accepts, structure appears" without text being legible-critical at small size. | Must loop cleanly; no visible cut. |
| CS 1501 | The course homepage / application media. First choice: a screenshot of the CS 1501 homepage (`cs1501-home.png` in the manifest — the arranged-desk homepage with the three sticky notes). Acceptable: a short silent loop from the *Build Your AI Friend* exercise once CS 1501 media is captured. | **Blocked** — no CS 1501 media exists in the repo yet (Section 6, Section 16.3). Leave the `slot()` placeholder until the CS 1501 asset pass lands. |

**Framing lines (the `branch` field).** Keep them short and parallel. Current
values are close; tighten to:

- Barclay Woods — *Operational systems + implementation*
- Notebook — *Systems thinking + interactive AI*
- CS 1501 — *AI implementation + teaching*

The `subtitle` field (longer framing, shown on preview foot and project hero)
can stay roughly as written or be lightly revised per Section 8. Do not inflate
it.

**What the homepage must establish:** that these are three expressions of one
way of working. The Core branch diagram already carries that idea structurally
(one thesis, three branches). Do not add a mission statement, a services list,
metrics, logos, or testimonials to make the point. The three pieces of media
plus the branch geometry are the argument.

### 2.3 Hero / About copy

`site.heroCopy`, `site.coreCopy`, and `site.about.body` are all marked
placeholder. Rewrite them per Section 8: analytical, understated, specific, no
marketing register. The About section stays small — it exists to make the work
legible, not to retell a resume.

---

## 3. Notebook — core story

Notebook started from a way of thinking: complex problems can be understood by
breaking them into trees, relationships, decisions, and patterns. Mapping that
structure by hand preserves understanding but is slow. Fully autonomous AI can
produce structure fast, but the person loses visibility into *why* the
structure is shaped the way it is.

Notebook explores the middle ground. **AI builds beside the user.** The user
stays responsible for understanding and approving the system as it grows.

Supported by `notebook-tree-builder-demo1-frontend-source-of-truth.md`, the AI
in Notebook can: ask short questions; recognize patterns and repeated
structure; reason about existing accepted structure; propose additions and
larger structures; and organize accepted information into other
representations. But structural change stays visible and gated: proposed
structure is rendered muted/translucent and distinct from accepted structure,
and it only enters the system on an explicit **Accept / Deny / Other**
decision. Locked structure cannot be modified by AI at all. AI never controls
screen coordinates — a deterministic geometry engine owns placement, so the
model decides *what* is being reasoned about and the frontend decides *where*
anything is drawn.

**Spatial / contextual AI is the signature interaction.** Short AI exchanges
appear directly beside the part of the visual system they concern, and the
relevant existing structure is illuminated ("light behind the ink", not a
bounding box) so the user can see *"the AI is asking this because of this part
of my system."* Longer conversation stays in the persistent sidebar; the
contextual surface is a fast decision, never a transcript, and it escalates to
the sidebar when a question gets long or multi-part.

Do not reduce Notebook to "an AI decision-tree builder" or "an AI mind-map
tool." The product claim is about *how* the human and the AI share authorship
of a system.

---

## 4. Notebook — case-study narrative

Organize the page around this progression:

```
AMBIGUOUS IDEA
      ↓
DEFINE
      ↓
BUILD ALONGSIDE AI
      ↓
DEVELOPED SYSTEM
      ↓
ORGANIZE STRUCTURE INTO USABLE INFORMATION
```

Every section follows the case-study shape in Section 7
(problem/question → design decision → product evidence → why it matters → next
implication). Media is evidence inside that argument, not a gallery.

### PHASE 1 — DEFINE  ·  clips 01 → 02

**`notebook-01-intake-and-questions.mov`** (~69 s, 3132×2008, PHASE 1)
A one-line "What do you want to build?" description becomes a short structured
intake: Notebook says "Thinking about what I need to know…", then asks a small
set (Question 2 of 4 "Which features are most important", Question 4 of 4
"Anything else…"), and "Build my notebook" starts with "Almost ready…".

- The point is **not** "I built a form."
- The point: AI does not immediately start inventing architecture. It first
  gathers enough context to know what the system is meant to represent.
- Copy direction: *"Before generating structure, Notebook first establishes what
  the system is supposed to represent. A lightweight intake turns an ambiguous
  starting idea into enough context for the AI to reason about the problem."*
- Implementation note: 69 s is far too long to loop. Trim to a short segment
  (idea typed → "Thinking about what I need to know…" → one question visible),
  or present as a captured sequence. Do not show the whole intake.

**`notebook-02-summary-page-approval.mov`** (~46 s, PHASE 1)
The Summary page ("organizes the project into the smallest coherent set of
standard Notebook Pages") shows proposed Page directions (Local Context,
Booking Ticket Queue) with **Accept / Reject**; accepting one creates its Page
and adds it to the Pages list while the user stays on the Summary to keep
reviewing.

- The point: the first human approval checkpoint happens *before* deeper
  structural generation.
- Copy direction: *"AI-generated interpretation stays proposed rather than
  silently becoming part of the system. The user confirms the direction before
  Notebook builds deeper structure."*
- Implementation note: ~46 s; trim to the accept/reject beat.

### PHASE 2 — BUILD ALONGSIDE AI  ·  clips 03 → 04 → 09  (most important section)

**`notebook-03-contextual-question-proposal.mov`** (~17 s, PHASE 2) — **flagship
contextual-AI clip.**
On the Community Features tree the assistant asks "Should 'Push Notifications'
focus on email notifications first?" beside the lit-up Push Notifications node
("About Push Notifications and 3 related items"); the user picks **Other** and
types an answer; a **"PROPOSED — NOT YET PART OF THE PAGE"** set of notification
options appears with **Accept / Deny / Other**; accepting grows the tree (new
notification-type and Communication Channels branches).

Shows, in one clip: AI docked beside the relevant node; relevant tree context
illuminated; a constrained question (Yes/No/Other); a proposal that is visibly
not yet accepted; the Accept/Deny/Other decision; accepted structure joining
the tree.

- Copy direction (focus on *why*): *"Instead of separating AI reasoning from the
  system inside a conventional chat window, short decisions happen beside the
  structure they affect. Relevant context is illuminated so the user can see
  what prompted the question."*
- And: *"AI can propose structure, but proposed and accepted architecture stay
  visually distinct. A structural change is an explicit decision, not an
  invisible consequence of a prompt."*
- This clip earns the largest / most prominent media treatment in the Build
  section. Consider full-width.

**`notebook-04-build-from-here-purpose-previews.mov`** (~6 s, PHASE 2 supporting)
On the Community Features canvas: the "BUILD FROM HERE — Building from 'Volunteer
Opportunities'" input (with "Mark complete for now"), and with "Show purpose
previews" on, a hover popover "WHY THIS IS HERE" giving a node's rationale.

- The point: the user can move through and interrogate the system — continue
  from a chosen node, mark an area complete for now, inspect why a node exists —
  rather than being pushed through one AI-controlled sequence.
- Supporting scale. Smaller than 03.

**`notebook-09-multi-tree-proposal-expansion.mov`** (~25 s, PHASE 2)
On the Local Context page a "PROPOSED — NOT YET PART OF THE PAGE" set of ghosted
trees (Demographic Information, Community Characteristics, Engagement Challenges
and Opportunities, Platform Usage Comparison) is accepted into real trees; then
a follow-up proposal adds population details and the Age Distribution branch
expands into age brackets.

- The point: AI participation works at multiple levels of abstraction — from
  proposing whole tree structures down to expanding one branch — while the
  approval boundary holds at every level. A Page is several independent systems,
  not one flowchart.
- Copy direction: *"AI participation operates at more than one level of
  abstraction — proposing whole structures, then refining single branches —
  without changing where approval sits."*

Document the Build progression as **03 → 04 → 09**. Do not display all three at
the same size; 03 leads, 04 is a small supporting inset, 09 is medium.

### Technical / optional Notebook media

**`notebook-06-geometry-inspector.mov`** (~11 s, Supporting/Other)
On the Booking Ticket Queue tree, the Geometry panel's checkboxes are toggled
and dashed node/subtree/tree bounding boxes plus connector-anchor dots render
over the tree; the panel states "Visualises the production geometry engine's own
bounds. Inspection only — no effect on layout, nodes, AI or saving."

- Not part of the primary product narrative.
- Optional technical-detail beat: contextual AI placement and large visual trees
  require the frontend to reason about real spatial geometry — node/subtree/tree
  bounds and connector anchors — rather than treating the canvas as a static
  set of cards. A deterministic geometry engine owns placement; AI decides
  structure, not coordinates.
- Use only if it strengthens the argument. Do not overemphasize internal
  debugging tooling. If included, it is a small figure inside "why it matters",
  not its own section.

**`notebook-05-contextual-question-on-tree.mov`** (~0.5 s, ~444 KB)
Effectively a single freeze-frame — a contextual question on a mature Booking
Ticket Queue tree with the Geometry panel idle. Too short to play; redundant
with 03.

- **OMIT FROM PRIMARY PRESENTATION.** Do not delete the asset. If a still of
  "a contextual question on a mature tree" is ever wanted, a poster frame can be
  pulled from it, but 03 already covers this better.

### DEVELOPED SYSTEM payoff  ·  clip 10

**`notebook-10-developed-system-overview.mov`** (~14 s; indexed PHASE 3 / canvas
navigation, but treat it as the **developed-system payoff**, placed between
BUILD and ORGANIZE).
The Community Features page is zoomed out from ~92% to 53% to show four large
accepted trees at once (Key Resident Features, Local News Enhancements,
Communication Channels, Volunteer and Event Management); then "Color by
Hierarchy" tints nodes by depth (Root / L1 / L2 / L3+) and every Geometry bound
is switched on.

- The point: the result of the human × AI interaction is not a run of chat
  replies. It is a persistent visual model the user can inspect whole.
- Copy direction: *"As the notebook develops, individual AI decisions accumulate
  into a persistent visual model. Zooming out reveals the larger system the user
  has actively participated in creating."*
- Treatment: a large / full-width visual moment. Good candidate for the one
  `FullBleedMedia` on the page.
- Note: this clip also has the Geometry bounds enabled, so if 06 is used, keep
  them distinct — 06 is "the engine is inspectable", 10 is "the system is large
  and legible as a whole". Do not run them back to back showing the same
  overlay for different reasons without saying why.

### PHASE 3 — ORGANIZE  ·  clips 07 → 08

**`notebook-07-tables-choose-objective.mov`** (~16 s, PHASE 3)
The Tables tab of Booking Ticket Queue: "There's enough accepted structure here
to organize into a table"; "Recommend ways to organize" returns four objectives
(Booking Process Workflow, Roles in Ticket Purchasing, Implementing Ticket Queue
Features, Comprehensive Support Structure); picking one starts it building
("Nothing is generated until you choose one").

- The point: the visual tree is not the final destination. Structured visual
  thinking can become structured information for another use — and the user
  chooses the objective rather than receiving one arbitrary AI table.
- Copy direction: *"The tree is not the endpoint. Once enough structure is
  accepted, the same material can be reorganized toward an objective the user
  picks."*

**`notebook-08-table-package-generation.mov`** (~19 s, PHASE 3)
A "PROPOSED — Comprehensive Support Structure for Ticket Booking" package
renders several tables (Booking Process Overview, Ticket Queue Functionality,
Ticket Purchasing Experience, Event Timeline and Deadlines, Support Resources),
each with a PURPOSE column and "Derived from Tree 5, 6, 7, 8 · N source
concepts"; **Accept package** moves it to ACCEPTED and the user starts a second
objective (Booking Process Workflow → Building…).

- The point: generated tables keep a relationship to the visual source
  structure — provenance back to specific Trees and a source-concept count — and
  the package itself is a proposal the user accepts.
- Copy direction: *"Accepted tree structure can be turned into more conventional
  outputs without severing its relationship to the original reasoning.
  Generated tables retain provenance back to the trees and source concepts they
  were derived from."*
- This is the payoff of Phase 3. Give 08 a substantial treatment.

Document ORGANIZE as **07 → 08**.

---

## 5. Notebook — final media map

```
DEFINE                        01 → 02
BUILD                         03 → 04 → 09        (03 leads; 04 small; 09 medium)
DEVELOPED SYSTEM PAYOFF       10                   (large / full-width)
ORGANIZE                      07 → 08
TECHNICAL / OPTIONAL          06                   (small figure, only if it helps)
OMIT FROM PRIMARY             05                   (asset kept, not shown)
```

Ten recordings exist. Not all ten need to appear. The likely on-page set is
**01, 02, 03, 04, 09, 10, 07, 08** with **06** optional and **05** omitted.

Every clip 3132×2008, `.mov` / H.264, audio track still present, no edits. See
Section 10 and Section 17.1 for the delivery-encode work this implies.

---

## 6. Barclay Woods — core story

Barclay Woods is **not** "an HOA website." It is the translation of a messy
real-world operating environment into one coherent software system.

A residential community has multiple stakeholders — residents, management /
board, vendors — and multiple operational domains: households,
registration/access, services, vendor assignment, payments, communication,
events, and knowledge/support. The case study shows how those separate
workflows can run on shared underlying concepts and rules rather than as
disconnected tools. That is the systems-thinking story.

Recurring evidence across almost every recording: the persistent **View as
Resident / Management / Vendor** control and role-scoped navigation — one
platform resolving to a role context.

Supported functionality (from the Barclay product docs and the video index):

- **Service tickets** are operational records. A ticket carries unit / household
  context, financial responsibility (HOA vs. Resident), vendor assignment and a
  vendor pool, pricing, scheduling, approval, concerns, attachments, a
  lifecycle, and an activity history.
- **Service types** are configurable: a community-wide workflow mode (Booking
  Only vs. Completion & Billing) and per-type requirement flags (Estimate
  required, Appointment required, Final Management Approval required). Each
  ticket snapshots the requirements in force when it was raised and is not
  rewritten in flight.
- **Identity is household-first.** The modeled object is the household / unit;
  people participate through membership and roles. Registration invitations are
  issued against the community structure.
- **Payments** resolve against a household-scoped account and statement; the
  charge is owned by the unit. The pay flow hands off to Stripe checkout.
- **Community Calendar** carries operational and social events on one timeline,
  with resident submissions moving through a board-approval queue and a
  board/management authoring path that bypasses that queue.
- **Ask Mr. Barclay** is a resident-facing conversational assistant. On the
  management side it is a governed surface: Handbook FAQs, an "AI Goals &
  Knowledge" guidance panel, and referenced Knowledge Documents. Saved
  conversations are retained and browsable via a Reference Index.

Do not describe capabilities beyond these without a source.

---

## 7. Barclay Woods — case-study narrative

The 16 recordings are numbered `barclay-01…16` to preserve source identity.
**Do not present them in numeric order.** The case study follows conceptual
relationships. A single recording may support more than one point; do not embed
the same video file twice on the final page — reference it from the second
section in prose, or use a still.

Every section follows the Section 7-style shape below. (This is the general
principle referenced throughout; it is stated once here and applies to all
three case studies.)

```
PROBLEM / QUESTION
      ↓
DESIGN DECISION
      ↓
REAL PRODUCT EVIDENCE
      ↓
WHY IT MATTERS
      ↓
NEXT SYSTEM IMPLICATION
```

### SECTION A — One community, different stakeholders  ·  01 + 10 + 16

Evidence: **`barclay-01-vendor-submit-interest.mov`** (~21 s — vendor opens an
open Lawn Mowing opportunity, submits interest with a proposed date/time/note,
card shows "Interest submitted" with Revise / Withdraw);
**`barclay-10-management-ticket-vendor-pool.mov`** (~49 s — management walks the
Lawn Mowing ticket record, including a confirmed "Publish to Vendor Pool");
**`barclay-16-resident-community-calendar.mov`** (~14 s — resident browses the
community calendar, event detail, Journal, submissions).

- Design decision: not three disconnected interfaces — different stakeholders
  act on the same underlying community system through role-appropriate
  workflows.
- Explain the relationship between the three views (the vendor's opportunity is
  the management ticket published to the pool; the resident's calendar is the
  same timeline management publishes to), not each screen in isolation.

### SECTION B — Modeling operations  ·  13 → 10

Evidence: **`barclay-13-management-service-types.mov`** (~25 s — Service Types
tab: community workflow mode Booking Only vs. Completion & Billing; the service
catalog; "New Service Type" adds "Plumbing Repair" with Estimate / Appointment /
Final Management Approval toggles) then
**`barclay-10-management-ticket-vendor-pool.mov`** (the ticket record itself).

- Design decision: operational differences between services are represented as
  configurable rules, not as a hand-built unique workflow per service.
- Copy direction (13): *"Different community services do not follow identical
  operational paths. Rather than treating each one as a separate feature, the
  system models those differences as workflow configuration."*
- Copy direction (10): *"Individual service requests then move through the rules
  of the broader operating model, connecting household context, financial
  responsibility, vendors, scheduling, approvals, and activity history in one
  record."*
- Shape: DEFINE OPERATIONAL RULES → RUN REAL CASES THROUGH THOSE RULES. One of
  the two strongest systems-thinking demonstrations in the portfolio. 10 is the
  longest recording (~49 s) and needs trimming/segmenting for the page — it can
  be the section's larger visual, cut to the parts that show the record's
  sections rather than the full 49 s.

### SECTION C — Modeling the community  ·  12 → 11 → 03

Evidence: **`barclay-12-management-hub-add-household.mov`** (~14 s — Operational
Workspace → Households → "Add Household" creates "Unit 102", shows as Vacant);
**`barclay-11-management-hub-invitations.mov`** (~28 s — Invitation Management:
a Registration Invitation is configured with assigned household + roles
(Resident + Management, Unit 102, 7-day expiry), created, appears Pending);
**`barclay-03-resident-household-invite.mov`** (~19 s — a resident's Profile &
Settings shows the "Unit 101" household and generates a one-time household
invitation code).

- Design decision: identity is not a flat list of individual users. The
  real-world object is the household / unit; people participate through
  membership and role relationships.
- Copy direction: *"Because community obligations and access often belong to a
  unit rather than one person, the system separates household identity from
  individual user identity."*
- Use the product docs (`DATA_MODEL.md`, registration-invitation object
  definition) to keep the household/membership/role description technically
  accurate.

### SECTION D — Resident experience built on top  ·  05 + 16 + 08  (15 supporting)

Evidence: **`barclay-05-resident-hoa-payment.mov`** (~20 s — from the household
Account / Statement tab, $5.00 balance, "Pay balance" → "Settle Your Statement"
summary → redirect to Stripe checkout);
**`barclay-16-resident-community-calendar.mov`** (calendar, event detail,
Journal, My Submissions);
**`barclay-08-management-post-announcement.mov`** (~37 s — Community Chat
Management View: compose a Management announcement, Pinned & Featured row with
Edit / Unpin / Remove);
supporting **`barclay-15-board-create-event.mov`** (~27 s — Board Event
Management Create Event dialog → Publish Event, noted to bypass resident
submission approval).

- This is not a feature gallery. The point: once identity, roles, and
  operational rules exist underneath, resident-facing experiences share that
  foundation.
- 05: financial obligations live in the same household/account context the rest
  of the platform uses.
- 16: community coordination is part of the same environment, not a separate
  calendar or email chain.
- 08: communication respects the distinction between community conversation and
  official management information.
- 15: use only if it adds something 16 doesn't — the authoring counterpart to
  the resident calendar. Do not show 14 + 15 + 16 just because all three concern
  calendars.

### SECTION E — AI inside the operating system  ·  06 → 07  (02 supporting)

Evidence: **`barclay-06-ask-mr-barclay-chat.mov`** (~23 s — a resident opens Ask
Mr. Barclay, sends a note, sees a "checking a few details…" state, gets an
AI-written reply signed "Mr. Barclay") then
**`barclay-07-management-mr-barclay-config.mov`** (~33 s — Management: Add / Edit
/ Delete Handbook FAQ; the "AI Goals & Knowledge" panel edits the assistant's
guidance text and references its Knowledge Documents);
supporting **`barclay-02-reference-index-conversations.mov`** (~7 s — FAQs →
Reference Index lists dated "Conversation summary" entries and opens saved Ask
Mr. Barclay exchanges).

- Do not frame 06 as "I added an AI chatbot."
- 07 is the more important system-design insight. Copy direction: *"The resident
  experiences a simple conversational interface, but the management side exposes
  the knowledge and guidance behind it. AI operates as part of the community's
  information system rather than as an unconstrained general-purpose chatbot."*
- 02: use only if a visibility/history point is worth making. Do not overclaim
  its purpose beyond "conversations are retained and browsable."

### Optional Barclay media

- **`barclay-04-resident-profile-edit.mov`** (~16 s) — valid ("resident manages
  their own record") but weak systems-thinking evidence. Optional.
- **`barclay-09-community-handbook-faqs.mov`** (~16 s) — valid but largely
  static information browsing. Optional; use only to support the AI/knowledge
  narrative as a "calm reference screen" contrast to 06/07.
- **`barclay-14-board-calendar-overview.mov`** (~7 s) — board-side calendar
  reading/approval surface. Use only if it contributes something 15/16 do not.

---

## 8. Barclay Woods — final media map

```
STAKEHOLDERS / ROLE-BASED SYSTEM      01 + 10 + 16
MODELING OPERATIONS                   13 → 10
MODELING THE COMMUNITY               12 → 11 → 03
RESIDENT EXPERIENCE                   05 + 16 + 08     (15 supporting, 14 optional)
AI WITHIN THE OPERATING SYSTEM        06 → 07          (02 supporting)
OPTIONAL / LIKELY OMIT                04 + 09
```

10 and 16 each support two sections — reference the file once, cite it in prose
the second time (or use a still). Likely on-page video set: **01, 03, 05, 06,
07, 08, 10, 11, 12, 13, 16**, with **15** supporting, **02 / 14** optional, and
**04 / 09** likely omitted.

All 16 are 2872×2008, `.mov` / H.264 + AAC, durations 6.7–49 s, no edits. See
Section 10 and Section 17.1.

---

## 9. CS 1501 — Building Software with AI Systems

**Core portfolio role: AI implementation + technical communication + teaching.**

CS 1501 is **not** "I built a course website." The project is designing and
teaching a University of Virginia course about building software *with* AI
systems — turning an idea into a plan, giving AI the right context, and
directing it while software is built, rather than treating AI as a chatbot to
prompt. The course website and its in-page exercises are *evidence of that
teaching work*, not the project itself.

### 9.1 Framing supported by existing course documentation

Supported by `00-course-welcome-website.md`, `01`–`03`,
`chloelaforge/06-ai-companion-course-website-updated.md`,
`cs1501/MANIFEST.md`, `cs1501/media.manifest.json`:

- The course site is itself a small piece of software — frontend + backend +
  database (Supabase) + a server-side AI integration — built to the standards
  the course teaches. No login, no LMS shell; three sticky notes are the
  navigation.
- Students *do* something before instruction begins: read the Questions
  flashcards, answer the "Tell Me About You" questionnaire (saved to Supabase,
  no login), and run the *Build Your AI Friend* exercise.
- *Build Your AI Friend* (shipped version): the student configures an AI
  companion (what to build; tone; working style; one optional custom
  instruction), has a **bounded five-message conversation**, then deliberately
  triggers a server-side image generation that turns the conversation into a
  picture. The message limit is a teaching device — scarcity forces the student
  to decide what context matters before spending a turn.
- One idea is taught repeatedly in concrete form — *the instructions and
  context you give an AI change what it produces* — felt first (the exercise),
  named second (the interstitial: "You didn't change what the AI knows, but you
  did give it directions for how to communicate, respond, and work with you").
- Security/architecture the course models in its own site: API keys and
  permanent instructions stay server-side; student input is untrusted and
  cannot override server rules; conversation length, turn count, and generation
  requests are capped; image generation is one deliberate server call.

Potential teaching areas to draw on **only where the course documentation
supports the specific claim**: APIs; frontend/backend relationships; databases;
AI APIs; constrained vs. unconstrained AI behavior; system architecture; moving
from prompting toward software building; personal systems / useful automation;
human understanding and authorship; interactive exercises; the course
software/environment itself.

### 9.2 Media — all TODO

`public/portfolio/cs1501/` contains only `README.md`, `MANIFEST.md`,
`media.manifest.json`, `.gitkeep`. **There are no CS 1501 image or video files
in the repo.** The manifest names and reserves filenames but every asset is
`source-needed` or `source-unconfirmed`.

Do not invent the CS 1501 media narrative. Leave these placeholders:

- **TODO-CS1501-1** — Capture / export, full-resolution, uncropped, unedited,
  from the running course site: `cs1501-home.png` (arranged-desk homepage, three
  sticky notes), `cs1501-course-experience.png` (Questions flashcards, question
  side), `cs1501-interactive-build.png` (*Build Your AI Friend*, Message 0 of 5,
  empty Your Creation panel), `cs1501-api-lesson.png` (the "…became instructions
  for your AI" interstitial), `cs1501-ai-systems.png` (Message 5 of 5, Your
  Creation populated).
- **TODO-CS1501-2** — Decide and capture the homepage `preview` for
  `src/content/projects.ts` (`cs1501-home.png` screenshot, or a short silent
  loop of the exercise).
- **TODO-CS1501-3** — Confirm/trim the video candidate
  (`~/Desktop/Screen Recording 2026-09-04 at 2.08.33 PM.mov`) as
  `cs1501-demo.mp4` + poster, or decide the case study runs on stills only.
  (Note: the same recording is also a candidate for the Notebook hero in
  `notebook/ASSET_MANIFEST.md` — see 17.1. Confirm which project it belongs to.)
- **TODO-CS1501-4** — Reserved/optional assets: `cs1501-questions-back.png`
  (flashcards flipped to answers), `cs1501-questionnaire.png` (Tell Me About You
  — candidate original located at
  `~/Desktop/Screenshot 2026-09-08 at 9.49.47 PM.png`), `cs1501-ai-setup.png`
  (the "What do you want to create?" worksheet), `cs1501-api-diagram.png`
  (standalone "what an AI API is" graphic — candidate at
  `~/Desktop/Screenshot 2026-09-06 at 5.14.30 PM.png`; confirm it is
  course-authored and note its style is not the course site's).
- **TODO-CS1501-5** — Sequence decision: the manifest recommends assets #3 → #4
  → #5 run in that order (*do it* → *name it* → *see the result*), optionally
  preceded by `cs1501-ai-setup.png`. Confirm during the asset pass.
- **TODO-CS1501-6** — Before any CS 1501 screenshot is published, resolve the
  instructor-email question: the Questions page contact card shows
  `rca8rw@virginia.edu`, which is not the author's computing ID. Confirm whether
  that is the intended instructor of record or a value to change first.
- **TODO-CS1501-7** — Write the CS 1501 case-study copy after the media exists,
  following Sections 7 and 10. Do not draft the detailed media narrative before
  the asset pass.

Do not fabricate metrics, enrollment, outcomes, or student feedback for CS 1501
(or any project).

---

## 10. Case-study writing rules

Voice: thoughtful, analytical, specific, understated, technically literate,
human.

Every case-study section moves through: **problem / question → design decision →
real product evidence → why it matters → next system implication.** Media sits
*inside* that argument as evidence. The page must not read as
`heading / video / heading / video`. No generic project galleries.

Banned register (do not use): revolutionary, innovative solution, cutting-edge,
seamless, robust platform, powerful solution, leveraging AI, game-changing,
next-generation, and the like. No em-dash-driven hype; keep sentences plain.

Do not invent users, adoption, savings, performance improvements, business
outcomes, metrics, technologies, or features that the source material does not
support.

Explain **why** a decision matters.

- Bad: "This video shows the ticket queue."
- Better: "Service requests become operational records that connect household
  context, financial responsibility, vendor assignment, scheduling, approval,
  and history rather than scattering those decisions across separate tools."

Captions (the `Caption` component: short bold lead-in + one line) describe what
the evidence proves, not what is on screen.

If documentation and a video description conflict, surface it (Section 17), do
not smooth it over in prose.

---

## 11. Visual / design rules

The current portfolio already has a strong, non-generic identity. **Preserve
it.** Do not redesign it in the build pass.

### 11.1 Keep (this is the identity)

- **Palette** (`src/styles/tokens.css`): warm paper `#fbfaf8`, near-black ink
  `#191b1e`, ink tints, hairline rules `#e3e0da` / `#cdc9c1`, one accent
  drafting-blue `#0f4c81` used only on the thesis operator, hovered nodes, link
  underlines, focus rings. The accent never covers a large area — **project
  media supplies the colour on this site.**
- **Type**: Instrument Sans for everything readable; IBM Plex Mono only for
  labels, indices, and asset paths (technical annotation). Loaded from Google
  Fonts in `index.html`. `clamp()` type scale in tokens.
- **Motion vocabulary**: things either fade in or draw themselves in as a
  hairline. No bounce; scale never exceeds 1.012. `prefers-reduced-motion`
  collapses all durations to ~1ms and renders resting states. Keep this — it is
  part of why the site does not read as generic.
- **Layout primitives**: `.shell` (max-width 1560px, centered, two vertical
  hairline rules on wide screens), `.wrap` (gutter padding), `.rule` hairlines,
  the 8px-derived spacing ladder, `--measure: 34rem` reading column.
- **The branch diagram** (`Core`) as the structural statement of the thesis.
- **Visible placeholders**: media slots render a ruled well printing the file
  path they want; `<Placeholder>` renders grey copy tagged with its source
  file. The site doubles as its own asset checklist. Keep this until content is
  real.

### 11.2 Target feel

Editorial case study + strategy/consulting portfolio + engineering portfolio.
The applications provide the visual personality; the portfolio shell supports
them and does not compete.

Use: strong typography, whitespace, hierarchy, large real product media,
concise explanation, deliberate variation in media scale, occasional
full-width visual moments.

### 11.3 Avoid

Excessive rounded cards; everything boxed in containers; glassmorphism; giant
gradients; gradient text; glowing borders; excessive pills/badges; fake
browser/device mockups; tech-logo walls; fake metrics; arbitrary scroll
animations; decorative visual noise; generic SaaS landing-page composition.
(The current build already avoids all of this. Do not introduce any of it.)

### 11.4 Media scale is a design tool

Do not display every clip at one uniform size. Within a case study, vary
deliberately: a flagship clip large or full-width, supporting clips small,
inline stills where a still is enough. One `FullBleedMedia` per page at most
(Notebook: clip 10; Barclay: the system/operations moment).

---

## 12. Video behavior rules

Define one reusable media/video component; do not duplicate playback logic per
case study. The current `src/components/Media.tsx` (`MediaVideo`) is the place
to extend.

Short embedded product demos should:

- autoplay, muted, loop, `playsInline`
- **no visible controls** for decorative case-study loops (pass
  `controls={false}`; `MediaVideo` already supports hiding its toggle, but the
  default is `controls={true}` — set the case-study blocks to `false`)
- **play at 2× via `video.playbackRate = 2` set programmatically** in an effect
  in `MediaVideo` (and reassert `playbackRate` on the `loadedmetadata` /
  `play` events, since some browsers reset it). **Never modify the `.mov` /
  encoded files to fake 2×.** Consider a `rate?: number` prop on `VideoMedia`
  so a clip can opt out (e.g. the long DEFINE clips may read better at 1×).
- preserve aspect ratio; do not crop meaningful UI. Prefer `fit="contain"` (or
  a correct per-clip `aspect`) over `fit="cover"` for screen-capture footage —
  `cover` is the current default and will crop 3132×2008 / 2872×2008 frames.
- lazy-load where appropriate (add `preload="none"` / defer `src` until near
  viewport for below-the-fold clips; images already lazy-load)
- **pause when substantially offscreen** and resume on re-entry — add an
  `IntersectionObserver` in `MediaVideo` (there is a `useReveal` observer
  pattern in `src/lib/` to mirror). This matters: a Notebook or Barclay page
  could otherwise decode a dozen multi-MB videos at once.
- respect `prefers-reduced-motion` — already handled: the video holds on its
  poster with a Play control. Keep that path working with the new behaviors
  (no autoplay, no forced 2×, no observer-driven play under reduced motion).
- provide a poster / static fallback where appropriate — every case-study clip
  should ship a poster frame (`.jpg`, no edits, a representative frame, not a
  blank canvas).

The `Media` content type (`src/content/media.ts`) already abstracts
image/video/placeholder behind one object, so a clip is one line in a content
file. Keep that; extend `VideoMedia` with `rate?` and `poster` usage rather
than special-casing components.

---

## 13. Responsive rules

- **Desktop**: allow alternating media/text layouts where it helps
  (`CaptionedMedia` already sets caption beside media and supports
  `side="left"`). Use larger or full-width media for the most important complex
  visuals (Notebook 10; Barclay operations).
- **Mobile**: stack media and explanation. `TextSection` collapses its
  two-column heading/body grid below 900px; `media-grid` collapses to one
  column below 760px; `Core` collapses to a single spine below 860px — these
  already work.
- Application UI in screenshots and video must stay readable. Do **not** crop
  the meaningful portion of a capture to hold a decorative aspect ratio. Set a
  correct `aspect` per clip and let it letterbox if needed.
- The page body must never scroll horizontally; wide content
  (`FullBleedMedia`) escapes the gutters via negative margin, not `100vw`
  (already implemented in `media.css`).

---

## 14. Recommended reusable content / component architecture

### 14.1 Principle

Prefer **structured project data + flexible case-study sections** over three
giant duplicated hardcoded page files. But do not force the three projects into
one identical visual template — Notebook, Barclay, and CS 1501 tell different
stories and should have different rhythms. Shared components give consistency;
flexible section composition gives each case study its own shape. This is
already the architecture the repo is built on (`README.md`: "Project pages are
shells… reorder, delete, or add from `src/components` freely").

### 14.2 What already exists and should be reused

- **Content layer** — `src/content/projects.ts` (project identity: id, index,
  title, branch, subtitle, route, meta, homepage `preview`), `media.ts` (the
  `Media` union + `slot()` helper), `site.ts` (all non-project copy).
- **Page shell components** — `ProjectHero`, `NextProject` (`Project.tsx`),
  driven entirely by `projects.ts`.
- **Section/block components** — `TextSection`, `ProcessSection`, `Placeholder`
  (`TextBlocks.tsx`); `LargeMedia`, `VideoBlock`, `ImageGrid`, `CaptionedMedia`,
  `FullBleedMedia` (`MediaBlocks.tsx`) — all thin compositions over `Media`, so
  every block already accepts image / video / placeholder interchangeably.
- **Primitives** — `Media`, `Reveal`, `Nav`, `Footer`; hooks `useReveal`,
  `useReducedMotion`, `useScrollRestoration`.
- All are re-exported from `src/components/index.ts`.

### 14.3 Recommended additions (build pass, not this pass)

1. **A per-project case-study content module.** Add
   `src/content/notebook.ts`, `barclay.ts`, `cs1501.ts` (or a
   `src/content/case-studies/` folder) exporting an ordered array of section
   descriptors — e.g.
   `{ id, kind: 'text' | 'media' | 'process' | 'media+text', heading, body,
   media, scale: 'inline' | 'large' | 'full', caption }`.
   The page file then maps over that array. Copy and media selection live in
   data; layout logic lives in components. This keeps the three page files
   short and different in sequence without duplicating block wiring.
2. **Extend `VideoMedia`** with `rate?: number` and standard `poster` usage
   (Section 12). No new component.
3. **A `MediaFigure` wrapper** (optional) that unifies the
   `Reveal as="figure"` + `Media` + `Caption` pattern the five media blocks
   repeat, parameterized by `scale`. Only if it reduces duplication; do not
   over-abstract.
4. **Keep `ProcessSection`** for genuine ordered sequences only (Notebook
   DEFINE 01→02, ORGANIZE 07→08; Barclay 13→10, 12→11→03; CS 1501 the
   *do it → name it → see it* sequence). Do not use it as a generic list.
5. **Do not** add routing, a CMS, MDX, or a component library. The stack stays
   as-is.

### 14.4 Page composition intent (starting point, reorder freely)

- **Notebook** — `ProjectHero` → short "what it is / the middle ground" text →
  DEFINE `ProcessSection` (01→02) → BUILD: large `VideoBlock`/`FullBleedMedia`
  (03) + small inset (04) + medium (09) with text between → `FullBleedMedia`
  (10) as the developed-system payoff → ORGANIZE `ProcessSection` or
  text+media (07→08) → optional small geometry figure (06) inside "why it
  matters" → `NextProject`.
- **Barclay Woods** — `ProjectHero` → "one community, many stakeholders" text +
  A media (01/10/16) → B (13→10) as the lead systems argument, larger media →
  C (12→11→03) `ProcessSection` → D resident-experience text + media (05/16/08,
  15 supporting) → E (06→07, 02 supporting) → `NextProject`. Lead with the
  problem; give the operating-model moment the biggest frame.
- **CS 1501** — structured more like a syllabus than a case study: "why the
  course" → "what students do before class" → the *do it → name it → see it*
  sequence (media TODO) → what the site itself is (software built to the
  standard it teaches) → `NextProject`. All media blocked on TODO-CS1501-*.

---

## 15. Final implementation checklist

Ordered roughly by dependency. None of this is done in the current pass.

### 15.1 Media delivery (blocks most of the rest)

- [ ] **Decide the delivery encode for `.mov` sources.** Current files are
      `.mov` / H.264 with a live audio track, 3132×2008 (Notebook) and
      2872×2008 (Barclay). The site's `<video>` path, `public/portfolio/README.md`,
      and the `VideoMedia` type all assume `.mp4`, no audio. Options: (a)
      transcode each selected clip to `.mp4`, strip audio, cap width ~1600px,
      trim to a clean loop, export a `.jpg` poster; or (b) serve `.mov`
      directly (Safari-only autoplay, large files — not acceptable). Choose
      (a). `ffmpeg` is **not** installed in this environment (per the notebook
      and CS 1501 manifests) — this step needs a machine that has it.
- [ ] Keep the untouched `.mov` originals in `videos/`. Put delivery encodes at
      the flat project path (`/portfolio/notebook/<name>.mp4`,
      `/portfolio/barclay-woods/<name>.mp4`) so slots map cleanly, or in a
      `videos/mp4/` subfolder — pick one and record it here.
- [ ] Trim the long clips before encoding: Notebook 01 (~69 s), 02 (~46 s);
      Barclay 10 (~49 s), 08 (~37 s), 07 (~33 s). Loops should be ~8–20 s.
- [ ] Export poster frames for every on-page clip.
- [ ] CS 1501: complete TODO-CS1501-1 through -6 (capture stills, confirm the
      video candidate and its project, resolve the instructor email).

### 15.2 Component / behavior work

- [ ] Extend `MediaVideo` in `src/components/Media.tsx`: programmatic
      `playbackRate = 2` (reasserted on `loadedmetadata`/`play`), respecting
      reduced motion and an opt-out `rate?` prop on `VideoMedia`
      (`src/content/media.ts`).
- [ ] Add `IntersectionObserver`-driven pause/resume when a video is
      substantially offscreen; disable under reduced motion.
- [ ] Add lazy loading for below-the-fold video (`preload="none"` or deferred
      `src`).
- [ ] Set case-study demo blocks to `controls={false}`; confirm the reduced-
      motion Play control still appears.
- [ ] Default screen-capture media to a correct per-clip `aspect` and
      `fit="contain"` (or a matched frame) so no UI is cropped.
- [ ] (Optional) `MediaFigure` wrapper with a `scale` prop.

### 15.3 Content architecture

- [ ] Add per-project case-study content modules (14.3.1). Move selection +
      copy into data.
- [ ] Rewrite `site.heroCopy`, `site.coreCopy`, `site.about.body` per Section 8.
- [ ] Reorder the `projects` array to Barclay → Notebook → CS 1501; update
      `index` strings and `branch` lines (Section 2.2).
- [ ] Fill each project's `meta` table with real values (currently
      "Placeholder" / "——"). Do not invent — if a value isn't known, cut the
      row rather than faking it.
- [ ] Replace homepage `preview` slots with real media (CS 1501 stays a slot
      until its assets land).

### 15.4 Page builds

- [ ] Rebuild `src/pages/Notebook.tsx` to Sections 4–5 and 14.4. Remove all
      `<Placeholder>` / `slot()` as real content replaces them.
- [ ] Rebuild `src/pages/BarclayWoods.tsx` to Sections 7–8 and 14.4.
- [ ] Rebuild `src/pages/Cs1501.tsx` to Section 9 framing; leave media
      placeholders visible and tagged until TODO-CS1501-* are done.
- [ ] Write all case-study copy to Section 10 rules.

### 15.5 Verify

- [ ] `npm run build` (runs `tsc -b` then `vite build`) is clean.
- [ ] No `<Placeholder>` or media `slot()` ruled-well is visible on any page
      that is considered "done" (CS 1501 excepted until its asset pass).
- [ ] Reduced-motion pass: no autoplay, posters shown, Play controls work, the
      branch diagram and reveals render in resting state.
- [ ] Mobile pass: no horizontal scroll; media and text stack; UI in captures
      stays readable.
- [ ] Total video weight per page is reasonable with lazy-load + offscreen
      pause active.
- [ ] `resume.pdf` exists at `public/resume.pdf` or `site.links.resume` points
      at a hosted file; `site.links.linkedin` / `email` are real.
- [ ] SPA rewrite still in place (`public/_redirects`: `/* /index.html 200`)
      so `/notebook` etc. survive a hard refresh.

---

## 16. Assets intentionally optional or omitted

### 16.1 Notebook

| Asset | Decision | Reason |
|---|---|---|
| `notebook-05-contextual-question-on-tree.mov` | **Omit from primary presentation.** Keep the file. | ~0.5 s freeze-frame; redundant with clip 03. A poster still could be pulled from it if ever needed. |
| `notebook-06-geometry-inspector.mov` | **Optional.** Use only as a small figure inside "why it matters." | Internal inspection/tooling, not part of the product narrative. Do not overemphasize debugging tooling. |
| `notebook-04-build-from-here-purpose-previews.mov` | Include, but **supporting scale only** (small inset). | ~6 s supporting affordance clip; 03 carries the Build argument. |
| Curated stills S1–S7 / `multi-tree-page.png`, `contextual-question.png`, `proposal-approval.png`, `focus-shift.png`, `geometry-inspector.png`, `table-proposal.png`, `inline-refinement.png`, `live-build.mp4` (from `notebook/ASSET_MANIFEST.md`) | **Not used / superseded.** | These were planned by an earlier asset-selection pass and were never placed in the repo. This spec and the current media set are built on the 10 numbered `.mov` recordings. See 17.1. Poster frames extracted from the `.mov` clips replace the intent of these stills. |
| Pre-rebuild Notebook screen recordings (`Screen Recording 2026-08-02` / `2026-08-15`) and Safari-chrome full-screen screenshots | Omit. | Predate the current UI (Geometry panel, hierarchy colouring, Tables, "PROPOSED — NOT YET PART OF THE PAGE"); mixing them shows an inconsistent product. |

### 16.2 Barclay Woods

| Asset | Decision | Reason |
|---|---|---|
| `barclay-04-resident-profile-edit.mov` | **Likely omit** (optional). | Valid functionality, weak systems-thinking evidence. |
| `barclay-09-community-handbook-faqs.mov` | **Optional.** Include only to support the AI/knowledge section as a static-reference contrast. | Largely static information browsing. |
| `barclay-14-board-calendar-overview.mov` | **Optional.** Include only if it adds something 15/16 do not. | Overlaps the calendar coverage in 15 + 16. |
| `barclay-02-reference-index-conversations.mov` | **Supporting only**, inside Section E, if a visibility/history point is worth making. | ~7 s; do not overclaim its purpose. |
| `barclay-15-board-create-event.mov` | **Supporting only**, inside Section D. | The authoring counterpart to the resident calendar; not a standalone beat. |
| Planned screenshots `barclay-home.png`, `barclay-community-chat.png`, `barclay-operations.png`, `barclay-payments.png`, `barclay-calendar.png`, `barclay-demo.mp4`, `barclay-role-switching.png` (from `barclay-woods/MANIFEST.md` / `media.manifest.json`) | **Not used as specified / superseded.** Some may be re-created as poster stills from the videos. | An earlier asset-preparation pass reserved these names; no files were ever written. This spec is built on the 16 numbered `.mov` recordings. See 17.2. |
| `Barclay Woods.html`, `Barclay Woods - Clickable Prototype.html` | Omit. | Prototypes, not media assets. |

### 16.3 CS 1501

| Asset | Decision | Reason |
|---|---|---|
| **All CS 1501 media** | **Blocked — none exists in the repo.** Every asset is a TODO (Section 9.2). | The CS 1501 media pass has not happened. `public/portfolio/cs1501/` holds only docs. |
| `cs1501-api-diagram.png` (alternate "what an AI API is" graphic) | **Optional, needs confirmation.** | Candidate located at `~/Desktop/Screenshot 2026-09-06 at 5.14.30 PM.png`; confirm it is course-authored and note its visual style is not the course site's. |
| `cs1501-questions-back.png`, `cs1501-ai-setup.png` | **Reserved / optional.** | Pairs for the flashcards and the API lesson; include only if a fourth frame helps the sequence. |
| The `04-demo-chatbot-welcome-website.md` chat-demo design | **Not portfolio material.** | Superseded by the shipped *Build Your AI Friend* (conversation → image, five-message budget). Screenshots of the shipped version are the source of truth. See 17.6. |

---

## 17. Conflicts and inconsistencies found

Flag, don't silently resolve. Each needs a decision during implementation.

### 17.1 Notebook: two incompatible media strategies on file

`public/portfolio/notebook/ASSET_MANIFEST.md` describes a **curated set of 7
stills (S1–S7) plus one hero `live-build.mp4`** transcoded from
`Screen Recording 2026-09-04 at 2.08.33 PM.mov`. `public/portfolio/notebook/videos/README.md`
describes a **later pass that placed 10 numbered `.mov` screen recordings**
(`notebook-01…10`). Only the 10 `.mov` files exist in the repo; none of the
S1–S7 stills or `live-build.mp4` were ever placed. This task brief and this
spec are built entirely on the 10 recordings.
**Resolution needed:** treat `videos/README.md` + the 10 recordings as
authoritative; treat `ASSET_MANIFEST.md` as a superseded plan (its geometry /
provenance *interpretations* are still useful for copy). Poster frames pulled
from the clips replace the S1–S7 still intent. Consider deleting or clearly
marking `ASSET_MANIFEST.md` as superseded so a future pass doesn't chase
missing files.

### 17.2 Barclay: same pattern

`public/portfolio/barclay-woods/MANIFEST.md` and `media.manifest.json` plan
**5 screenshots + 1 demo video** (`barclay-home.png`, `barclay-community-chat.png`,
`barclay-operations.png`, `barclay-payments.png`, `barclay-calendar.png`,
`barclay-demo.mp4`) — none written. `videos/README.md` covers **16 numbered
`.mov` recordings** — all present. This spec uses the 16 recordings.
**Resolution needed:** confirm `videos/README.md` + the 16 recordings are
authoritative; the MANIFEST's per-asset *interpretation* paragraphs remain good
raw material for the systems-thinking copy, but the file's asset list is a
superseded plan. The MANIFEST's "suggested page-slot mapping" targets the old
`BarclayWoods.tsx` placeholders and should not be followed literally.

### 17.3 Video format vs. what the site and its docs assume

`public/portfolio/README.md` states "Formats: `.mp4` for video", "Export
without an audio track", "always ship a poster". `src/content/media.ts`
(`VideoMedia`) and `src/components/Media.tsx` only reference `.mp4` and have no
2×-playback, no offscreen-pause, and `controls` defaulting to `true`. The
actual media is `.mov` / H.264 with audio still present, at 3132×2008 /
2872×2008, some clips 30–69 s. **Nothing about delivery encoding, muting,
looping, trimming, postering, or 2× has been done** (both video READMEs say
this is deliberately a "delivery-time concern"). This is the single largest
implementation gap. See 15.1 and 15.2. `ffmpeg` is not available in this
environment.

### 17.4 `fit="cover"` will crop screen captures

`Media` defaults to `fit="cover"`, which crops to the frame. Screen recordings
at 3132×2008 (~1.56:1) and 2872×2008 (~1.43:1) dropped into a `16/9` or `3/2`
block will lose UI at the edges — directly against the brief's "avoid cropping
important UI." Implementation must set correct per-clip `aspect` and prefer
`fit="contain"` for these.

### 17.5 Homepage preview: video vs. screenshot for Barclay

The brief wants "three strong pieces of media presented together" and calls
Barclay's homepage media "its strongest representative application media"
(media, possibly video). `barclay-woods/MANIFEST.md` maps the homepage
`preview` to `barclay-home.png` (a static homepage screenshot that does not
exist). These are reconcilable — a trimmed loop of clip 10 or 13 satisfies the
brief better than a marketing homepage shot — but the choice should be explicit.
Recorded recommendation in 2.2: a short loop from clip 10 or 13, screenshot as
fallback.

### 17.6 CS 1501: shipped exercise vs. the spec on file

`04-demo-chatbot-welcome-website.md` describes *Build Your AI Friend* as a
**chat** demo. The shipped exercise (per `cs1501/MANIFEST.md`, confirmed by the
updated `chloelaforge/06-ai-companion-course-website-updated.md`) is a
**conversation → generated image** build with a **five-message budget**. Use the
shipped version and its screenshots as the source of truth; do not describe the
older chat-demo design.

### 17.7 CS 1501: instructor email on a would-be published screenshot

The Questions page contact card shows `rca8rw@virginia.edu`, which
`cs1501/MANIFEST.md` notes is not the author's computing ID. Resolve before any
CS 1501 screenshot is published (TODO-CS1501-6).

### 17.8 Notebook clip 10 phase label

`videos/README.md` files `notebook-10-developed-system-overview.mov` under
"PHASE 3 — ORGANIZE (also: canvas navigation / inspection)". This spec places it
between BUILD and ORGANIZE as the "developed system payoff." Not a
contradiction — the README's "Potential portfolio role" already calls it "the
'developed visual structure' beat" — but the narrative position here is a
deliberate choice, noted so it isn't read as an error against the index.

### 17.9 `projects.ts` `index` is described as "purely presentational"

The comment says reordering the array is what matters, but `index` is a
hardcoded string per project and is rendered in the Core diagram, Work previews,
and project hero. Reordering the array without updating the three `index`
strings would show `02, 01, 03`. Update both together (15.3).

### 17.10 Shared clips referenced by two sections

Barclay 10 (Sections A + B) and Barclay 16 (Sections A + D); Notebook has none.
The brief says do not embed the same video file twice on the final page.
Resolution: play the file in its primary section, refer to it in prose (or use
a poster still) in the secondary one. Noted so the build doesn't
double-instantiate a heavy `<video>`.

---

## 18. Completion report for this pass

- **File created:** `/Users/chloelaforge/Downloads/portfolio/PORTFOLIO_IMPLEMENTATION.md`
- **Sections:** 0 (how to read + source-of-truth rule + doc inventory), 1 thesis,
  2 homepage, 3 Notebook core story, 4 Notebook narrative, 5 Notebook media map,
  6 Barclay core story, 7 Barclay narrative, 8 Barclay media map, 9 CS 1501
  framing + TODOs, 10 writing rules, 11 visual rules, 12 video behavior, 13
  responsive, 14 content/component architecture, 15 implementation checklist,
  16 optional/omitted assets, 17 conflicts, 18 this report.
- **No application code, styles, routes, media, or video files were modified.**

### Notebook media selected (primary)
`notebook-01-intake-and-questions.mov`, `notebook-02-summary-page-approval.mov`
(DEFINE); `notebook-03-contextual-question-proposal.mov` (flagship),
`notebook-04-build-from-here-purpose-previews.mov` (supporting),
`notebook-09-multi-tree-proposal-expansion.mov` (BUILD);
`notebook-10-developed-system-overview.mov` (developed-system payoff,
full-width); `notebook-07-tables-choose-objective.mov`,
`notebook-08-table-package-generation.mov` (ORGANIZE).

### Notebook media optional / omitted
`notebook-06-geometry-inspector.mov` — optional, small technical figure only.
`notebook-05-contextual-question-on-tree.mov` — **omitted from primary
presentation** (0.5 s freeze-frame; asset kept). Superseded plan: the S1–S7
stills and `live-build.mp4` in `ASSET_MANIFEST.md` (never placed).

### Barclay media selected (primary)
`barclay-01-vendor-submit-interest.mov`, `barclay-10-management-ticket-vendor-pool.mov`,
`barclay-16-resident-community-calendar.mov` (stakeholders);
`barclay-13-management-service-types.mov` → `barclay-10` (operations);
`barclay-12-management-hub-add-household.mov`,
`barclay-11-management-hub-invitations.mov`,
`barclay-03-resident-household-invite.mov` (community model);
`barclay-05-resident-hoa-payment.mov`, `barclay-16`,
`barclay-08-management-post-announcement.mov` (resident experience);
`barclay-06-ask-mr-barclay-chat.mov` → `barclay-07-management-mr-barclay-config.mov`
(AI within the system). Supporting: `barclay-15-board-create-event.mov`,
`barclay-02-reference-index-conversations.mov`.

### Barclay media optional / omitted
Optional: `barclay-14-board-calendar-overview.mov`,
`barclay-09-community-handbook-faqs.mov`. Likely omitted:
`barclay-04-resident-profile-edit.mov`. Superseded plan: the 5 screenshots +
`barclay-demo.mp4` in `MANIFEST.md` / `media.manifest.json` (never placed);
`barclay-role-switching.png` (reserved, never assigned).

### Unresolved CS 1501 TODOs
TODO-CS1501-1 capture five core stills; -2 homepage preview asset; -3 confirm/
trim the demo video candidate and confirm which project it belongs to; -4
reserved/optional assets (questionnaire, questions-back, ai-setup, api-diagram);
-5 confirm the do-it → name-it → see-it sequence; -6 resolve the
`rca8rw@virginia.edu` instructor-email question before publishing screenshots;
-7 write CS 1501 case-study copy after media exists. No CS 1501 image or video
files exist in the repo.

### Conflicts discovered (detail in Section 17)
1. Notebook has two incompatible media plans on file (`ASSET_MANIFEST.md`
   curated stills + `live-build.mp4` vs. the 10 numbered `.mov` recordings);
   only the recordings exist.
2. Barclay has the same split (`MANIFEST.md` 5 screenshots + demo vs. 16
   numbered `.mov` recordings); only the recordings exist.
3. Video format/behavior gap: sources are `.mov` + audio, large, some 30–69 s;
   the site, `public/portfolio/README.md`, and the `VideoMedia` type assume
   `.mp4`, no audio, with poster frames. No transcode/trim/mute/loop/poster/2×/
   offscreen-pause work has been done; `ffmpeg` is not in this environment.
4. `Media` defaults to `fit="cover"`, which will crop screen-capture UI —
   against the brief.
5. Homepage `preview` for Barclay: brief implies strong (possibly video) media;
   `MANIFEST.md` maps it to a nonexistent static homepage screenshot.
6. CS 1501 *Build Your AI Friend*: the `04-*` spec describes a chat demo; the
   shipped exercise is conversation → image with a five-message budget
   (screenshots are source of truth).
7. CS 1501 Questions page shows an instructor email that is not the author's ID.
8. Notebook clip 10 is indexed under PHASE 3; this spec positions it between
   BUILD and ORGANIZE as the developed-system payoff (deliberate, not an error).
9. `projects.ts` `index` strings must be updated alongside any array reorder.
10. Barclay clips 10 and 16 each serve two sections; must not be embedded twice
    as `<video>` on the final page.

**Stop here. The next pass is implementation.**
