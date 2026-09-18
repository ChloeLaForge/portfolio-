/* ============================================================
   BARCLAY WOODS — case-study narrative
   Reframed as a live consulting case, not a feature catalog:

   PLATFORM AT A GLANCE (6 surfaces) → THE CONSULTING CASE
   (problem → current system → system response → AI's role) →
   THE CORE OPERATING WORKFLOW (one ticket, three role-specific
   interfaces) → ONE KNOWLEDGE SYSTEM, THREE LEVELS OF ACCESS →
   IDENTITY FOLLOWS THE HOUSEHOLD (unit → member → object model) →
   COMMUNITY CALENDAR → COMMUNITY CHAT → PAYMENTS (Stripe live-state
   capture) → THE OPERATING SYSTEM UNDERNEATH THE INTERFACE
   (interactive closing model).

   The application remains the hero; architecture explains the
   product rather than burying the reader in implementation detail.
   Sections that don't serve this sequence were cut rather than
   relocated — this page is deliberately shorter than earlier drafts.

   Media is evidence, deliberately few. Screen recordings are the
   chrome-cropped .mp4 encodes (audio stripped, 1280px wide, same
   frames — see tools/cropvid.swift); they play at 2× (MediaVideo).
   The product stills live beside this file's IMG path; the AI
   Support tile in the opener reuses an existing video poster frame
   rather than a new capture.
   ============================================================ */

import type { Media } from '../media';
import type { ArchTreeNode, CaseStudy } from './types';

const V = '/portfolio/barclay-woods/videos';
const IMG = '/portfolio/barclay-woods';
const CLIP_ASPECT = '1280 / 772'; // cropped delivery ratio — browser chrome + rounded-corner black margin removed, full app viewport (sidebar-to-edge) kept

/** Each still's own native aspect (measured from the delivered PNG). These
 *  five captures aren't uniformly proportioned, so the box is sized to each
 *  file exactly — a mismatched fixed ratio combined with object-fit: cover
 *  would crop into the sidebar's left edge to force a uniform box. */
const SHOT_ASPECT: Record<string, string> = {
  'barclay-home': '1600 / 1015',
  'barclay-calendar': '1600 / 1019',
  'barclay-operations': '1600 / 1017',
  'barclay-payments': '1600 / 1019',
  'barclay-community-chat': '1600 / 1023',
};

/** `file` is the cropped `.mp4` basename in V (its `-poster.jpg` sits beside
 *  it). Screen-recording demos play at 2×, asserted in <MediaVideo>. */
const clip = (file: string, alt: string, rate = 2): Media => ({
  kind: 'video',
  src: `${V}/${file}.mp4`,
  poster: `${V}/${file}-poster.jpg`,
  alt,
  aspect: CLIP_ASPECT,
  rate,
});

/** A cropped product screenshot under IMG (Safari toolbar band only —
 *  no side/bottom crop, so the full sidebar and viewport are preserved).
 *  Boxed at its own native aspect so object-fit never has to crop it. */
const shot = (name: string, alt: string): Media => ({
  kind: 'image',
  src: `${IMG}/${name}.png`,
  alt,
  aspect: SHOT_ASPECT[name] ?? '3 / 2',
});

/** The opener's sixth tile: no standalone AI/FAQ screenshot exists yet, so
 *  this reuses the existing Ask Mr. Barclay demo's own poster frame — a
 *  real capture already in the asset set, not a new screenshot. */
const aiSupportShot: Media = {
  kind: 'image',
  src: `${V}/barclay-07-management-mr-barclay-config-poster.jpg`,
  alt: 'Ask Mr. Barclay: the assistant’s opening prompt “Hi, I’m Mr. Barclay. How can I help you today?” above a message field and a Send to Mr. Barclay action.',
  aspect: CLIP_ASPECT,
};

const householdTree: ArchTreeNode = {
  label: 'Household / Unit',
  id: 'household',
  tone: 'green',
  children: [
    {
      label: 'Household Member',
      id: 'member',
      tone: 'plum',
      children: [
        { label: 'User', id: 'user', children: [{ label: 'Authentication' }] },
        { label: 'Resident Profile', id: 'resident-profile' },
      ],
    },
    {
      label: 'Financial Ledger',
      tone: 'rust',
      children: [{ label: 'Charges' }, { label: 'Payments' }],
    },
    {
      label: 'Tickets / Service Requests',
      tone: 'brown',
      children: [
        { label: 'Routing' },
        { label: 'Vendor Assignment' },
        { label: 'Pricing' },
        { label: 'Scheduling' },
        { label: 'Approvals' },
      ],
    },
    { label: 'Activity / History', id: 'history', tone: 'slate' },
  ],
};

export const barclay: CaseStudy = {
  /* No project-hero masthead on this page (see BarclayWoods.tsx) — so
     no lead paragraph here either. "Platform at a glance" is the
     first thing under the global nav. */
  intro: [],
  sections: [
    /* ---- 01 · PLATFORM AT A GLANCE — opens the page ----------
       Compass composition: the heading anchors the center; four
       selected surfaces sit above/left/right/below it. `items` order
       is positional — [top, left, right, bottom] — read by
       FeatureOverviewBlock's compass branch. */
    {
      kind: 'feature-overview',
      id: 'overview',
      heading: 'Community Management Platform At A Glance',
      lead: 'One community platform. Several connected resident and management experiences.',
      layout: 'compass',
      items: [
        {
          media: shot('barclay-calendar', 'The resident Community Calendar: a September month grid and a Coming Up agenda of operational and social events.'),
          name: 'Community calendar',
          descriptor: 'Events, upcoming activity and submissions in one view.',
        },
        {
          media: shot('barclay-payments', 'The resident household Account: a current balance, due date, paid-to-date and a Pay balance action, with a statement of open charges below.'),
          name: 'Payments',
          descriptor: 'Household balances, payment history and transaction activity.',
        },
        {
          media: shot('barclay-community-chat', 'Community Chat in management view: a Post Announcement composer above a Pinned & Featured row of management announcements with Edit, Unpin and Remove controls.'),
          name: 'Community chat',
          descriptor: 'Announcements and resident communication in one shared space.',
        },
        {
          media: aiSupportShot,
          name: 'AI support',
          descriptor: 'Community guidance with escalation into accountable support.',
        },
      ],
    },

    /* ---- 02 · THE CONSULTING CASE ----------------------------- */
    {
      kind: 'tabs',
      id: 'consulting-case',
      intro: 'The consulting case',
      variant: 'nodes',
      defaultIndex: 0,
      tabs: [
        {
          label: 'Problem',
          heading: 'Community operations were fragmented across residents, management and outside vendors.',
          text: 'Requests, approvals, payments, communication and property history needed to remain connected even when different people were responsible for each step.',
          operatingState: {
            connection: 'scattered',
            nodes: [
              { label: 'Payments', tone: 'green' },
              { label: 'Requests', tone: 'rust' },
              { label: 'Resident data', tone: 'plum' },
              { label: 'Communication', tone: 'brown' },
            ],
          },
        },
        {
          label: 'Current system',
          heading: 'Traditional HOA workflows depend heavily on a central manager carrying context between disconnected processes.',
          text: 'When information lives with the person managing it rather than the property itself, handoffs create duplicated work, missing history and unclear ownership.',
          operatingState: {
            connection: 'routed',
            center: 'Manager',
            nodes: [
              { label: 'Payments', tone: 'green' },
              { label: 'Requests', tone: 'rust' },
              { label: 'Resident data', tone: 'plum' },
              { label: 'Communication', tone: 'brown' },
            ],
          },
        },
        {
          label: 'System response',
          heading: 'Barclay Woods turns those workflows into one role-aware operating system.',
          text: 'Residents, management and vendors interact with the same underlying records through interfaces scoped to what each role needs to see and do.',
          operatingState: {
            connection: 'orderly',
            center: 'Shared operating system',
            nodes: [
              { label: 'Resident', tone: 'plum' },
              { label: 'Household', tone: 'green' },
              { label: 'Ticket', tone: 'brown' },
              { label: 'Vendor', tone: 'plum' },
              { label: 'Payment', tone: 'rust' },
            ],
          },
        },
        {
          label: 'AI in the system',
          heading: 'AI supports the workflow without becoming the source of authority.',
          text: 'Mr. Barclay answers against approved community knowledge and can escalate unresolved questions into the same accountable support system used elsewhere in the platform.',
          operatingState: {
            connection: 'orderly',
            center: 'Shared operating system',
            flow: ['Approved knowledge', 'Mr. Barclay', 'Resident question', 'Support / ticket'],
            boundary: { left: 'Guidance', right: 'Protected workflow authority' },
          },
        },
      ],
      footnote: 'Built as a live community systems case and presented in the context of the community it was designed around.',
    },

    /* ---- 03 · THE CORE OPERATING WORKFLOW --------------------- */
    {
      kind: 'sequence',
      id: 'ticket-pipeline',
      intro: 'Core system · Service request orchestration',
      heading: 'The core operating workflow',
      lead: 'One ticket moves through three role-specific interfaces.',
      body: [
        'A resident request becomes a shared operational record. Management routes it, vendors act on scoped work, and every decision returns to the same ticket rather than creating disconnected workflows.',
      ],
      cue: {
        steps: [
          { label: 'Request' },
          { label: 'Rules' },
          { label: 'Management' },
          { label: 'Vendor' },
          { label: 'Same ticket', tone: 'brown' },
        ],
      },
      stepLayout: 'side',
      steps: [
        {
          eyebrow: 'Workflow rules',
          title: 'Configure rules, not bespoke flows.',
          body: [
            'Management defines the requirements attached to a service type rather than building a separate workflow for every request.',
          ],
          bullets: [
            'Requirement flags determine whether estimates, appointments and final approvals are needed.',
            'Those rules apply to future tickets while existing tickets retain the workflow state they were created with.',
            'The workflow engine interprets the rules; new service types do not require an entirely new process.',
          ],
          media: clip('barclay-13-management-service-types', 'The management Service Types tab: the community workflow mode, the service catalog, and New Service Type adding Plumbing Repair with Estimate, Appointment and Final Management Approval requirement toggles.'),
          caption: {
            lead: 'Rules, not bespoke flows',
            text: 'Adding a service type means defining requirements. The workflow engine already knows how to act on them.',
          },
        },
        {
          eyebrow: 'Management',
          title: 'Management receives the case with its context intact.',
          body: [
            'The submitted request arrives with its resident and household context already attached.',
          ],
          bullets: [
            'Management determines financial responsibility and the next operational path.',
            'Service rules determine whether an estimate, appointment or final approval is required.',
            'A sanitized work summary can be published to the vendor pool without exposing unnecessary resident information.',
            'Routing, pricing, scheduling, approvals and completion state remain attached to the same ticket.',
          ],
          media: clip('barclay-10-management-ticket-vendor-pool', 'A Lawn Mowing ticket record is walked through its sections: Core Information, Financial Responsibility split between HOA and resident, Assignment with Publish to Vendor Pool, Pricing, Scheduling, Approval, Concerns, Attachments, Lifecycle and Activity History.'),
          caption: {
            lead: 'One record holds the whole case',
            text: 'Unit context, financial responsibility, vendor assignment, pricing, scheduling, approvals and history stay connected in the ticket instead of scattering across tools.',
          },
        },
        {
          eyebrow: 'Vendor',
          title: 'The vendor sees the work, not the entire system.',
          body: [
            'Eligible work appears in the vendor’s scoped opportunity or assignment view.',
          ],
          bullets: [
            'The vendor can express interest and respond to the required workflow.',
            'Estimate and appointment requirements come from the service policy already defined by management.',
            'Vendor actions update the same underlying ticket rather than creating a second workflow.',
            'Residents and management remain connected to the resulting state without exposing management-only controls.',
          ],
          media: clip('barclay-01-vendor-submit-interest', 'In the vendor view, an open Lawn Mowing opportunity is opened and interest is submitted with a proposed date, time and note; the card then shows Interest submitted with Revise and Withdraw.'),
          caption: {
            lead: 'The vendor’s window',
            text: 'The job a vendor sees is the management ticket, published into the vendor workflow with only the context required to act.',
          },
        },
      ],
    },

    /* ---- 04 · ONE KNOWLEDGE SYSTEM, THREE LEVELS OF ACCESS ---- */
    {
      kind: 'tabs',
      id: 'knowledge',
      heading: 'One knowledge system, three levels of access.',
      lead: 'Community information moves from public reference content to resident-specific support while management controls the knowledge and behavior behind the assistant.',
      tabsHint: 'Click an access level to see how the same knowledge system changes.',
      autoCycle: true,
      variant: 'panel',
      defaultIndex: 0,
      tabs: [
        {
          label: 'Public',
          heading: 'Public FAQ',
          bullets: [
            'Anyone can read common community guidance without signing in.',
            'Public answers expose shared information without resident-specific context.',
            'Management-published FAQ changes update the shared public knowledge surface.',
          ],
          media: clip('barclay-09-community-handbook-faqs', 'The Barclay Woods Handbook FAQ list is browsed and individual questions — fees, disputed charges, maintenance requests, vendor access — are expanded to read their answers.'),
        },
        {
          label: 'Resident + AI',
          heading: 'Resident support',
          bullets: [
            'Signed-in residents can ask Mr. Barclay questions using community context.',
            'An unresolved question can escalate into a support ticket.',
            'The ticket enters management’s review queue rather than disappearing into a chat transcript.',
            'Management responses remain connected to the resident’s support history.',
          ],
          media: clip('barclay-06-ask-mr-barclay-chat', 'A resident opens Ask Mr. Barclay, sends a note, sees a checking a few details… state, and receives an AI-written reply signed Mr. Barclay.'),
          caption: {
            lead: 'Conversation can escalate into an accountable workflow',
            text: 'An unresolved question moves into management’s review queue instead of disappearing into a chat transcript.',
          },
        },
        {
          label: 'Management',
          heading: 'Management control',
          bullets: [
            'Management edits the FAQ content exposed to residents and the public.',
            'Management defines Mr. Barclay’s tone and guidance through an editable instruction field.',
            'The assistant can reference approved community knowledge.',
            'Protected permissions and workflow rules remain outside editable AI guidance.',
          ],
          media: clip('barclay-07-management-mr-barclay-config', 'In the Management FAQ area, Handbook entries are managed and the AI Goals & Knowledge panel is used to edit the assistant’s guidance text and reference the Knowledge Documents it draws on.'),
          comparison: [
            { label: 'Configurable', text: 'Tone · approved reference content · FAQ answers.' },
            { label: 'System controlled', text: 'Permissions · protected workflow rules · safety and authority boundaries.' },
          ],
        },
      ],
    },

    /* ---- 05 · IDENTITY FOLLOWS THE HOUSEHOLD ------------------ */
    {
      kind: 'sequence',
      id: 'household-identity',
      intro: 'Account + access system',
      heading: 'Accounts are generated around the property.',
      lead: 'The household is the durable system object. People can enter or leave while balances, history, permissions and operations remain attached to the household.',
      principle: 'Identity follows the household, not the individual.',
      cue: {
        steps: [
          { label: 'Property', tone: 'green' },
          { label: 'Household', tone: 'green' },
          { label: 'Invitation', tone: 'rust' },
          { label: 'Account', tone: 'plum' },
          { label: 'Membership', tone: 'plum' },
        ],
      },
      stepLayout: 'side',
      steps: [
        {
          eyebrow: 'Create the unit',
          title: 'Management establishes the unit.',
          body: [],
          bullets: [
            'Management creates the household/property record first.',
            'The unit exists independently of whoever currently lives there.',
            'Management issues registration access for a specific household and role.',
            'Redeeming that access links the account to the intended unit.',
          ],
          media: clip('barclay-12-management-hub-add-household', 'In the Operational Workspace Households tab, Add Household creates Unit 102, which then appears in the unit list as Vacant.'),
          caption: {
            lead: 'The unit comes first',
            text: 'A household exists in the model before a resident is linked to it.',
          },
        },
        {
          eyebrow: 'Add household members',
          title: 'Residents add members to the existing household.',
          body: [],
          bullets: [
            'An authorized resident can generate an invitation for another household member.',
            'The invitation carries the household association rather than asking the new user to select arbitrary access.',
            'Redeeming it creates membership under the existing household.',
            'Management retains system-level authority over household membership.',
          ],
          media: clip('barclay-03-resident-household-invite', 'A resident’s Profile & Settings page shows personal details and the Unit 101 household, then generates a one-time household invitation code and copies it.'),
          caption: {
            lead: 'Access is scoped before it is issued',
            text: 'Redeeming the invitation grants access to the household already encoded by that invitation.',
          },
        },
      ],
    },
    {
      kind: 'architecture-split',
      id: 'household-architecture',
      intro: '03 / System model',
      heading: 'Explore how the system objects relate.',
      lead: 'Hover over a relationship to trace its ownership across the model.',
      tree: householdTree,
      ownersHeading: 'One owner for each kind of information.',
      ownersRows: [
        { from: 'Authentication', to: 'User', id: 'user', tone: 'plum' },
        { from: 'Community membership', to: 'Account', tone: 'plum' },
        { from: 'Resident information', to: 'Resident Profile', id: 'resident-profile', tone: 'plum' },
        { from: 'Household structure', to: 'Household', id: 'household', tone: 'green' },
        { from: 'Household membership', to: 'Household Member', id: 'member', tone: 'plum' },
        { from: 'Historical activity', to: 'Activity', id: 'history', tone: 'slate' },
      ],
      ownersNote: 'Workflows reference authoritative objects instead of maintaining competing copies.',
      autoCycle: true,
    },

    /* ---- 06 · COMMUNITY CALENDAR ------------------------------ */
    {
      kind: 'media+text',
      id: 'community-calendar',
      side: 'left',
      heading: 'One calendar, multiple contribution paths.',
      body: [],
      bullets: [
        'Residents and management read from the same community calendar.',
        'Residents can submit events for management review.',
        'Resident submissions enter a review state before becoming shared community events.',
        'Management-created events can publish directly because the author already has approval authority.',
        'Approved operational and social events resolve onto the same timeline.',
      ],
      media: clip('barclay-16-resident-community-calendar', 'The resident Community Calendar: a month grid and Coming Up agenda, an event detail panel, the Journal list, a Submit an Event prompt and the My Submissions tab.'),
    },

    /* ---- 07 · COMMUNITY CHAT ----------------------------------- */
    {
      kind: 'media+text',
      id: 'community-chat',
      side: 'right',
      heading: 'Community conversation with moderation built in.',
      body: [],
      bullets: [
        'Residents can read announcements and participate through comments/replies.',
        'Management can publish official community announcements.',
        'Management can pin important posts so priority information remains visible.',
        'Residents can report inappropriate or problematic content.',
        'Reported content enters a management moderation workflow rather than disappearing from context.',
        'Management can review moderation history separately from the main conversation surface.',
      ],
      media: clip('barclay-08-management-post-announcement', 'In Community Chat management view a new announcement is composed for Post Announcement, alongside a Pinned & Featured row of existing announcements with Edit, Unpin and Remove controls.'),
      caption: {
        lead: 'Open, but moderated',
        text: 'Community communication remains open to residents while management retains explicit moderation authority.',
      },
    },

    /* ---- 08 · PAYMENTS / STRIPE LIVE-STATE CAPTURE ------------- */
    {
      kind: 'media+text',
      id: 'payments',
      side: 'right',
      heading: 'Payments remain attached to the household.',
      lead: 'The household ledger stays stable even when individual occupants change.',
      body: [],
      bullets: [
        'Charges belong to the household/unit rather than an individual occupant.',
        'Residents see current balance, due date and payment history in the same account context.',
        'Partial payments are supported.',
        'Checkout is handed off through the Stripe API rather than collecting card credentials inside Barclay Woods.',
        'The application records the resulting transaction state against the household ledger.',
      ],
      media: shot('barclay-payments', 'The resident household Account statement: a $5.00 current balance for Unit 101 Household, an Oct 15 2026 due date, paid-to-date, a Pay balance action, and a statement of open charges.'),
      mediaLabel: 'Live state capture · Stripe-connected checkout',
      caption: {
        lead: 'After a partial payment',
        text: 'The live screen shows the updated household balance after a user completed a partial payment through the Stripe-connected checkout flow.',
      },
      annotation: 'Stripe API → checkout → transaction result → household ledger',
    },

    /* ---- 09 · CLOSING INTERACTIVE MODEL ------------------------ */
    {
      kind: 'system-model',
      id: 'operating-system',
      heading: 'The operating system underneath the interface.',
      subheading: 'The same rules repeat everywhere in the system.',
      center: 'Barclay Woods',
      principles: [
        {
          id: 'authoritative-data',
          label: 'Authoritative data',
          tone: 'green',
          text: 'Each kind of information has a defined source of truth.',
          connections: ['household', 'ticket', 'payment'],
        },
        {
          id: 'role-aware-authority',
          label: 'Role-aware authority',
          tone: 'plum',
          text: 'Authentication establishes identity; authorization determines capability.',
          connections: ['resident', 'management', 'vendor'],
        },
        {
          id: 'shared-workflows',
          label: 'Shared workflows',
          tone: 'rust',
          text: 'Routing, registration, payments, support and activity operate across multiple product surfaces.',
          connections: ['ticket', 'payment', 'ai-support'],
        },
        {
          id: 'stable-history',
          label: 'Stable history',
          tone: 'slate',
          text: 'Current state can change without erasing how the system got there.',
          connections: ['household', 'ticket', 'payment'],
        },
      ],
      nodes: [
        {
          id: 'household',
          label: 'Household',
          text: 'The durable property object remains stable as occupants change.',
        },
        {
          id: 'ticket',
          label: 'Ticket',
          text: 'Routing, pricing, scheduling, approvals and history remain attached to one operational record.',
        },
        {
          id: 'resident',
          label: 'Resident',
          text: 'Identity determines which interface and actions are available.',
        },
        {
          id: 'management',
          label: 'Management',
          text: 'Management controls routing and protected operational decisions.',
        },
        {
          id: 'vendor',
          label: 'Vendor',
          text: 'Vendors receive only the scoped work required to act.',
        },
        {
          id: 'payment',
          label: 'Payment',
          text: 'Transactions update the household ledger without redefining ownership.',
        },
        {
          id: 'ai-support',
          label: 'AI Support',
          text: 'AI guidance can escalate into the accountable support workflow.',
        },
      ],
    },
  ],
};
