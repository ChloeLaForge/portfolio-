/* ============================================================
   CASE-STUDY CONTENT MODEL
   Each project page is an ordered list of section descriptors.
   Copy and media selection live here as data; layout logic lives
   in <CaseStudy /> components. This keeps the three page files
   short and lets each case study have its own sequence without
   duplicating block wiring or forcing a rigid shared template.
   ============================================================ */

import type { Media } from '../media';

/** How much room a piece of media takes.
 *  inset  — small, held inside the reading column (a supporting detail)
 *  normal — the content measure
 *  wide   — spills past the measure on large screens (a prominent beat)
 *  full   — breaks the page gutters (one per page at most) */
export type MediaScale = 'inset' | 'normal' | 'wide' | 'full';

/** Short bold lead-in + one line. Says what the evidence proves,
 *  not what is on screen. */
export interface CaptionCopy {
  lead: string;
  text: string;
}

/** A scannable point — plain text, or a bold lead-in word/phrase
 *  followed by one line, for lists meant to be read by their lead-ins
 *  first (skimmed) and their text second (read). */
export type Bullet = string | { lead: string; text: string };

/** A prose section: heading in the narrow left column, body right. */
export interface TextSection {
  kind: 'text';
  id: string;
  heading: string;
  /** A single prominent line above the body — the section's claim. */
  lead?: string;
  /** Paragraphs, in order. May be omitted when the section is lead + bullets. */
  body?: string[];
  /** Short scannable points under the body. */
  bullets?: Bullet[];
}

/** A compact consulting-style comparison: 2–4 labelled columns.
 *  Reads as "old way → new way", not a feature grid. */
export interface ComparisonSection {
  kind: 'comparison';
  id: string;
  heading: string;
  columns: {
    label: string;
    text: string;
    /** Small mono super-label above the column label (e.g. "Control"). */
    eyebrow?: string;
    /** Short mono tags under the text — for a concluding column. */
    tags?: string[];
  }[];
}

/** A short framing section for "why this project exists": a claim,
 *  one line of body copy, and 2–4 short labelled points. Sits between
 *  the opening hook and the detailed sections — deliberately quieter
 *  than either. */
export interface ContextSection {
  kind: 'context';
  id: string;
  heading: string;
  /** A single prominent line above the body — the section's claim. */
  lead?: string;
  body?: string[];
  points: { label: string; text: string }[];
  /** Compact metadata pulled out of the page hero (Focus / Context). */
  meta?: { label: string; value: string }[];
}

/** A single prominent statement — the philosophy or the takeaway.
 *  With a heading it sits in the two-column armature; without one it
 *  stands alone. `closing` makes it the page's final word. */
export interface StatementSection {
  kind: 'statement';
  id: string;
  heading?: string;
  text: string;
  bullets?: Bullet[];
  closing?: boolean;
}

/** The "solution at a glance" exhibit: a small grid of cropped product
 *  screens, each with a one-line label. Establishes breadth before the
 *  argument starts. Static images only — no autoplaying video here.
 *  `layout: 'compass'` swaps the grid for a four-point composition
 *  around a centered heading/lead — `items` must have exactly four
 *  entries, read in order as [top, left, right, bottom]. */
export interface FeatureOverviewSection {
  kind: 'feature-overview';
  id: string;
  heading: string;
  lead?: string;
  layout?: 'grid' | 'compass';
  items: { media: Media; name: string; descriptor: string }[];
}

/** A small consulting-style diagram. One component, four shapes:
 *  - layers: stacked bands (data ↓ engines ↓ interface), each a chip row
 *  - flow:   ordered nodes joined by arrows; `numbered` for lifecycle steps
 *  - map:    "source → owner" rows (the single-source-of-truth exhibit)
 *  - tree:   one root with indented children (household → members)
 *  `note` is the one-line takeaway that sits under the figure. */
export interface DiagramSection {
  kind: 'diagram';
  id: string;
  heading?: string;
  /** Mono label above the heading. */
  intro?: string;
  variant: 'layers' | 'flow' | 'map' | 'tree';
  /** layers */
  bands?: { label: string; items: string[] }[];
  /** flow */
  nodes?: { label: string; sub?: string }[];
  numbered?: boolean;
  /** map */
  rows?: { from: string; to: string }[];
  /** tree */
  root?: string;
  children?: string[];
  /** One-line takeaway under the diagram. */
  note?: string;
}

/** An executive-summary slide: 6-ish short rules, auto-numbered. */
export interface PrinciplesSection {
  kind: 'principles';
  id: string;
  heading: string;
  items: string[];
}

/** A figure standing on its own, caption beneath. */
export interface MediaSection {
  kind: 'media';
  id: string;
  media: Media;
  scale?: MediaScale;
  /** Overrides the ratio on the media object. */
  aspect?: string;
  fit?: 'cover' | 'contain';
  caption?: CaptionCopy;
}

/** A compact inline comparison condensed from a fuller standalone
 *  comparison into a few short rows plus a concluding opportunity
 *  line — for folding "the problem" framing directly into the
 *  opening hook instead of giving it its own section. */
export interface MediaTextCompare {
  rows: { eyebrow?: string; label: string; text: string }[];
  opportunity: { label: string; text: string; tags?: string[] };
}

/** Media and explanation side by side; stacks on mobile. */
export interface MediaTextSection {
  kind: 'media+text';
  id: string;
  media: Media;
  side?: 'left' | 'right';
  aspect?: string;
  fit?: 'cover' | 'contain';
  /** Mono eyebrow label under the heading. */
  intro?: string;
  heading?: string;
  /** A single prominent line above the body. */
  lead?: string;
  body: string[];
  /** Short scannable points under the body. */
  bullets?: Bullet[];
  /** One short closing line under the bullets — a compact takeaway,
   *  quieter than `lead`, for sections that favor bullets over prose. */
  takeaway?: string;
  /** A compact numbered interaction loop beside the media — for a
   *  process too short to warrant the full <SequenceSection> spine. */
  steps?: { title: string; body: string }[];
  /** A condensed comparison framework sitting under the body — for
   *  the opening hook, which folds "the problem" in rather than
   *  giving it its own standalone section. */
  compare?: MediaTextCompare;
  /** Widens the media column beyond the default text/media ratio,
   *  for the one section where the figure should dominate. */
  emphasis?: 'media';
  caption?: CaptionCopy;
  /** A small mono label directly above the media frame — for framing a
   *  static screenshot as a deliberate captured system state rather
   *  than styling it like a paused video. */
  mediaLabel?: string;
  /** A short mono flow-line under the caption (e.g. "A → B → C"). */
  annotation?: string;
  /** A small outbound link at the foot of the text column. */
  link?: { label: string; href: string };
}

/** A small figure with its own eyebrow/heading/lead above it and a
 *  short heading/text below — a self-contained "example" card, sized
 *  and framed independently of the section's own heading. */
export interface DualMediaLeftFigure {
  /** Mono eyebrow above the figure. */
  intro?: string;
  /** Small heading above the figure. */
  heading?: string;
  /** One short line above the figure. */
  lead?: string;
  /** Optional — when omitted, this is a text-only sub-block (the
   *  figure lives in the right-hand media column instead). */
  media?: Media;
  /** Overrides the ratio on the media object — use the source's own
   *  aspect here rather than forcing a shared thumbnail ratio. */
  aspect?: string;
  /** Small heading below the figure. */
  belowHeading?: string;
  /** One short line below the figure. */
  belowText?: string;
  /** Shows a plain directional arrow under the figure, pointing at
   *  the right-hand media — no label, the sequence speaks for itself. */
  arrow?: boolean;
}

/** A small "example" figure in the left column, vertically centred
 *  against a stack of larger proof clips in the right column. Built
 *  for "here's the output, here's how you get it" — a shape none of
 *  the other section kinds cover cleanly. */
export interface DualMediaSection {
  kind: 'dual-media';
  id: string;
  /** Mono eyebrow label under the heading. */
  intro?: string;
  heading: string;
  /** A single prominent line above the body. */
  lead?: string;
  body?: string[];
  /** Short scannable points under the body — sits above the two-column grid. */
  bullets?: Bullet[];
  /** The smaller left-column figure. */
  left: DualMediaLeftFigure;
  /** The right column: larger media stacked vertically, each with its own caption. */
  items: { media: Media; caption?: CaptionCopy }[];
}

export interface SequenceStep {
  /** Small mono label above the title (e.g. "Workflow rules") — the
   *  step's own index is drawn separately, so this is the tail only. */
  eyebrow?: string;
  title: string;
  body: string[];
  /** Short scannable points under the step body. */
  bullets?: Bullet[];
  media?: Media;
  mediaScale?: MediaScale;
  aspect?: string;
  fit?: 'cover' | 'contain';
  caption?: CaptionCopy;
}

/** One chip in a section's small persistent-workflow cue strip. */
export interface SequenceCueStep {
  label: string;
  /** Restrained product-color family — 'neutral' (default) draws a
   *  plain outline; the others tint the chip subtly. */
  tone?: 'neutral' | 'green' | 'rust' | 'plum' | 'brown' | 'slate';
}

/** A compact single-line chip chain — reinforces the section's
 *  through-line without adding a real diagram or meaningful height. */
export interface SequenceCue {
  steps: SequenceCueStep[];
}

/** A genuine ordered progression — numbered, connected by a spine,
 *  each step optionally carrying its own evidence. An optional
 *  section-level figure sits above the steps. */
export interface SequenceSection {
  kind: 'sequence';
  id: string;
  heading: string;
  intro?: string;
  /** A single prominent line above the steps — the section's claim. */
  lead?: string;
  /** A smaller, quieter secondary principle under the lead — e.g. a
   *  prior heading kept on as a supporting line rather than dropped. */
  principle?: string;
  /** Paragraph(s) under the lead, opposite the heading — a short
   *  explanatory subhead, not a full text section. */
  body?: string[];
  /** Short scannable points under the body, above the steps — for a
   *  condensed section-level intro that doesn't warrant its own
   *  standalone statement section. */
  bullets?: Bullet[];
  /** A small persistent chip-chain reinforcing the section's
   *  through-line, shown above the steps. */
  cue?: SequenceCue;
  /** One figure introducing the whole sequence. */
  media?: Media;
  mediaScale?: MediaScale;
  aspect?: string;
  fit?: 'cover' | 'contain';
  caption?: CaptionCopy;
  /** 'side' lays each step out as text (left) + media (right) on
   *  desktop, media aligned to the top of its text rather than
   *  trailing it. Omitted/default keeps the original stacked step. */
  stepLayout?: 'side';
  steps: SequenceStep[];
}

/** One chip in an operating-state strip's node ring. */
export interface OperatingStateNode {
  label: string;
  tone: 'green' | 'rust' | 'plum' | 'brown';
}

/** The consulting-case tab's small compact visual: a node ring
 *  (optionally routed through a center chip) or a vertical knowledge
 *  flow with a protected-boundary line — whichever a given tab needs.
 *  Deliberately not a full diagram: a handful of chips and hairlines. */
export interface OperatingState {
  /** An optional center chip, e.g. "Manager" or "Shared operating system". */
  center?: string;
  /** The surrounding node ring — omitted when `flow` is used instead. */
  nodes?: OperatingStateNode[];
  /** 'scattered': dashed, disconnected (the problem state). 'routed':
   *  solid lines through a plain center (manual/centralized). 'orderly':
   *  solid lines through an emphasized center (the operating system). */
  connection?: 'scattered' | 'routed' | 'orderly';
  /** A vertical flow chain (the AI tab) — replaces the node ring. */
  flow?: string[];
  /** A small two-label divider under the flow — guidance vs. authority. */
  boundary?: { left: string; right: string };
}

/** One tab's content. The 'nodes' variant (a compact consulting chain)
 *  uses label/heading/text only; the 'panel' variant (media + bullets)
 *  uses heading/bullets/media, and may embed a small two-column
 *  configurable/system-controlled style comparison. */
export interface TabPanel {
  /** The tab button's own text. */
  label: string;
  heading?: string;
  /** A single supporting line — the 'nodes' variant's secondary sentence,
   *  or the 'tree' variant's copy paragraph. */
  text?: string;
  bullets?: Bullet[];
  media?: Media;
  aspect?: string;
  fit?: 'cover' | 'contain';
  caption?: CaptionCopy;
  /** A compact embedded comparison (e.g. Configurable vs. System controlled). */
  comparison?: { label: string; text: string }[];
  /** The 'tree' variant's small illustrative hierarchy — used when
   *  `mockup` is not set. */
  tree?: ArchTreeNode;
  /** The 'tree' variant's short line under the tree/mockup. */
  supportLine?: string;
  /** The 'tree' variant's small conceptual application mockup — takes
   *  over from `tree` when set. One of a fixed, hand-built set (no
   *  image generation, no new dependency). */
  mockup?: 'apps' | 'consulting' | 'study';
  /** The 'nodes' variant's compact visual — a small system state that
   *  changes with the selected tab, sitting above the claim/support text. */
  operatingState?: OperatingState;
}

/** A short interactive tab group. 'nodes' reads as a restrained
 *  consulting/systems chain of claims (no media, one at a time);
 *  'panel' reads as a labelled tab strip over a media+bullets panel;
 *  'tree' reads as a claim beside a small illustrative hierarchy. */
export interface TabsSection {
  kind: 'tabs';
  id: string;
  heading?: string;
  /** Mono eyebrow label above the heading (or the tab row, if no heading). */
  intro?: string;
  lead?: string;
  /** Paragraph(s) between the lead and the tab row. */
  body?: string[];
  /** A small understated instructional line directly above the tab
   *  row — e.g. "Select an access level." Never a tutorial callout. */
  tabsHint?: string;
  /** A short accent-colored interaction cue beside `tabsHint` — e.g.
   *  "Click to explore." Louder than the hint, still one short line. */
  tabsCue?: string;
  variant: 'nodes' | 'panel' | 'tree';
  tabs: TabPanel[];
  /** Which tab is active before the user interacts. Defaults to 0. */
  defaultIndex?: number;
  /** When true, the tabs quietly auto-advance on their own until the
   *  visitor interacts, with a small "Auto preview" toggle to control
   *  it. Only meaningful where every tab's content is safe to show
   *  without a click (the 'tree' variant's mockups). */
  autoAdvance?: boolean;
  /** Shows a small arrow above each tab button until the visitor has
   *  interacted with this tab group — an explicit "these are
   *  clickable" cue that fades away after the first click. */
  showTabArrows?: boolean;
  /** Adds a small AUTO / MANUAL toggle beside the tab row. In AUTO the
   *  tabs step through themselves slowly (only while on screen and not
   *  hovered); choosing a tab, or MANUAL, stops the cycle. Also lays the
   *  'panel' variant out so its media rises to the top of the tab row. */
  autoCycle?: boolean;
  /** 'panel' variant only. Lays the section out as two columns — heading,
   *  copy, cue, tabs and the active tab's text on the left, the active
   *  tab's media beside them on the right — and adds a small "Auto
   *  preview" toggle. With it on, each tab's clip plays once and the
   *  next tab activates on the video's own `ended` event (wrapping back
   *  to the first); choosing a tab, or switching it off, hands control
   *  back to the visitor and clips loop as usual. */
  videoSequence?: boolean;
  /** A small understated line under the section — never a badge or heading. */
  footnote?: string;
  /** A closing eyebrow + paragraph(s) under the tab panel — for a final
   *  standing note that follows the interactive model. */
  closing?: { label?: string; body: string[] };
}

/** A node in the household/object model tree — recursive, so the
 *  same shape draws any depth without new component code. */
export interface ArchTreeNode {
  label: string;
  children?: ArchTreeNode[];
  /** Stable id — required where a tree is clickable (context-model,
   *  or an architecture-split branch that links to an owners row);
   *  unused, and safe to omit, on a static illustrative tree. */
  id?: string;
  /** Restrained semantic color family for this branch. Set once on
   *  the branch's own top node — descendants inherit it via CSS custom
   *  property cascade, so children don't need to repeat it. */
  tone?: 'green' | 'rust' | 'plum' | 'brown' | 'slate';
}

/** The closing "how the model fits together" exhibit: an expanded
 *  object tree beside the authoritative-owner map, read as one
 *  architecture explanation on desktop. A tree node and an owners row
 *  that share an `id` are linked — hovering/focusing either subtly
 *  emphasizes the other. */
export interface ArchitectureSplitSection {
  kind: 'architecture-split';
  id: string;
  /** Mono eyebrow label, e.g. "03 / System model". */
  intro?: string;
  /** A larger, distinct title above the two-column exhibit — marks
   *  this as an interactive relationship explorer rather than a
   *  static diagram. Sits below `intro`. */
  heading?: string;
  /** A supporting line under `heading` — the section-level
   *  interaction instruction (e.g. "Hover over a relationship..."). */
  lead?: string;
  tree: ArchTreeNode;
  treeNote?: string;
  ownersHeading: string;
  /** A small understated instructional line near the owners list —
   *  e.g. "Hover over a row to trace ownership." */
  hint?: string;
  ownersRows: {
    from: string;
    to: string;
    /** Matches an `ArchTreeNode.id` — enables the hover/focus link. */
    id?: string;
    /** Small color marker beside the row, matching its tree branch. */
    tone?: 'green' | 'rust' | 'plum' | 'brown' | 'slate';
  }[];
  ownersNote?: string;
  /** Adds a small AUTO / MANUAL toggle beside `lead`. In AUTO the linked
   *  relationships (rows with an `id`) are highlighted one after another
   *  through the same hover state; hovering pauses the loop. */
  autoCycle?: boolean;
}

/** One of the four principles around the closing interactive model. */
export interface SystemModelPrinciple {
  id: string;
  label: string;
  text: string;
  /** Restrained semantic color family for this principle. */
  tone: 'green' | 'rust' | 'plum' | 'brown' | 'slate';
  /** ids into the section's `nodes`, highlighted while this principle
   *  is hovered or focused (and vice versa). */
  connections: string[];
}

/** The page's closing exhibit: a two-direction interactive system
 *  explorer — a central system node, four surrounding principles, and
 *  a ring of secondary object labels. Either level can be hovered or
 *  focused; a principle highlights its related objects and shows its
 *  own explanation, an object highlights its related principle(s) and
 *  shows its own short contextual line. */
export interface SystemModelSection {
  kind: 'system-model';
  id: string;
  heading: string;
  subheading?: string;
  center: string;
  /** Exactly four. */
  principles: SystemModelPrinciple[];
  nodes: { id: string; label: string; text: string }[];
}

/** One row of context associated with a selected tree node. `kind`
 *  drives both the bucket chip's colour and which "AI receives" list
 *  it falls into (everything but 'excluded' is included). */
export interface ContextChip {
  kind: 'selected' | 'parent' | 'branch' | 'excluded';
  /** Small label above the value, e.g. "Parent context". */
  label: string;
  text: string;
}

/** The "behind the interface" exhibit: a small clickable example
 *  hierarchy beside the context bucket it makes relevant, and an
 *  "AI receives" panel. Demonstrates that the visual tree is backed
 *  by a structured context map the application can scope AI access
 *  to, rather than resending the whole system on every turn. Tree,
 *  bucket and AI panel share one colour legend (by `ContextChip.kind`)
 *  so the connection reads without the paragraph underneath. */
export interface ContextModelSection {
  kind: 'context-model';
  id: string;
  /** Mono eyebrow label, e.g. "Behind the system / Backend". */
  intro?: string;
  heading: string;
  body?: string[];
  /** A small understated instructional line directly above the demo —
   *  e.g. "Select a node to trace its context." */
  hint?: string;
  /** The small clickable example hierarchy. Every node needs an `id`. */
  tree: ArchTreeNode;
  /** Selected node id before the user interacts. */
  defaultNodeId: string;
  /** Node id → the context bucket shown when it's selected — also
   *  the source for the "AI receives" panel's included/excluded split. */
  chips: Record<string, ContextChip[]>;
  /** When set, the demo quietly cycles through these node ids on its
   *  own — so the mechanism reads without requiring a click first.
   *  Pauses on hover/manual interaction and resumes after a pause. */
  autoCycle?: string[];
  /** Short label above the "context is retrieved, not repeated" note. */
  noteLabel: string;
  noteBody?: string[];
  /** The three stages of the compact left → right process diagram under
   *  the note: a title, a one-line headline, a terse detail line, and the
   *  short cue that labels this stage on the rail beneath. */
  outcomes: { label: string; headline: string; detail: string; cue: string }[];
  /** The transition sentence into the next section. */
  closing: string;
}

export type CaseStudySection =
  | TextSection
  | ComparisonSection
  | ContextSection
  | StatementSection
  | FeatureOverviewSection
  | DiagramSection
  | PrinciplesSection
  | MediaSection
  | MediaTextSection
  | DualMediaSection
  | SequenceSection
  | TabsSection
  | ArchitectureSplitSection
  | SystemModelSection
  | ContextModelSection;

export interface CaseStudy {
  /** Lead paragraphs under the hero, before the first section rule. */
  intro: string[];
  /** Short scannable points under the intro — the hero's key claims. */
  keyPoints?: string[];
  sections: CaseStudySection[];
}
