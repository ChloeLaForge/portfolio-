/* ============================================================
   NOTEBOOK — case-study narrative
   One continuous argument: the hook (live build, first) → why build
   this at all (compact) → how the user seeds the system → the AI/
   human loop → proposed vs. accepted → reuse (tree becomes table) →
   behind the system (the tree is also a context map) → visual
   organisation → context mode → system at a glance → next (the tree
   as one interface for a larger system).
   Media is proof inside the argument, not a gallery. Every clip is
   cropped to the Notebook canvas — no browser chrome, no black
   surround. Clip contents follow
   public/portfolio/notebook/videos/README.md.
   ============================================================ */

import type { Media } from '../media';
import type { CaseStudy } from './types';

const V = '/portfolio/notebook/videos';
const IMG = '/portfolio/notebook/images';
const ASPECT = '1476 / 840'; // app-cropped capture — no chrome, no black borders
const SHOT_ASPECT = '3 / 2'; // overview thumbnails — Safari chrome cropped off (tools/cropshot.swift)

/** `file` names the source `.mov` recording. Delivery is the
 *  browser-safe encode cropped to the application canvas:
 *  `<base>-crop.mp4` (H.264, audio stripped, 1476×840) plus a
 *  `<base>-crop-poster.jpg` still for the reduced-motion path. The
 *  untouched `.mov` originals and the earlier full-frame `.mp4`
 *  encodes stay in this folder. rate 2 is the demo default. */
const clip = (file: string, alt: string, rate = 2): Media => {
  const base = file.replace(/\.mov$/, '');
  return {
    kind: 'video',
    src: `${V}/${base}-crop.mp4`,
    poster: `${V}/${base}-crop-poster.jpg`,
    alt,
    aspect: ASPECT,
    rate,
  };
};

/** A cropped Notebook product screenshot under IMG. Same treatment as the
 *  clips: the Safari toolbar band is removed (tools/cropshot.swift), no black
 *  surround. Static evidence — used in the at-a-glance overview only; the
 *  videos still carry every behavioural claim. */
const shot = (name: string, alt: string): Media => ({
  kind: 'image',
  src: `${IMG}/${name}.png`,
  alt,
  aspect: SHOT_ASPECT,
});

export const notebook: CaseStudy = {
  intro: [],
  sections: [
    {
      kind: 'media+text',
      id: 'hook',
      side: 'right',
      emphasis: 'media',
      intro: 'A live build, not a chatbot',
      heading: 'AI appears where the decision is happening.',
      body: [
        'AI is not a separate chat panel. It participates in the same visual reasoning surface the user is building.',
      ],
      compare: {
        rows: [
          { eyebrow: '01', label: 'Manual', text: 'Control without speed.' },
          { eyebrow: '02', label: 'Pure chat', text: 'Speed without structure.' },
          { eyebrow: '03', label: 'AI Notebook', text: 'Speed + control.' },
        ],
        opportunity: {
          label: 'The opportunity',
          text: 'Accelerate construction without outsourcing the reasoning.',
          tags: ['Visible', 'Inspectable', 'User-controlled'],
        },
      },
      media: clip(
        'notebook-09-multi-tree-proposal-expansion.mov',
        'A proposed set of ghosted trees on one Page is accepted into real trees, then a follow-up proposal expands a single branch into finer detail.',
      ),
      caption: {
        lead: 'One gate for breadth and depth',
        text: 'A proposed set of trees previews new structure on the page; accepting it grows the system, and the same Accept / Deny / Other gate handles a deeper follow-up proposal.',
      },
    },
    {
      kind: 'tabs',
      id: 'setup',
      intro: 'Starting the system',
      heading: 'The user gives the system its first context.',
      body: [
        "AI Notebook begins with the user's own description of the problem. AI helps structure that starting context, but the user defines what the system is actually about.",
      ],
      tabsHint: 'Select a stage',
      tabsCue: 'Click to trace the build',
      variant: 'panel',
      videoSequence: true,
      tabs: [
        {
          label: 'Define',
          heading: "Start with the user's words.",
          text: 'The user describes the problem first. AI can help expand the initial context, but it begins from information the user explicitly provides.',
          media: clip(
            'notebook-01-intake-and-questions.mov',
            'A one-line "What do you want to build?" description is typed, Notebook responds by asking a short structured set of intake questions, then "Build my notebook" kicks off the system.',
          ),
        },
        {
          label: 'Structure',
          heading: 'Turn context into a working structure.',
          text: 'The summary becomes the map for the workspace. Its major parts can become their own pages and trees, giving the system a structured place to continue.',
          media: clip(
            'notebook-02-summary-page-approval.mov',
            'The Summary page organizes the idea into proposed Page directions with Accept / Reject; accepting one creates its Page and adds it to the Pages list.',
          ),
        },
      ],
    },
    {
      kind: 'media+text',
      id: 'loop',
      side: 'right',
      emphasis: 'media',
      intro: 'How the loop works',
      heading: 'Five steps keep AI attached to the structure, with every change visible to the user.',
      body: [],
      steps: [
        { title: 'Locate', body: 'The system identifies the relevant branch and brings that context into focus.' },
        { title: 'Ask', body: 'AI asks a short, specific question beside the structure it concerns.' },
        { title: 'Propose', body: 'New structure appears as a preview, not yet part of the accepted system.' },
        { title: 'Decide', body: 'The user accepts, denies, or redirects the proposed change.' },
        { title: 'Continue', body: 'Accepted structure joins the model; AI moves to the next relevant context.' },
      ],
      media: clip(
        'notebook-03-contextual-question-proposal.mov',
        'A build-assistant question is docked beside a highlighted node; the user answers, a proposed set of options appears marked not yet part of the page, and accepting it grows the tree.',
      ),
    },
    {
      kind: 'dual-media',
      id: 'tables',
      intro: 'Reuse',
      heading: 'Visual reasoning becomes reusable structure.',
      lead: 'The tree is not the destination.',
      body: [
        'The tree is the working interface, not the destination. Because accepted reasoning persists as structured data, the same hierarchy can be reorganised for different downstream uses.',
      ],
      bullets: [
        { lead: 'Presentation', text: 'Reorder accepted ideas into a clearer narrative without rebuilding the reasoning.' },
        { lead: 'Structured data', text: 'Translate visual relationships into fields, records, and other data-oriented formats.' },
        { lead: 'Tables', text: 'Re-express accepted branches as rows while preserving where the information came from.' },
      ],
      left: {
        intro: 'From objective to output',
        heading: 'A proposed package, mid-decision',
        lead: 'Choosing an objective produces a structured package like this one, reviewable before it becomes part of the accepted output.',
        media: {
          ...shot(
            'notebook-tables-example',
            'The Notebook Tables view for Booking Ticket Queue: a proposed Comprehensive Support Structure package with its first table, Booking Process Overview, showing Step and Description columns plus a Purpose column of bullets.',
          ),
          aspect: '1522 / 522',
        },
        arrow: true,
      },
      items: [
        {
          media: clip(
            'notebook-07-tables-choose-objective.mov',
            'The Tables view recommends several ways to organise the accepted structure; picking an objective starts that table building.',
          ),
          caption: {
            lead: 'The user names the objective.',
            text: 'Nothing is generated until the user chooses how the accepted structure should be reorganised.',
          },
        },
        {
          media: clip(
            'notebook-08-table-package-generation.mov',
            'A proposed multi-table package renders with a PURPOSE column and per-table provenance back to specific trees, then Accept package moves it to accepted.',
          ),
          caption: {
            lead: 'The structure changes form, not meaning.',
            text: 'Accepted reasoning is reorganised into the selected output while remaining traceable to the source tree.',
          },
        },
      ],
    },
    {
      kind: 'context-model',
      id: 'context',
      intro: 'Live context demo',
      heading: 'The tree is also a context system.',
      body: [
        'What looks like a visual hierarchy is also a map of context. Behind the interface, each node keeps its place in the hierarchy and the context attached to it, letting the application retrieve what AI needs for the current decision instead of repeatedly sending the entire system.',
      ],
      hint: 'Select a node to trace its context.',
      tree: {
        id: 'parent',
        label: 'Parent',
        children: [
          {
            id: 'child-1',
            label: 'Child 1',
            children: [
              { id: 'gc-1-1', label: 'Grandchild 1.1' },
              { id: 'gc-1-2', label: 'Grandchild 1.2' },
            ],
          },
          {
            id: 'child-2',
            label: 'Child 2',
            children: [
              { id: 'gc-2-1', label: 'Grandchild 2.1' },
              { id: 'gc-2-2', label: 'Grandchild 2.2' },
            ],
          },
        ],
      },
      defaultNodeId: 'child-1',
      autoCycle: ['child-1', 'gc-1-2', 'child-2', 'gc-2-1', 'parent'],
      chips: {
        parent: [
          { kind: 'selected', label: 'Selected node', text: 'Parent' },
          { kind: 'branch', label: 'Branch context', text: 'Every branch identity' },
          { kind: 'excluded', label: 'Out of scope', text: 'Grandchild-level detail' },
        ],
        'child-1': [
          { kind: 'selected', label: 'Selected node', text: 'Child 1' },
          { kind: 'parent', label: 'Parent context', text: 'Parent / page summary' },
          { kind: 'branch', label: 'Branch context', text: 'Child 1 descendants' },
          { kind: 'excluded', label: 'Out of scope', text: 'Child 2 branch' },
        ],
        'child-2': [
          { kind: 'selected', label: 'Selected node', text: 'Child 2' },
          { kind: 'parent', label: 'Parent context', text: 'Parent / page summary' },
          { kind: 'branch', label: 'Branch context', text: 'Child 2 descendants' },
          { kind: 'excluded', label: 'Out of scope', text: 'Child 1 branch' },
        ],
        'gc-1-1': [
          { kind: 'selected', label: 'Selected node', text: 'Grandchild 1.1' },
          { kind: 'parent', label: 'Parent context', text: 'Child 1 / page summary' },
          { kind: 'branch', label: 'Branch context', text: 'Grandchild 1.1 content' },
          { kind: 'excluded', label: 'Out of scope', text: 'Child 2 branch' },
        ],
        'gc-1-2': [
          { kind: 'selected', label: 'Selected node', text: 'Grandchild 1.2' },
          { kind: 'parent', label: 'Parent context', text: 'Child 1 / page summary' },
          { kind: 'branch', label: 'Branch context', text: 'Grandchild 1.2 content' },
          { kind: 'excluded', label: 'Out of scope', text: 'Child 2 branch' },
        ],
        'gc-2-1': [
          { kind: 'selected', label: 'Selected node', text: 'Grandchild 2.1' },
          { kind: 'parent', label: 'Parent context', text: 'Child 2 / page summary' },
          { kind: 'branch', label: 'Branch context', text: 'Grandchild 2.1 content' },
          { kind: 'excluded', label: 'Out of scope', text: 'Child 1 branch' },
        ],
        'gc-2-2': [
          { kind: 'selected', label: 'Selected node', text: 'Grandchild 2.2' },
          { kind: 'parent', label: 'Parent context', text: 'Child 2 / page summary' },
          { kind: 'branch', label: 'Branch context', text: 'Grandchild 2.2 content' },
          { kind: 'excluded', label: 'Out of scope', text: 'Child 1 branch' },
        ],
      },
      noteLabel: 'Context is retrieved, not repeated.',
      noteBody: [
        "This is what the demo above is actually doing: the tree isn't decoration over a transcript. It's an interface over structured backend state.",
      ],
      outcomes: [
        {
          label: 'Tree as structured state',
          headline: 'Visible hierarchy is stored structure.',
          detail: 'Node + parent + position + context',
          cue: 'Visible tree',
        },
        {
          label: 'Context retrieval',
          headline: 'Select a node.',
          detail: 'Retrieve its branch + parent + page context',
          cue: 'Relevant context',
        },
        {
          label: 'Model input',
          headline: 'Assemble only that slice for the AI.',
          detail: 'Preserve continuity. Exclude unrelated branches.',
          cue: 'AI input',
        },
      ],
      closing: 'The same backend structure also makes the reasoning easier to display, inspect, and reuse.',
    },
    {
      kind: 'media+text',
      id: 'system',
      side: 'left',
      intro: 'Visual organisation',
      heading: 'One structure, multiple ways to see it.',
      body: [
        'Because the hierarchy is stored as structured data rather than flattened into a transcript, the interface can change how that same reasoning is displayed without changing the reasoning itself.',
      ],
      bullets: [
        {
          lead: 'Change the view',
          text: 'Users can switch between visual organization modes to make different relationships easier to scan.',
        },
        {
          lead: 'See the hierarchy',
          text: 'Parent, child, and branch relationships remain explicit, making a large system easier to understand than a flat block of text.',
        },
        {
          lead: 'Preserve the structure',
          text: 'Changing how the tree is displayed does not require rebuilding the underlying information.',
        },
      ],
      media: clip(
        'notebook-06-geometry-inspector.mov',
        'Toggling the Geometry panel renders dashed node, subtree and tree bounding boxes and connector-anchor dots over a tree.',
      ),
      caption: {
        lead: 'A deterministic geometry engine owns placement.',
        text: 'Node, subtree, and tree bounds give the interface a stable map of the system. The application can use the same underlying hierarchy while presenting it in different visual arrangements.',
      },
    },
    {
      kind: 'media+text',
      id: 'context-mode',
      side: 'right',
      emphasis: 'media',
      intro: 'Context mode',
      heading: 'Turn the hidden context back on.',
      body: [
        'The same context used behind the tree can also be surfaced to the user. Turn on Context Mode, then move through the finished structure to see what each part represents, why it exists, and the context attached to it.',
      ],
      bullets: [
        { lead: 'Activate', text: 'Turn on Context Mode when the visual structure alone is no longer enough.' },
        { lead: 'Hover', text: 'Move over a node or branch to surface the stored context attached to that exact part of the tree.' },
        {
          lead: 'Reveal',
          text: 'Purpose, significance, and supporting reasoning appear in place, without permanently crowding the visual map.',
        },
      ],
      media: clip(
        'notebook-04-build-from-here-purpose-previews.mov',
        'With purpose previews switched on, hovering a node opens a "Why this is here" popover explaining its rationale; a Build-from-here dock lets the user continue the build from that point.',
      ),
      caption: {
        lead: 'Context appears where it belongs.',
        text: 'The tree stays visually clean until the user asks for more. Hovering reveals the information stored behind that specific part of the structure.',
      },
    },
    {
      kind: 'feature-overview',
      id: 'overview',
      heading: 'The system at a glance',
      lead: 'From structuring the problem to turning accepted reasoning into reusable output.',
      items: [
        {
          media: shot(
            'notebook-system-view',
            'A Notebook page zoomed out: four independent decision trees stacked down one canvas, a Build from here prompt, and the Geometry inspector panel open.',
          ),
          name: 'System view',
          descriptor: 'One control zooms out to show every tree at once.',
        },
        {
          media: shot(
            'notebook-live-build',
            'The build assistant has drafted a first detail under a Polls node; an inline field invites the user to adjust or expand it before it joins the page.',
          ),
          name: 'Live build',
          descriptor: 'AI drafts beside the branch it concerns, ready to adjust or expand.',
        },
        {
          media: shot(
            'notebook-contextual-ai',
            'A Yes / No / Other question docked beside the Surveys and Polls nodes, which are highlighted, under the header About Surveys and 5 related items.',
          ),
          name: 'Contextual AI',
          descriptor: 'A short decision appears at the exact tree context it concerns.',
        },
        {
          media: shot(
            'notebook-focus',
            'On the User Engagement page the view has moved to the Incentives for Participation subtree, which is lit, with a proposal docked to its right.',
          ),
          name: 'Focus',
          descriptor: 'The workspace moves and frames the region under discussion.',
        },
        {
          media: shot(
            'notebook-proposal',
            'Muted, translucent child nodes previewed under an accepted Volunteer Opportunities node, with an Accept / Deny / Other control on the proposal.',
          ),
          name: 'Proposal',
          descriptor: 'Suggested structure previews outside the page until it is accepted.',
        },
        {
          media: shot(
            'notebook-decision',
            'A build-assistant proposal to add specified volunteer-opportunity types, waiting on an explicit Accept, Deny or Other decision from the user.',
          ),
          name: 'Human in the loop',
          descriptor: 'Every AI addition waits on accept, deny, or redirect.',
        },
      ],
    },
    {
      kind: 'tabs',
      id: 'next',
      intro: 'Future builds',
      heading: 'The tree is the blueprint.',
      lead: 'One reasoning architecture. Different products.',
      body: [
        'AI Notebook began as a visual decision-tree interface, but the reusable system is the structured context underneath it. The same architecture can support different applications without rebuilding the reasoning model each time.',
      ],
      tabsHint: 'Select a use case',
      tabsCue: 'Click to explore',
      autoAdvance: true,
      variant: 'tree',
      tabs: [
        {
          label: 'Building applications',
          heading: 'Building applications',
          text: 'The tree organizes requirements and preserves the reasoning that connects product decisions to APIs, data, interfaces, and implementation.',
          supportLine: 'Tree: product requirements → system decisions → implementation',
          bullets: [
            'Turn product requirements into connected implementation decisions.',
            'Trace each API, data, or interface choice back to the requirement that created it.',
            'Preserve context as a product moves from planning into implementation.',
          ],
          mockup: 'apps',
        },
        {
          label: 'Consulting / system mapping',
          heading: 'Mapping complex systems',
          text: 'The tree becomes a structured problem map, organizing a broad problem into its drivers, the evidence behind them, and the recommendations that follow.',
          supportLine: 'Tree: problem → drivers → evidence → recommendations',
          bullets: [
            'Break a broad problem into connected drivers and subproblems.',
            'Attach evidence and assumptions to the branch they support.',
            'Trace recommendations back through the reasoning that produced them.',
          ],
          mockup: 'consulting',
        },
        {
          label: 'Studying',
          heading: 'Studying',
          text: 'The tree becomes a structured knowledge map, organizing a topic into its concepts and the relationships that connect them.',
          supportLine: 'Tree: topic → concepts → relationships → understanding',
          bullets: [
            'Break complex topics into connected concepts and dependencies.',
            'Make relationships between ideas visible instead of storing isolated notes.',
            'Trace gaps in understanding back to the concepts that support them.',
          ],
          mockup: 'study',
        },
      ],
      closing: {
        label: 'Future implementations',
        body: [
          'The interface began as an AI notebook, but the architecture underneath it was built with reuse in mind. The same tree structure can organize different kinds of context while preserving how individual decisions connect to the larger system.',
          'I built the first application around decision-making. The larger opportunity is a reusable structure for organizing how information, reasoning, and decisions connect.',
        ],
      },
    },
  ],
};
