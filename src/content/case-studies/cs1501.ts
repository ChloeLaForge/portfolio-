/* ============================================================
   CS 1501 — case-study narrative
   A course the author designed and teaches: building software
   with AI systems. The course website and its in-page exercises
   are the evidence of that teaching work, not the project itself.

   The page (src/pages/Cs1501.tsx) opens on a compact course
   identity (title only, no explanatory hero copy) with the three
   tab buttons directly beneath it. That header never moves; only
   the active tab's panel below it swaps:
     Course Content Website | Course Slides | Pre-Class Website
   Each tab's own content lives in the exported arrays below.

   Media is evidence: screen captures of the running course site —
   no browser chrome, no black surround — downscaled to 1800px wide
   and dropped in public/portfolio/cs1501/images/. The `cs-cs1501`
   class (src/pages/cs1501.css) holds every figure to evidence size
   — never full-bleed.
   ============================================================ */

import type { Media } from '../media';
import type { CaseStudySection } from './types';

const IMG = '/portfolio/cs1501/images';
const VIDEOS = '/portfolio/cs1501/videos';
const SHOT_ASPECT = '1800 / 1040'; // uniform frame for the course-site captures

/** A screen capture of the running CS 1501 course site — chrome-free,
 *  1800px wide, cover-fit into a uniform frame so the page keeps one
 *  rhythm. */
const shot = (name: string, alt: string): Media => ({
  kind: 'image',
  src: `${IMG}/${name}.png`,
  alt,
  aspect: SHOT_ASPECT,
});

/* ============================================================
   TAB 1 — COURSE CONTENT WEBSITE
   The CS 1501 "Field Guide" — the reference site students used
   during instruction, distinct from the pre-class site and from
   the slide deck. Opens directly on the site itself (the former
   "second way to learn" framing section was removed — the
   interaction is the argument, not a paragraph ahead of it) and
   stays bullet-first throughout: each demo is concept → interact
   → observe, not concept explained in prose.
   Sequenced by the site's own internal order (its nav bar: Field
   Guide → System → APIs → AI Brain → Prompting → Build →
   Questions), recovered by inspecting every capture rather than
   trusting filenames — several files land in a different unit
   than their name suggests (`content-beginning` is actually
   mid-way through the Build unit, not the homepage;
   `content-human-and-ai` is the Prompting unit's specificity
   ladder, not a "human + AI" overview). The AI Brain unit's three
   examples and the Prompting/Build pairing are pulled into
   `cs1501AiSlides` and `cs1501PromptCards` below — a slideshow and
   a side-by-side pair respectively, each rendered by its own
   component in Cs1501.tsx between `cs1501ContentIntro` and
   `cs1501ContentClosing`.

   Videos are the real .mov captures on disk (two filenames were
   truncated in Finder when first listed — the actual files are
   `content-frontend-backend-demo.mov` and `content-questionsn.mov`)
   cropped with tools/cropvid-cs1501.swift, a third calibrated
   variant of the Notebook/Barclay pipeline: same silent/cropped/
   poster-frame approach, its own measured crop rect for this
   recording batch (native 3148x1992 → 1600x738, chrome and the
   rounded-corner black margin removed, verified pixel-identical
   across all 5 source clips — see that file's header comment). */

const CONTENT_SHOT_ASPECT: Record<string, string> = {
  'content-homepage': '2878 / 1252',
  'content-beginning': '2858 / 1446',
  'content-human-and-ai': '2846 / 1438',
  'content-human-collab': '2882 / 1480',
  'content-ai-use-1': '2880 / 1454',
  'content-ai-use-2': '2882 / 1490',
  'content-apis-and-ai': '2880 / 1466',
};

const contentShot = (name: string, alt: string): Media => ({
  kind: 'image',
  src: `${IMG}/${name}.png`,
  alt,
  aspect: CONTENT_SHOT_ASPECT[name],
});

const CONTENT_CLIP_ASPECT = '1600 / 738'; // tools/cropvid-cs1501 delivery ratio

const contentClip = (name: string, alt: string, rate = 2): Media => ({
  kind: 'video',
  src: `${VIDEOS}/${name}.mp4`,
  poster: `${VIDEOS}/${name}-poster.jpg`,
  alt,
  aspect: CONTENT_CLIP_ASPECT,
  rate,
});

/** content-human-ai-blend.mov was captured after the original 5-clip
 *  batch, in a differently-sized browser window (native 3244×1992 vs.
 *  that batch's 3148×1992) — cropped by its own tool
 *  (tools/cropvid-cs1501-blend.swift) at its own measured rect, so it
 *  gets its own delivery aspect rather than reusing CONTENT_CLIP_ASPECT. */
const BLEND_CLIP_ASPECT = '1600 / 718';

const blendClip = (name: string, alt: string, rate = 2): Media => ({
  kind: 'video',
  src: `${VIDEOS}/${name}.mp4`,
  poster: `${VIDEOS}/${name}-poster.jpg`,
  alt,
  aspect: BLEND_CLIP_ASPECT,
  rate,
});

/** The tab's first run: the site itself, then the frontend/backend
 *  demo, then the API progression. Split from the closing run below
 *  so Cs1501.tsx can render the AI slideshow and prompting cards
 *  between them without slicing the array by index. */
export const cs1501ContentIntro: CaseStudySection[] = [
  {
    kind: 'media+text',
    id: 'content-home',
    side: 'right',
    heading: 'Concepts you can interact with.',
    body: [],
    bullets: [
      'Built the course content as an interactive website rather than a static set of notes.',
      'Students click through concepts and watch the system respond in real time.',
      'Abstract ideas in AI and software systems become visible before students are asked to reason about them.',
    ],
    link: { label: 'VIEW LIVE COURSE SITE ↗', href: 'https://cs-1501-course-content.onrender.com/' },
    media: contentShot(
      'content-homepage',
      'The CS 1501 Field Guide homepage: "Understanding the system > memorizing the code," with a nav bar for Field Guide, System, APIs, AI Brain, Prompting, Build, and Questions.',
    ),
    caption: {
      lead: 'A growing reference, not a script',
      text: 'The homepage says it outright: nothing here is meant to be read start to finish.',
    },
  },
  {
    kind: 'media+text',
    id: 'content-system',
    side: 'left',
    heading: 'Making the system visible',
    body: [],
    bullets: [
      'Turns an abstract frontend/backend explanation into something students can manipulate.',
      'One click visually traces the same request through each stage.',
      'Each step changes on screen so the system behavior is seen, not only described.',
      'Students can replay the sequence and connect the interface they see to the work happening behind it.',
    ],
    takeaway: 'Visual learning turns system architecture into a sequence students can follow.',
    media: contentClip(
      'content-frontend-backend-demo',
      'An interactive demo: toggling a mock app between frontend, backend, and both views, then tracing a "Load my profile" button press through five stages — user, frontend, backend, response, frontend — with a live line-by-line trace of what each stage does.',
    ),
  },
  {
    kind: 'sequence',
    id: 'content-apis',
    intro: 'API basics',
    heading: 'Making the building blocks tangible',
    lead: 'Before connecting full systems, students first see how individual capabilities can be combined.',
    stepLayout: 'side',
    steps: [
      {
        title: 'Build the idea one block at a time',
        body: [],
        bullets: [
          'Students add capabilities one at a time instead of seeing a finished architecture.',
          'Each click creates a visible change, so composition is something they watch happen.',
          '"APIs are building blocks" becomes something students actually assemble.',
        ],
        media: contentClip(
          'content-api-building-blocks',
          'Building blocks: capability cards for Location, Payments, Messaging, Weather, and Search are added one at a time to "My app," which starts as an app that can do nothing yet.',
        ),
      },
      {
        title: 'Watch separate layers become one experience',
        body: [],
        bullets: [
          'Students switch individual layers on and watch the interface assemble in real time.',
          'Map, GPS, logic, and interface become visually separable before they become one application.',
          'The interaction makes dependencies easier to understand because each layer has a visible effect.',
        ],
        media: contentClip(
          'content-api-geometry',
          'A game board made of other people’s work: four layer toggles — map service, device GPS, game logic, interface — build up a live grid with a player position, score, and nearby markers, starting from an empty rectangle.',
        ),
      },
      {
        title: 'Same building blocks, different decisions',
        body: [],
        bullets: [
          'Students choose which returned information actually reaches the interface.',
          'The result changes immediately as those choices change.',
          'The demo makes authorship visible: an API supplies capability, but the builder decides how that capability appears.',
        ],
        media: contentClip(
          'content-api-demo',
          'Same building blocks, not the same application: clicking Name, Height, Weight, and Type toggles which fields from an API response populate a "Field entry" card showing a Ferngrove Warbler.',
        ),
      },
    ],
  },
];

/** The tab's closing run, resumed after the AI slideshow and
 *  prompting cards. */
export const cs1501ContentClosing: CaseStudySection[] = [
  {
    kind: 'media+text',
    id: 'content-build-direction',
    side: 'right',
    heading: 'How much direction do you bring?',
    body: [],
    bullets: [
      {
        lead: 'Make the tradeoff visible.',
        text: 'Students move through different questions and watch the balance between human direction and AI decision-making change with each scenario.',
      },
      {
        lead: 'Learn by manipulating the model.',
        text: 'Instead of reading a fixed rule about how much to delegate, students click through cases and compare the visual response.',
      },
      {
        lead: 'Keep the answer intentionally subjective.',
        text: 'The interaction does not prescribe one "correct" human/AI split. It makes the consequences of each choice easier to see, discuss, and question.',
      },
      {
        lead: 'Turn an abstract idea into something observable.',
        text: 'As the scenario changes, the human and AI levels respond visually, giving students a concrete model for discussing authorship, delegation, and collaboration.',
      },
    ],
    media: blendClip(
      'content-human-ai-blend',
      'How much direction do you bring? An interactive demo: selecting different prompt levels updates a live human-direction/AI-decided percentage bar in real time.',
    ),
  },
  {
    kind: 'media+text',
    id: 'content-questions',
    side: 'right',
    heading: 'Learning continues through the questions students ask',
    body: [],
    bullets: [
      'The site regularly interrupts explanation with questions that require judgment rather than recall.',
      'There is not always one predetermined answer, so students have to reason about consequences and tradeoffs.',
      'Interactive prompts turn the website from a reference resource into something students actively think through.',
    ],
    takeaway: 'The goal is not just to show an answer. It is to create a reason to keep exploring.',
    media: contentClip(
      'content-questionsn',
      'Questions to keep asking: a numbered reference list including "what decisions should I keep?" and "what am I delegating?", with the note that the technology will change but these should still be useful when it does.',
      1.4,
    ),
  },
];

/* ============================================================
   AI SLIDESHOW — one centered clickable carousel replacing the
   former "AI as a different kind of block" run of stacked
   sections. Rendered by a dedicated <AiSlideshow> in Cs1501.tsx,
   not by <CaseStudySections>, since prev/next + a synced caption
   is a distinct interaction shape from the rest of the tab.
   ============================================================ */
export interface AiSlide {
  title: string;
  bullets: string[];
  media: Media;
}

export const cs1501AiSlides: AiSlide[] = [
  {
    title: 'AI becomes another capability students can inspect',
    bullets: [
      'AI enters the same visual system as the earlier API examples, creating continuity between concepts.',
      'Students open the AI block themselves instead of receiving a static definition.',
      'The interaction highlights the difference between retrieving information and interpreting information.',
    ],
    media: contentShot(
      'content-apis-and-ai',
      'A slide reading "APIs let us borrow capabilities. AI APIs let us borrow interpretation," above six capability blocks — Location, Payments, Messaging, Weather, Search, and AI — with the AI block opened and highlighted.',
    ),
  },
  {
    title: 'Same input, two ways of reading it',
    bullets: [
      'One input is processed two different ways side by side.',
      'The visual comparison exposes the difference between matching a predefined rule and interpreting context.',
      'Students can compare the outcomes directly instead of treating AI behavior as an invisible process.',
    ],
    media: contentShot(
      'content-ai-use-1',
      'Two ways we’ve used it, tab 1: a keyword-rule path (scan for "angry," follow its rule) compared side by side with an AI-interpretation path (read the whole statement, infer disappointment underneath the anger) for the same input sentence.',
    ),
  },
  {
    title: 'Change the instructions, change the behavior',
    bullets: [
      'The input stays fixed while the instructions change.',
      'Students can switch between behaviors and immediately compare the resulting response.',
      'Holding everything else constant isolates instructions as the variable, making prompting visually testable.',
    ],
    media: contentShot(
      'content-ai-use-2',
      'Two ways we’ve used it, tab 2: the same user input and a written instruction ("respond only with a question") produce a question-led output, with a toggle for supportive/concise/question-led response styles and a note that these three responses are written in advance.',
    ),
  },
];

/* ============================================================
   PROMPTING CARDS — the specificity ladder and "start with the
   actual problem" shown as one paired exhibit instead of two
   sections separated by scroll distance. Rendered by a dedicated
   <PromptCards> in Cs1501.tsx.
   ============================================================ */
export interface PromptCard {
  title: string;
  bullets: string[];
  media: Media;
}

export const cs1501PromptCards: PromptCard[] = [
  {
    title: 'Control the decisions',
    bullets: [
      'Three versions of the same request expose how much decision-making the student is delegating.',
      'The visual meter makes specificity measurable instead of abstract.',
      'Students focus on authorship and control, not simply writing a longer prompt.',
    ],
    media: contentShot(
      'content-human-and-ai',
      'The specificity ladder: three levels of a login-page prompt, from "build me a login page" to a fully constrained version, beside a bar chart showing 8% human direction and 92% decided by AI for the vaguest prompt.',
    ),
  },
  {
    title: 'Scope the problem first',
    bullets: [
      'The system separates human decisions, deterministic code, and useful AI work.',
      'Students visually identify where AI adds value before deciding how to prompt it.',
      'The exercise reframes AI integration as a system-design choice rather than an automatic starting point.',
    ],
    media: contentShot(
      'content-beginning',
      'Start with the actual problem: a three-column split of a decision-tree-building tool’s responsibilities — human (defines purpose, provides answers), deterministic code (stores structure, assigns IDs, positions nodes), and AI (interprets answers, decides a useful next question).',
    ),
  },
];

/* ============================================================
   TAB 2 — COURSE SLIDES
   The 12 slides actually taught in class, in order. Filenames are
   the originals dropped into public/portfolio/cs1501/slides/ —
   untouched, unrenamed (see that folder). Each gets its own
   measured aspect ratio (SLIDE_ASPECT) rather than a shared one:
   the decks are all ~16:9 but not pixel-identical, and `fit:
   'contain'` plus the exact ratio means zero cropping and zero
   letterboxing. Bullets are a portfolio read of *why* each slide
   is in the deck, not a transcript of what's written on it.
   ============================================================ */

const SLIDES = '/portfolio/cs1501/slides';

/** Each slide's own native pixel ratio (measured from the source
 *  PNG) — see the note above on why this isn't one shared constant. */
const SLIDE_ASPECT: Record<string, string> = {
  'slide-1': '1522 / 856',
  'slide-2': '1694 / 952',
  'slide-3': '1524 / 858',
  'slide-4': '1524 / 854',
  'slide-5': '1516 / 856',
  'slide-6': '1524 / 856',
  'slide-7': '1528 / 854',
  'slide-8': '1520 / 854',
  'slide-9': '1520 / 852',
  'slide-10': '1522 / 858',
  'slide-11': '1514 / 856',
  'slide-12': '1524 / 856',
};

const slide = (name: string, alt: string): Media => ({
  kind: 'image',
  src: `${SLIDES}/${name}.png`,
  alt,
  aspect: SLIDE_ASPECT[name],
});

export interface CourseSlide {
  media: Media;
  /** Concise bullets: this slide's significance, purpose, and place
   *  in the teaching progression. */
  bullets: string[];
}

export const cs1501Slides: CourseSlide[] = [
  {
    media: slide('slide-1', 'Title slide: "CS 1501 — Coding with AI Systems," a welcome note, and a UVA Rotunda line drawing over a blueprint grid, framing Fall 2026 Week 01.'),
    bullets: [
      'Introduces the mindset students will use to connect each concept back to a larger system.',
    ],
  },
  {
    media: slide('slide-2', 'A five-step infographic tracing an API from a phone’s GPS location through a location API to Pokémon GO’s game logic and display, ending in "their job becomes creative."'),
    bullets: [
      'Anchors APIs in something every student has already used, so the idea lands before the vocabulary does.',
      'Rehearses the capability-borrowing logic the course later applies to AI.',
    ],
  },
  {
    media: slide('slide-3', 'A text slide: "Developers never asked ‘how do we build a global positioning system?’ Instead, they discussed ‘what could we build if our game knew exactly where the player was?’"'),
    bullets: [
      'Slows the pace right after a dense graphic so one idea can land.',
      'Shifts the question from how to build the system to what could be built on top of it.',
    ],
  },
  {
    media: slide('slide-4', 'A text slide titled "AI API": "Now YOU become the teacher... Teaching AI does NOT equal teaching it facts, instead you’re instructing it" how to speak, organize, prioritize, and what its output should look like.'),
    bullets: [
      'Turns students from observers of an API into the ones instructing it.',
      'Separates teaching AI facts from shaping its behavior, which Build Your AI Friend later lets students feel.',
    ],
  },
  {
    media: slide('slide-5', 'A "Quick Recap: Where We Left Off" slide restating an AI API as the "brain" of an application, with a diagram of a chat interface sending a message and an AI icon sending back a response.'),
    bullets: [
      'Rebuilds the mental model before adding to it, so no one starts the new session behind.',
      'Reuses the same “brain” framing so vocabulary stays consistent from week to week.',
    ],
  },
  {
    media: slide('slide-6', 'A slide titled "AI At UVA! - Yesterday 9/14" diagramming Korinek’s research on AI automating its own research, branching into a utopian outcome and a destructive consequence, closing with "everyone, across disciplines, should engage."'),
    bullets: [
      'Ties the course to live research on campus, so the ideas feel current rather than hypothetical.',
      'Makes alignment a concern for non-engineers too by showing the stakes reach across disciplines.',
    ],
  },
  {
    media: slide('slide-7', 'A slide titled "Today’s Key Insight": "The less you specify, the more decisions you’re quietly handing to the AI model," with a four-panel spectrum from broad/narrative prompts to fully constrained ones.'),
    bullets: [
      'Reframes prompting as a question of who is making the decisions, not how to get a better answer.',
      'Lines up four levels of specificity so students see the claim instead of taking it on trust.',
    ],
  },
  {
    media: slide('slide-8', 'A slide titled "Let’s Walk Through A Sample!" showing a real generated wellness-brand site ("Forme") beside a short list: static demo, portfolio + personal projects, business ideas + prototypes.'),
    bullets: [
      'Grounds the specificity idea in a real generated site students can explore themselves.',
      'Shows uses beyond the classroom so the coming exercise has a purpose.',
    ],
  },
  {
    media: slide('slide-9', 'A "Demo Time!" slide with instructions to open a sample prompt from Canvas, fill in blanks at your table, then paste into Claude, illustrated as a four-step flow from Canvas to a Google Doc to Claude to "now we wait."'),
    bullets: [
      'Moves students from watching to deciding, together.',
      'A shared fill-in-the-blank forces agreement on specifics instead of defaulting to something vague.',
    ],
  },
  {
    media: slide('slide-10', 'A "While it builds..." slide previewing backend + AI-brain work ahead and posing an economic-balance question: on an app that places text in a tree by ID, length, and sibling count, what should the AI actually be paid to do?'),
    bullets: [
      'Uses the generation wait to plant a new question instead of leaving dead time.',
      'Introduces cost-conscious thinking early: spend AI on judgment, not on placement a fixed structure can handle.',
    ],
  },
  {
    media: slide('slide-11', 'A slide titled "One starting prompt... three small edits -> three completely different interfaces," showing three distinct skincare-brand demo sites (Liora Veil, Vale & Root, Glow Theory) generated from the same base prompt.'),
    bullets: [
      'Makes compounding visible: one base prompt, three small edits, three different interfaces.',
      'Side by side, students can verify that the constraints changed far more than the colors.',
    ],
  },
  {
    media: slide('slide-12', 'A slide titled "3 Prompts - 3 Human Input Levels," showing three ChatGPT house-image generations of increasing specificity, closing with "the happy medium: combining my creative direction + AI’s ability to produce it much more efficiently."'),
    bullets: [
      'Closes the unit on the same escalation of specificity and authorship students are about to try themselves.',
      'Lands the thesis, human direction plus AI efficiency, right before they do it firsthand.',
    ],
  },
];

/* ============================================================
   TAB 3 — PRE-CLASS WEBSITE
   Opens directly on the flashcard walkthrough of the pre-class site
   — no separate intro section; the work introduces itself visually.
   Then the core exercise (Build Your AI Friend), and finally the
   database-to-classroom pipeline as a custom diagram (rendered by
   <PreClassDataLoop /> in Cs1501.tsx, not a data-driven section here
   — it branches into three destinations, a shape the generic
   diagram variants don't cover).
   ============================================================ */

export interface WalkthroughStep {
  media: Media;
  name: string;
  descriptor: string;
}

/** The pre-class site, walked in the order a student actually moves
 *  through it. Reused from the former static six-shot overview —
 *  same captures, same order, now a clickable sequence instead of a
 *  grid. The Questions step's caption carries both sides of the
 *  flip card (guess, then check) rather than showing both images. */
export const cs1501WalkthroughSteps: WalkthroughStep[] = [
  {
    media: shot(
      'cs1501-home',
      'The CS 1501 homepage as an arranged desk: a "Welcome to CS 1501" masthead, a taped FIRST CLASS / September 1st card, a UVA pennant, a faint Rotunda line drawing, and three sticky notes — Questions, Tell Me About You, Build Your AI Friend.',
    ),
    name: 'Course home',
    descriptor: 'Three sticky notes stand in for a syllabus.',
  },
  {
    media: shot(
      'cs1501-questionnaire',
      'The Tell Me About You page: a notebook-paper questionnaire asking for a name, how comfortable the student is with coding, and how they already use AI for coding.',
    ),
    name: 'Pre-class intake',
    descriptor: 'Every answer here is written to a database: real responses I bring back into class as material, not a form filled out and forgotten.',
  },
  {
    media: shot(
      'cs1501-course-experience',
      'The Questions page: a grid of numbered, ruled index cards showing course questions on the front — "When is our first class?", "Do I need to know how to code?", "What tools will we use?" — each marked "tap to flip".',
    ),
    name: 'Interactive FAQ',
    descriptor:
      'Guess the answer, then tap to flip and check it: "No coding experience needed," "Mostly Claude, ChatGPT, and VS Code."',
  },
  {
    media: shot(
      'cs1501-ai-setup',
      'The Build an AI Friend intro: how-it-works copy and a "What do you want to create?" worksheet with options House, Theme Park, Stadium, Outfit, Dream Room, Something Else.',
    ),
    name: 'Build setup',
    descriptor: 'Students pick what to make and set the AI’s instructions.',
  },
  {
    media: shot(
      'cs1501-interactive-build',
      'Build Your AI Friend at Message 0 of 5: a lined-notebook conversation on the left with the AI’s opening question, an empty Your Creation panel on the right, and a visible five-message budget.',
    ),
    name: 'Live build',
    descriptor: 'A five-message budget forces a choice about what context matters.',
  },
  {
    media: shot(
      'cs1501-ai-systems',
      'Build Your AI Friend at Message 5 of 5: the finished conversation on the left and a generated Yankees-themed stadium image in the Your Creation panel, with a "Your creation is ready" note.',
    ),
    name: 'Conversation → artifact',
    descriptor: 'The five turns resolve into a generated image, then a debrief.',
  },
];

/** The core exercise, continuing directly from the walkthrough above.
 *  `stepLayout: 'side'` puts each step's text beside its screenshot
 *  instead of stacking them. Four real product steps carry a five-beat
 *  idea (set instructions → experience behavior → modify and compare →
 *  connect to system design) — "modify" and "compare" fold into step
 *  three's copy rather than inventing a fifth screenshot that doesn't
 *  exist in the product. */
export const cs1501PreClassTab: CaseStudySection[] = [
  {
    kind: 'sequence',
    id: 'build',
    heading: 'Build Your AI Friend',
    intro: 'Part 1 · The core exercise',
    lead: 'Students shape an AI collaborator, then experience how changing its instructions changes its behavior.',
    body: ['Interaction style becomes something a builder can design on purpose.'],
    stepLayout: 'side',
    steps: [
      {
        title: 'Set the behavior',
        body: [
          'Students choose what to build and define how the AI should work with them before the conversation begins.',
        ],
        media: shot(
          'cs1501-ai-setup',
          'The Build an AI Friend setup: how-it-works copy explaining that the conversation becomes an image, above a "What do you want to create?" worksheet.',
        ),
        caption: {
          lead: 'Context, not chat',
          text: 'What the student sets up here becomes the AI’s instructions before a single message is sent.',
        },
      },
      {
        title: 'Experience the difference',
        body: [
          'The conversation runs under those instructions, making the interaction style visible within a five-message budget.',
        ],
        media: shot(
          'cs1501-interactive-build',
          'Build Your AI Friend at Message 0 of 5: the AI’s opening question in a notebook-lined thread, a send box, and an empty Your Creation panel reading "Nothing here yet".',
        ),
        caption: {
          lead: 'The budget is the lesson',
          text: 'Not a technical limit: a reason to think before typing.',
        },
      },
      {
        title: 'Compare and find what works',
        body: [
          'The exercise then names what changed: the instructions, not the AI’s knowledge, shaped the response, so students can judge which style fits how they work.',
        ],
        media: shot(
          'cs1501-api-lesson',
          'A taped interstitial card in Build Your AI Friend: "The choices you made above became instructions for your AI. You didn’t change what the AI knows, but you did give it directions for how to communicate, respond, and work with you." with a Continue button.',
        ),
        caption: {
          lead: 'Instructions vs. knowledge',
          text: 'A systems concept put in one sentence a non-programmer can hold.',
        },
      },
      {
        title: 'Connect it to building',
        body: [
          'The exercise turns a personal interaction into a product-design question: how should an AI system behave toward its users?',
        ],
        media: shot(
          'cs1501-ai-systems',
          'Build Your AI Friend at Message 5 of 5: a completed five-turn conversation beside a generated Yankees-themed stadium image, with a note that the course will explore what influences output quality.',
        ),
        caption: {
          lead: 'Talk becomes a built thing',
          text: 'Loose intent, developed over a constrained exchange, resolved by a model call into a concrete output.',
        },
      },
    ],
  },
];
