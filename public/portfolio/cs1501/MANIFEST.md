# CS 1501 — media manifest

Asset-preparation pass. This file records which media the case study will use,
what each asset demonstrates, and the story beat it serves. It does **not**
implement the case-study page and does **not** modify the course application.

- **Media folder:** `public/portfolio/cs1501/` (served from
  `/portfolio/cs1501/<filename>`)
- **Naming:** lowercase, hyphenated, `cs1501-*` prefix — matches the repo
  convention in `public/portfolio/README.md` and the `barclay-*` precedent.
- **Path note:** the brief suggested `public/projects/cs1501/`; this repo
  namespaces media under `public/portfolio/<project>/`, so the existing
  convention is used.
- **Quality rule:** drop original full-resolution, uncropped, unedited exports.
  Do not retouch the UI, straighten, recolour, or upscale. The real course
  surface is the evidence.

## Case-study framing

CS 1501 (on-site subtitle: *Coding with AI Systems*) is a University of
Virginia course the author designed and teaches about building software *with*
AI systems — turning an idea into a plan, giving AI the right context, and
directing it while the software is built, rather than treating AI as a chatbot
to prompt.

The website and its in-page exercises are **evidence of that teaching work**,
not the project itself. The media should read as *curriculum design, technical
communication, and system thinking made visible to beginners* — not as a tour
of a class website. Recurring threads to surface across the set:

- The course site is itself a small piece of software (frontend + backend +
  database + a server-side AI integration), built to the same standards the
  course teaches.
- Students **do** something before instruction begins: read, answer, and build.
- One idea is taught repeatedly in concrete form — *the instructions and
  context you give an AI change what it produces* — first as a felt experience,
  then named explicitly.

## Selected assets

| # | Filename | Type | Story beat (case-study role) | Status |
|---|----------|------|------------------------------|--------|
| 1 | `cs1501-home.png` | image / screenshot | Hero | source needed |
| 2 | `cs1501-course-experience.png` | image / screenshot | Course experience outside an LMS | source needed |
| 3 | `cs1501-interactive-build.png` | image / screenshot | Student-facing interactive exercise | source needed |
| 4 | `cs1501-api-lesson.png` | image / screenshot | Systems / AI-integration teaching | source needed |
| 5 | `cs1501-ai-systems.png` | image / screenshot | Conversation → built artifact | source needed |
| 6 | `cs1501-demo.mp4` (+ `cs1501-demo-poster.jpg`) | video (silent, looping) | Live walkthrough | source unconfirmed |

### Additional / reserved

| Filename | Type | Beat | Status |
|---|---|---|---|
| `cs1501-questions-back.png` | image | Pair for #2 — same cards flipped to answers | source needed |
| `cs1501-questionnaire.png` | image | Pre-class input → curriculum design | **candidate located** — `~/Desktop/Screenshot 2026-09-08 at 9.49.47 PM.png` |
| `cs1501-ai-setup.png` | image | Pair for #4 — the setup worksheet + how-it-works copy | source needed |
| `cs1501-api-diagram.png` | image | Alternate for #4 — standalone "what an AI API is" teaching graphic | **candidate located, needs confirmation** — `~/Desktop/Screenshot 2026-09-06 at 5.14.30 PM.png` |

---

### 1. `cs1501-home.png` — HERO

- **Media type:** PNG screenshot, full browser window, uncropped.
- **Source:** supplied screenshot — the CS 1501 homepage. Not located as an
  original file on this machine (recent `~/Desktop` captures are for other
  projects). Re-export at full resolution.
- **Demonstrates:** the homepage as an arranged desk rather than a landing
  page — "Welcome to CS 1501", "We're going to learn, experiment, and build
  with AI together", a taped *FIRST CLASS / September 1st* card, a UVA pennant,
  a faint Rotunda line drawing, and three sticky notes (*Questions*, *Tell Me
  About You*, *Build Your AI Friend*) that are the only navigation.
- **Case-study role:** opening image.
- **Interpretation:** The course was given a front door before it met its
  students. The site is deliberately not a course-management shell: three
  physical-looking notes stand in for a syllabus, and each is a task the
  student can do now — read the questions, answer some, or build something.
  Establishes the course as a designed environment, and the author as someone
  who builds the software they teach.

### 2. `cs1501-course-experience.png` — COURSE EXPERIENCE (outside an LMS)

- **Media type:** PNG screenshot, full window, uncropped. Questions page,
  cards showing the **question** side ("tap to flip").
- **Source:** supplied screenshot. Re-export at full resolution.
- **Demonstrates:** the FAQ rebuilt as a grid of physical index cards —
  numbered, lightly rotated, ruled — with real pre-class questions on the
  front ("When is our first class?", "Do I need to know how to code?", "What
  are we going to build?", "What tools will we use?") and a "tap to flip"
  affordance. A persistent left margin lists the four course destinations.
- **Case-study role:** primary visual for the "not a traditional LMS" section.
- **Interpretation:** Course information is presented as something to handle
  and work through, not a document to scroll. The interaction (flip to reveal)
  is a small teaching choice: the student commits to a guess about the answer
  before seeing it. Pair with `cs1501-questions-back.png` to show the same
  cards answering — e.g. "No coding experience needed", "Mostly Claude,
  ChatGPT, and VS Code", "How prompts and context shape what you get back".

### 3. `cs1501-interactive-build.png` — STUDENT-FACING INTERACTIVE EXERCISE

- **Media type:** PNG screenshot, full window, uncropped. *Build Your AI
  Friend* → "Now, build something together", **Message 0 of 5**, empty
  *Your Creation* panel ("Nothing here yet").
- **Source:** supplied screenshot. Re-export at full resolution.
- **Demonstrates:** the two-part working surface — a lined-notebook
  conversation on the left, a *Your Creation* panel on the right, and a
  visible **five-message budget** ("You only have 5 messages, so think about
  what information might be useful"). The AI's opening turn asks the student to
  describe what they're picturing.
- **Case-study role:** the interactive exercise itself; how a beginner first
  touches the course's core skill.
- **Interpretation:** The message limit is the lesson, not a technical
  constraint — scarcity forces the student to decide what context actually
  matters before spending a turn. This is "designing software around AI":
  the exercise is a small application with a deliberate interaction design,
  and a server-side model call behind it, not a chat box.

### 4. `cs1501-api-lesson.png` — SYSTEMS / AI-INTEGRATION TEACHING

- **Media type:** PNG screenshot, full window, uncropped. *Build Your AI
  Friend* interstitial: "The choices you made above became instructions for
  your AI…", with a **Continue** action.
- **Source:** supplied screenshot. Re-export at full resolution.
- **Demonstrates:** the moment the exercise names what just happened — "You
  didn't change what the AI knows, but you did give it directions for how to
  communicate, respond, and work with you." Delivered in the course's own
  plain voice, in context, right after the student felt the effect.
- **Case-study role:** primary visual for teaching how an AI integration is
  actually assembled (system instruction / context vs. model weights).
- **Interpretation:** Beginners are given a precise mental model — the
  difference between what a model knows and what you instruct it to do — at
  the exact point they can attach it to an experience. Evidence of translating
  a systems concept (prompt/context layering in an AI feature) into one
  sentence a non-programmer can hold.
- **Pairing:** `cs1501-ai-setup.png` (the setup worksheet: "Choose what you
  want to create", "how the instructions we give AI can change the way it
  behaves and what it creates", "your AI will turn your conversation into an
  image") shows the pipeline the interstitial is explaining.
- **Alternate:** `cs1501-api-diagram.png` — a standalone teaching graphic
  ("an AI API is a general-purpose brain you plug into an application:
  see / read / reason / write / decide / create"). More literally an
  "API lesson", but confirm it is course-authored material and note that its
  visual style is not the course site's before using it.

### 5. `cs1501-ai-systems.png` — CONVERSATION → BUILT ARTIFACT

- **Media type:** PNG screenshot, full window, uncropped. *Build Your AI
  Friend* → **Message 5 of 5**, *Your Creation* panel populated with a
  generated image; "Your creation is ready" note visible.
- **Source:** supplied screenshot (example run: a Yankees-themed stadium from
  the prompts "yankees theme" / "navy and white plus some sparkles").
  Re-export at full resolution.
- **Demonstrates:** both ends of the transition in one frame — the finished
  five-turn conversation on the left, the artifact it produced on the right,
  and the debrief note: "Throughout the course, we'll explore different
  factors that influence output quality."
- **Case-study role:** the "building with AI" beat — talk becomes a thing that
  was built.
- **Interpretation:** The exercise closes the loop a beginner rarely sees
  drawn: loose natural-language intent, developed over a constrained
  exchange, resolved by a model call into a concrete output — then framed as
  something whose quality has *causes* the course will study. Not "AI made a
  picture" but "here is the system you just operated, and here is what we'll
  learn to control."

### 6. `cs1501-demo.mp4` — LIVE WALKTHROUGH (slot, source unconfirmed)

- **Media type:** silent, looping H.264 MP4; ship a poster frame
  (`cs1501-demo-poster.jpg`). Target < ~8 MB, ~1600px wide, **no audio track**.
- **Demonstrates (intended):** one pass through *Build Your AI Friend* end to
  end — pick what to create, give instructions, spend the five messages, watch
  the conversation resolve into an image — i.e. the thing the static frames
  (#3 → #4 → #5) can only imply in sequence.
- **Case-study role:** live-implementation / process section. Use **only** if
  the motion shows something the stills cannot — the pacing of the message
  budget, the generation step.
- **Interpretation (intended):** the exercise behaving as one small system in
  motion, from empty prompt to finished artifact, without leaving the page.
- **Status:** unverified candidate `~/Desktop/Screen Recording 2026-09-04 at
  2.08.33 PM.mov` (2.8 MB, 2026-09-04). Confirm it is a CS 1501 capture, trim
  to a clean loop, strip audio, and add a poster before using. No `ffmpeg` on
  this machine, so no conversion was done here.

---

## Cross-cutting note — "instructions change the output"

Assets #3, #4 and #5 are one sequence: *do it* (interactive build) → *name it*
(the interstitial) → *see the result* (conversation → artifact). In the case
study they should run in that order so the concept lands as experience first
and vocabulary second. `cs1501-ai-setup.png` sits at the front of that sequence
if a fourth frame helps.

## Suggested page-slot mapping (for later — not yet wired)

`src/pages/Cs1501.tsx` placeholders map to:

| Manifest asset | Existing slot in `Cs1501.tsx` / `projects.ts` |
|---|---|
| `cs1501-home.png` | `ProjectHero`; homepage `preview` in `src/content/projects.ts` (currently `preview.mp4`) |
| `cs1501-demo.mp4` (+ poster) | `VideoBlock` (currently `live-build.mp4`); could also be the homepage `preview` |
| `cs1501-ai-systems.png` | `LargeMedia` (currently `overview.png`) |
| `cs1501-course-experience.png`, `cs1501-interactive-build.png`, `cs1501-api-lesson.png` | `ImageGrid` (currently `slide-01/02/03.png`) |
| `cs1501-questionnaire.png`, `cs1501-questions-back.png`, `cs1501-ai-setup.png` | reserve for an expanded grid or inline figures |

Slot filenames in `Cs1501.tsx` will be renamed to the `cs1501-*` names when the
page is wired — not part of this pass.

## Assets not created (no usable source written)

Supplied screenshots are attached to the working conversation as downscaled
renders; writing them into `public/` would recompress and degrade them, so
**no image files were written**. Checked `~/Desktop`, `~/Downloads`,
`~/Documents`, `~/Movies` for full-resolution originals:

- **Located and usable:** `~/Desktop/Screenshot 2026-09-08 at 9.49.47 PM.png` —
  a clean full-res *Tell Me About You* capture → use as `cs1501-questionnaire.png`.
- **Located, do not use:** `~/Desktop/Screenshot 2026-09-08 at 9.49.35 PM.png` —
  same view but a macOS permission dialog covers the page.
- **Located, needs confirmation:** `~/Desktop/Screenshot 2026-09-06 at 5.14.30
  PM.png` ("The AI API Shift" graphic) → possible `cs1501-api-diagram.png`;
  confirm provenance and note off-brand styling.
- **Video candidate, unverified:** `~/Desktop/Screen Recording 2026-09-04 at
  2.08.33 PM.mov`.
- **Not found:** full-resolution originals of the homepage, the Questions
  flashcards, and the three *Build Your AI Friend* frames. Re-export these from
  the running course site at full window size, uncropped, and drop them in
  under the names above.

## Things to check before this goes in the portfolio

- The Questions page contact card shows instructor email `rca8rw@virginia.edu`,
  which is not the author's computing ID. Confirm whether that is the intended
  instructor of record or a value to update before publishing screenshots.
- The *Build Your AI Friend* spec on file (`04-demo-chatbot-welcome-website.md`)
  describes a *chat* demo; the shipped exercise is a *conversation → image*
  build with a five-message budget. The screenshots (shipped version) are the
  source of truth; the older spec is not portfolio media.
