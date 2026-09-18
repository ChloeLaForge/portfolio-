# Barclay Woods — media manifest

> **Status — 2026-09-09.** This static-screenshot plan is still valid and is
> **not** superseded by the numbered `.mov` library — both are intentional.
> None of the five planned screenshots below (`barclay-home.png`,
> `barclay-community-chat.png`, `barclay-operations.png`,
> `barclay-payments.png`, `barclay-calendar.png`) were locatable as clean,
> uncropped originals on this machine — the only Barclay captures found carry
> Safari chrome and desktop clutter. Until they land, the homepage tile uses
> `barclay-home-still.jpg` (a still frame from `barclay-13`, the service-type
> console) as an honest stand-in for `barclay-home.png`.


Asset-preparation pass. This file records which media the case study will use,
what each asset demonstrates, and the story beat it serves. It does **not**
implement the case-study page.

- **Media folder:** `public/portfolio/barclay-woods/` (served from
  `/portfolio/barclay-woods/<filename>`)
- **Naming:** lowercase, hyphenated, `barclay-*` prefix — matches the repo
  convention in `public/portfolio/README.md`.
- **Path note:** the brief suggested `public/projects/barclay-woods/`; this repo
  already namespaces media under `public/portfolio/<project>/`, so the existing
  convention is used instead.

## Case-study framing

Barclay Woods is a **role-based community operations platform** — one shared
platform that gives Residents, Management, and Vendors role-specific
experiences over a common object model. The media should read as *system and
operational design*, not a tour of screens. Recurring evidence across every
screenshot: the persistent **View as Resident / Management / Vendor** control,
i.e. one platform resolving to a role context.

## Selected assets

| # | Filename | Type | Story beat (case-study role) | Status |
|---|----------|------|------------------------------|--------|
| 1 | `barclay-home.png` | image / screenshot | Hero | source needed |
| 2 | `barclay-community-chat.png` | image / screenshot | Role-based platform (lead) + Communication | source needed |
| 3 | `barclay-operations.png` | image / screenshot | Community operations | source needed |
| 4 | `barclay-payments.png` | image / screenshot | Household finances | source needed |
| 5 | `barclay-calendar.png` | image / screenshot | Community coordination | source needed |
| 6 | `barclay-demo.mp4` | video (silent, looping) | Live implementation / walkthrough | source unconfirmed |

`barclay-role-switching.png` is **reserved, not assigned** — no dedicated
role-switch or Vendor-view screenshot was supplied. Add one here only if a
purpose-built capture (Vendor view, or a Resident/Management pair) is produced.

---

### 1. `barclay-home.png` — HERO

- **Media type:** PNG screenshot, full window, uncropped.
- **Demonstrates:** the single branded entry point (`Barclay Woods — Brielle,
  New Jersey`, "A stronger community lives here"), with left-hand navigation
  already scoped to the signed-in role (Community + My Account groups) and the
  Resident/Management/Vendor context control present.
- **Case-study role:** opening image / section hero.
- **Interpretation:** Establishes Barclay Woods as one product with one front
  door. The same platform that runs board operations and vendor service work
  presents the resident a calm, editorial home surface, with navigation and
  capability already resolved to the current role rather than a generic
  dashboard shared by everyone.

### 2. `barclay-community-chat.png` — ROLE-BASED PLATFORM (lead) + COMMUNICATION

- **Media type:** PNG screenshot, full window, uncropped. Management View.
- **Demonstrates:** one communication surface rendered under an explicit role
  context ("Viewing as — Management View" with a "View as Resident" toggle),
  the global Resident / Management / Vendor switch, first-class *Management
  announcement* objects, a "Pinned & Featured" region, per-post authority
  actions (Edit / Unpin / Remove), and the same Appreciate / Reply affordances
  a resident sees.
- **Case-study role:** primary visual for the role-based-platform section;
  reused for the communication section.
- **Interpretation:** Shows the shared-platform / role-specific-experience
  model in a single frame. The same community feed is the residents' notice
  board and management's announcement-and-moderation console; role state is
  made explicit rather than implied, and authority (post as management, pin,
  remove) is expressed as capabilities layered onto one shared object model —
  not a separate admin application.

### 3. `barclay-operations.png` — COMMUNITY OPERATIONS

- **Media type:** PNG screenshot, full window, uncropped. Ticket Queue →
  Service Types, Management.
- **Demonstrates:** the management operations console for service work — a
  community-wide workflow mode (Booking Only vs. Completion and Billing, with
  "Completion and Billing" current), a configurable Service Type catalog with
  per-type requirement flags (Estimate / Appointment / Final Approval
  required), triage tabs (Needs Attention / All Active / Archived / Complete),
  and the stated rule that each ticket snapshots its workflow requirements at
  submission and is never rewritten in flight.
- **Case-study role:** community operations / service-workflow section.
- **Interpretation:** Demonstrates the separation of a configurable workflow
  engine from the work it governs. Management tunes service types and a
  community billing mode; every submitted ticket carries an immutable snapshot
  of the rules in force when it was raised, so configuration changes apply to
  future work only and never destabilise open cases. One console, no
  retroactive edits.

### 4. `barclay-payments.png` — HOUSEHOLD FINANCES

- **Media type:** PNG screenshot, full window, uncropped. Account → Statement,
  Resident.
- **Demonstrates:** a household-scoped account ("Unit 101 Household"), current
  balance with due date, paid-to-date, a "Pay balance" action, a statement of
  open charges ("HOA Dues – October") and payments received, with Payment
  history and Payment methods as sibling tabs.
- **Case-study role:** household finances section.
- **Interpretation:** Demonstrates household-level financial visibility by
  resolving balance, due date, statement lines, payments received, and the
  payment action into one resident workflow — with the charge, owned by the
  unit rather than a person, as the single source of truth that every view
  recalculates from.

### 5. `barclay-calendar.png` — COMMUNITY COORDINATION

- **Media type:** PNG screenshot, full window, uncropped. Community Calendar,
  Resident.
- **Demonstrates:** one calendar carrying operational events (Fall Landscaping
  Begins, Gutter Cleaning – Buildings 1–4, September Board Meeting) alongside
  social events (Pickleball Social); Month / Week views plus a "Coming Up"
  agenda rail; a resident "Create Event" action and Calendar / Journal / My
  Submissions tabs.
- **Case-study role:** community coordination section.
- **Interpretation:** Demonstrates community coordination as a governed
  workflow, not a shared calendar file: residents submit events into a
  board-approval queue via "My Submissions", management publishes operational
  and social events onto one timeline, and every participant reads the same
  schedule through whichever view — month, week, or agenda — suits them.

### 6. `barclay-demo.mp4` — LIVE IMPLEMENTATION (slot, source unconfirmed)

- **Media type:** silent, looping H.264 MP4; ship a poster frame
  (`barclay-demo-poster.jpg`). Target < ~8 MB, ~1600px wide, no audio track.
- **Demonstrates (intended):** a short walkthrough of one workflow end to end
  (e.g. a service request moving through submission → review → scheduling, or a
  role switch changing the same surface's capabilities).
- **Case-study role:** live-implementation / process section.
- **Interpretation (intended):** Shows the platform behaving as one system in
  motion — a single workflow crossing role boundaries without leaving the
  product.
- **Status:** no confirmed Barclay Woods recording located in this
  environment. See "Assets not created" below.

---

## Cross-cutting note — role-based platform

The role-based-platform beat is carried by `barclay-community-chat.png` as its
lead image, but it is reinforced by every other screenshot through the
persistent **View as Resident / Management / Vendor** control and the
role-scoped navigation. In the case study these can be shown as a set
(operations = Management, finances + calendar = Resident, chat = Management with
a resident preview) to make the "one platform, many role experiences" point
without a dedicated composite.

## Suggested page-slot mapping (for later — not yet wired)

The current `src/pages/BarclayWoods.tsx` placeholders map cleanly to:

| Manifest asset | Existing slot in `BarclayWoods.tsx` |
|---|---|
| `barclay-home.png` | `ProjectHero` / homepage `preview` in `src/content/projects.ts` |
| `barclay-operations.png` | `FullBleedMedia` (currently `system-map.png`) |
| `barclay-demo.mp4` | `VideoBlock` (currently `live-build.mp4`) |
| `barclay-community-chat.png` | `CaptionedMedia` (currently `interface.png`) |
| `barclay-payments.png`, `barclay-calendar.png`, `barclay-home.png` (or a 3rd screen) | `ImageGrid` (currently `screen-01/02/03.png`) |

## Assets not created (no source available in this environment)

The screenshots above are attached to the working conversation but were **not
found on this machine** (checked `~/Desktop`, `~/Downloads`, `~/Documents`,
`~/Movies`; the most recent desktop captures are for other projects — CS 1501,
Notebook, MATLAB). Conversation attachments are downscaled renders, so writing
them here would recompress and degrade them. **No image files were written.**

To finish: drop the original full-resolution PNG exports into this folder under
the names in the table above. Do not crop, scale, or edit the UI in them.

Unverified video candidate: `~/Downloads/IMG_9031.MOV` (4.6 MB, 2026-09-06) —
confirm whether this is a Barclay Woods walkthrough before using it as
`barclay-demo.mp4`.
