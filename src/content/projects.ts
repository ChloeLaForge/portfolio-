/* ============================================================
   PROJECTS
   The single source of truth for project identity: what each one
   is called, where it lives, and what the homepage shows for it.
   The homepage, the branch diagram and the "next project" footer
   all read from this array — nothing is duplicated in components.

   To rename a project, change it here.
   To reorder the explorations, reorder this array.
   To put real media on the homepage, replace `preview`.
   ============================================================ */

import { type Media } from './media';

export type ProjectId = 'notebook' | 'barclay-woods' | 'cs1501';

/* Homepage previews are one deliberate composition: IMAGE · MOTION · IMAGE.
   Barclay and CS 1501 hold still so the eye can read the interface; Notebook
   is the single moving piece, a silent muted 2× loop that draws attention to
   the middle project without turning it into an advert (see MediaVideo).

   Barclay's and CS 1501's stills are homepage-only captures, kept separate
   from the images the case-study pages use so a swap here never touches
   those pages. */
/** The Notebook homepage preview is the case-study's primary "live build"
 *  clip — the `hook` section's notebook-09 (see
 *  content/case-studies/notebook.ts's `clip()` / `ASPECT`), same source,
 *  same alt, same 2× rate. The `-crop.mp4` + `-crop-poster.jpg` pair is the
 *  browser-safe encode already cropped to the application canvas, no
 *  browser chrome or black surround. Only the container this renders into
 *  changes size on the homepage — the crop itself must not be reinvented
 *  here. */
const NOTEBOOK_ASPECT = '1476 / 840';
const BARCLAY_HOME_ASPECT = '1514 / 946';
const CS1501_HOME_ASPECT = '1522 / 856';

export interface Project {
  id: ProjectId;
  /** Diagram index. Purely presentational — reordering the array is what matters. */
  index: string;
  title: string;
  /** Overrides `title` in the nav pill where the full title would crowd it
   *  on narrow screens. */
  navLabel?: string;
  /** The one-line conceptual statement for this branch — the project's
   *  particular expression of the thesis. Shown above its preview. */
  branch: string;
  /** Three concise bullets, shown directly below the preview: the
   *  strongest idea behind this project, in the terms of the homepage
   *  thesis. Depth lives on the case-study page, not here. */
  bullets: string[];
  /** Slightly longer framing, shown on the project preview and page. */
  subtitle: string;
  route: string;
  /** Right-hand metadata on the project page. Replace with real values. */
  meta: { label: string; value: string }[];
  /** Homepage preview, shown inside the project's branch column.
   *  Barclay + CS 1501 are images; Notebook is a silent looping video. */
  preview: Media;
}

export const projects: Project[] = [
  {
    id: 'barclay-woods',
    index: '01',
    title: 'Barclay Woods',
    branch: 'A real system, applied',
    bullets: [
      'Real community operations translated into one working system.',
      'Tickets, payments, vendors, communication, and resident workflows share connected infrastructure.',
      'Designed around recurring operational patterns rather than isolated features.',
    ],
    subtitle: 'Turning fragmented community operations into one operating system.',
    route: '/barclay-woods',
    meta: [
      { label: 'Role', value: 'Product Design + Full-Stack Engineering' },
      { label: 'Focus', value: 'Workflow Design / Systems Architecture' },
      { label: 'Context', value: 'Residential Community Management' },
    ],
    preview: {
      kind: 'image',
      src: '/portfolio/barclay-woods/barclay-home-preview.png',
      alt: 'The Barclay Woods resident home screen: an editorial masthead in warm brown and copper, with navigation already scoped to the signed-in role and a View as Resident / Management / Vendor control.',
      aspect: BARCLAY_HOME_ASPECT,
    },
  },
  {
    id: 'notebook',
    index: '02',
    title: 'AI Notebook',
    branch: 'Systems thinking × AI',
    bullets: [
      'AI works directly inside the structure the user is building.',
      'Context remains visible, inspectable, and connected as the tree grows.',
      'Structured reasoning becomes reusable across decisions and interfaces.',
    ],
    subtitle: 'An interactive space for structuring a system before any of it gets built.',
    route: '/notebook',
    meta: [
      { label: 'Focus', value: 'Systems thinking + interactive AI' },
      { label: 'Context', value: 'Structure-building tool' },
    ],
    preview: {
      kind: 'video',
      src: '/portfolio/notebook/videos/notebook-09-multi-tree-proposal-expansion-crop.mp4',
      poster: '/portfolio/notebook/videos/notebook-09-multi-tree-proposal-expansion-crop-poster.jpg',
      alt: 'A proposed set of ghosted trees on one Page is accepted into real trees, then a follow-up proposal expands a single branch into finer detail.',
      aspect: NOTEBOOK_ASPECT,
      rate: 2,
    },
  },
  {
    id: 'cs1501',
    index: '03',
    title: 'CS 1501',
    // Preserved as-is this pass — the CS 1501 case study is not implemented yet.
    branch: 'Teaching the pieces',
    bullets: [
      'Designed and teach a UVA course on building software with AI systems.',
      'Technical concepts become visual, interactive, and demo-driven.',
      'Students learn how system components connect by building with them.',
    ],
    subtitle: 'A course on building software with AI systems, designed from the ground up.',
    route: '/cs1501',
    meta: [
      { label: 'Type', value: 'Placeholder' },
      { label: 'Year', value: '——' },
      { label: 'Status', value: 'Placeholder' },
    ],
    preview: {
      kind: 'image',
      src: '/portfolio/cs1501/cs1501-home-preview.png',
      alt: 'CS 1501 welcome slide: an architectural blueprint of the Rotunda with technical annotations, titled "CS 1501, Coding with AI Systems — welcome, thanks for joining."',
      aspect: CS1501_HOME_ASPECT,
    },
  },
];

export const getProject = (id: ProjectId): Project => {
  const found = projects.find((p) => p.id === id);
  if (!found) throw new Error(`Unknown project: ${id}`);
  return found;
};

/** Wraps around, so the last project points back at the first. */
export const getNextProject = (id: ProjectId): Project => {
  const i = projects.findIndex((p) => p.id === id);
  return projects[(i + 1) % projects.length];
};
