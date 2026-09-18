# Barclay Woods — video asset index

> **Delivery status — 2026-09-09.** The eleven on-page clips (01, 03, 05–08,
> 10–13, 16) now ship a browser-safe sibling encode: `barclay-NN-*.mp4`
> (H.264, **audio track removed**, scaled to 1600 px wide, same frames — no
> trim, no speed change) plus a `barclay-NN-*-poster.jpg` still. Encoded with
> an AVFoundation export (no `ffmpeg` here); the `.mov` originals in this
> folder are untouched. The case study
> (`src/content/case-studies/barclay.ts`) references the `.mp4`s.
> `barclay-13`'s poster is also reused at
> `../barclay-home-still.jpg` as the homepage still, standing in for the
> not-yet-captured `barclay-home.png` (see `../MANIFEST.md`). The five planned
> screenshots in `../MANIFEST.md` (home, community-chat, operations, payments,
> calendar) were not found as clean uncropped originals and are still missing.


Asset-organization pass only. This file records what each screen recording
shows and where it might be used later. It is **not** the case study, and no
case-study copy has been written yet.

- **Folder:** `public/portfolio/barclay-woods/videos/`
  (served from `/portfolio/barclay-woods/videos/<filename>`)
- **Source:** 16 `.mov` screen recordings the owner placed in
  `~/chloelaforge/`, named `1-barclay.mov` … `16-barclay.mov`.
- **Naming:** `barclay-NN-[semantic-name].mov`. The `NN` prefix preserves the
  owner's original 1–16 sequence; the semantic part describes the workflow in
  the recording.
- **Move method:** copied to this folder, verified byte-for-byte (MD5) and by
  duration, then the sources were deleted. No re-encode, compression, trim, or
  speed change — original files, original timestamps.
- All recordings: H.264 + AAC, 2872×2008, same browser-chrome capture, same
  app running on `localhost`. Durations 6.7 s – 49 s.
- The persistent **View as Resident / Management / Vendor** control is visible
  in almost every recording.

---

### Barclay 01
Original: `1-barclay.mov`
New filename: `barclay-01-vendor-submit-interest.mov`
Feature: Vendor — service opportunities / express interest
One-sentence description: In the Vendor "Your work at Barclay Woods" view, an open Lawn Mowing opportunity is opened and interest is submitted with a proposed date, time, and note, after which the card shows "Interest submitted" with Revise / Withdraw options.
Potential portfolio role: Evidence for the vendor side of the ticket/service workflow and the role-specific experience of one shared platform.

### Barclay 02
Original: `2-barclay.mov`
New filename: `barclay-02-reference-index-conversations.mov`
Feature: FAQs — Reference Index (Management view)
One-sentence description: Under FAQs → Reference Index, the Management view lists dated "Conversation summary" entries and opens individual saved Ask Mr. Barclay exchanges to read their AI-written summaries.
Potential portfolio role: Supporting detail for the AI-assistance / resident-information section — showing that assistant conversations are retained and browsable.

### Barclay 03
Original: `3-barclay.mov`
New filename: `barclay-03-resident-household-invite.mov`
Feature: Resident — Profile & Settings, household invitation
One-sentence description: A resident's Profile & Settings page shows personal details and the "Unit 101" household, then generates a one-time household invitation code ("You're inviting someone home") and copies it.
Potential portfolio role: Resident-information / household-management beat; pairs with Barclay 04 as the two halves of the resident account surface.

### Barclay 04
Original: `4-barclay.mov`
New filename: `barclay-04-resident-profile-edit.mov`
Feature: Resident — Profile & Settings, edit personal details
One-sentence description: The resident opens the Personal Details editor (display name, phone number, profile photo link), saves, and the page confirms "Changes saved."; household, emergency contacts, vehicles, pets, account, and history sections are also visible.
Potential portfolio role: Resident-information beat; a concise "resident manages their own record" clip.

### Barclay 05
Original: `5-barclay.mov`
New filename: `barclay-05-resident-hoa-payment.mov`
Feature: Resident — HOA Payments, pay a statement balance
One-sentence description: From the household Account (Statement tab, $5.00 current balance) the resident starts "Pay balance", reviews the "Settle Your Statement" summary, and is redirected to Stripe checkout.
Potential portfolio role: Payments / household-finances section; demonstrates the end-to-end pay flow including the external checkout hand-off.

### Barclay 06
Original: `6-barclay.mov`
New filename: `barclay-06-ask-mr-barclay-chat.mov`
Feature: Resident — Ask Mr. Barclay AI assistant
One-sentence description: A resident opens Ask Mr. Barclay, sends a note ("I'm excited to move into the neighborhood!"), sees a "checking a few details…" state, and receives an AI-written reply signed "Mr. Barclay".
Potential portfolio role: Primary clip for the Ask Mr. Barclay / AI-assistance section (resident-facing side).

### Barclay 07
Original: `7-barclay.mov`
New filename: `barclay-07-management-mr-barclay-config.mov`
Feature: Management — configure Mr. Barclay (Manage FAQs + AI Goals & Knowledge)
One-sentence description: In the Management view of the FAQ area, Handbook entries are managed (Add / Edit / Delete FAQ), and the "AI Goals & Knowledge" panel is used to edit the assistant's guidance text and reference the Knowledge Documents it draws on.
Potential portfolio role: Management-operations counterpart to Barclay 06 — shows the AI assistant is a configurable, governed surface.

### Barclay 08
Original: `8-barclay.mov`
New filename: `barclay-08-management-post-announcement.mov`
Feature: Management — Community Chat announcement
One-sentence description: In Community Chat (Management View) a new Management announcement is composed (title and details) for "Post Announcement", alongside a Pinned & Featured row of existing announcements with Edit / Unpin / Remove controls.
Potential portfolio role: Management-announcements / communication section; shows authority actions layered onto the shared feed.

### Barclay 09
Original: `9-barclay.mov`
New filename: `barclay-09-community-handbook-faqs.mov`
Feature: FAQs — Community Handbook
One-sentence description: "The Barclay Woods Handbook" FAQ list is browsed and individual questions (fees, disputed charges, maintenance requests, vendor access) are expanded to read their answers.
Potential portfolio role: Resident-information / self-service context; a calm reference screen to contrast with the AI assistant clips.

### Barclay 10
Original: `10-barclay.mov`
New filename: `barclay-10-management-ticket-vendor-pool.mov`
Feature: Management — Ticket Queue, ticket record and routing
One-sentence description: A "Lawn Mowing" ticket record (Unit 101, Pending Review) is opened and walked through its sections — Core Information, Financial Responsibility (HOA vs. Resident), Assignment with a confirmed "Publish to Vendor Pool", Pricing, Scheduling, Approval, Concerns, Attachments, Ticket Lifecycle, and Activity History.
Potential portfolio role: Anchor clip for the ticket/service-workflow and community-operations sections; the longest recording (~49 s).

### Barclay 11
Original: `11-barclay.mov`
New filename: `barclay-11-management-hub-invitations.mov`
Feature: Management — Operational Hub, Invitation Management
One-sentence description: In the Operational Hub's Invitation Management tab a new Registration Invitation is configured (assigned household, roles), reviewed (Resident + Management, Unit 102, 7-day expiry), created, and then appears as a Pending row in the invitations table.
Potential portfolio role: Management-operations section; shows onboarding/access administration as a first-class workflow.

### Barclay 12
Original: `12-barclay.mov`
New filename: `barclay-12-management-hub-add-household.mov`
Feature: Management — Operational Hub, add a household
One-sentence description: In the Operational Workspace's Households tab, "Add Household" is used to create "Unit 102", which then appears in the unit list as Vacant.
Potential portfolio role: Management-operations section; the smallest recording (~14 s), a quick "define the community's units" beat that precedes Barclay 11's invitation.

### Barclay 13
Original: `13-barclay.mov`
New filename: `barclay-13-management-service-types.mov`
Feature: Management — Ticket Queue, Service Types configuration
One-sentence description: The Service Types tab shows the community workflow mode (Booking Only vs. Completion and Billing) and the service catalog, then "New Service Type" is used to add "Plumbing Repair" with Estimate / Appointment / Final Management Approval requirement toggles.
Potential portfolio role: Service-type-configuration section; pairs with Barclay 10 to show configuration vs. the tickets it governs (requirements snapshotted per ticket).

### Barclay 14
Original: `14-barclay.mov`
New filename: `barclay-14-board-calendar-overview.mov`
Feature: Community Calendar — Board/Management view
One-sentence description: The Board view of the Community Calendar shows the Submissions tab (Submission Approval / Pending Queue, empty), then the month grid for September 2026 with a "Coming Up" agenda, and an event ("Pool Closure – Season 2026") is opened to show its detail panel.
Potential portfolio role: Community-calendar / coordination section; the board-side reading and approval surface.

### Barclay 15
Original: `15-barclay.mov`
New filename: `barclay-15-board-create-event.mov`
Feature: Community Calendar — Board Event Management, create event
One-sentence description: From "Board Event Management" the Create Event dialog is filled in (title "Pool Closure – Season 2026", start date and time, duration, description, optional photos) toward "Publish Event", which the panel notes bypasses resident submission approval.
Potential portfolio role: Community-calendar / event-creation section; the management authoring path.

### Barclay 16
Original: `16-barclay.mov`
New filename: `barclay-16-resident-community-calendar.mov`
Feature: Community Calendar — Resident view
One-sentence description: The resident's Community Calendar is browsed — month grid and "Coming Up" agenda, an event detail panel ("Fall Landscaping Begins"), the Journal list (Upcoming / Past) with a "Submit an Event" prompt, and the My Submissions tab.
Potential portfolio role: Community-calendar / resident-experience section; the resident counterpart to Barclay 14–15.
