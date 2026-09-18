import { useState } from 'react';
import { CaseStudySections, Media, NextProject, Placeholder, Reveal } from '../components';
import {
  cs1501AiSlides,
  cs1501ContentClosing,
  cs1501ContentIntro,
  cs1501PreClassTab,
  cs1501PromptCards,
  cs1501Slides,
  cs1501WalkthroughSteps,
  type AiSlide,
  type CourseSlide,
  type PromptCard,
  type WalkthroughStep,
} from '../content/case-studies/cs1501';
import './cs1501.css';

/* ============================================================
   CS 1501 — case study
   A compact course identity (title only) with the three tab
   buttons directly beneath it — both stay on screen with zero
   scrolling and never move when a tab changes; only the active
   tab's panel below swaps. Per-tab composition lives in
   ../content/case-studies/cs1501.ts.
   ============================================================ */

const TABS = [
  { id: 'content', label: 'Course Content Website' },
  { id: 'slides', label: 'Course Slides' },
  { id: 'preclass', label: 'Pre-Class Website' },
] as const;

const pad = (n: number) => String(n).padStart(2, '0');

/** The pre-class site walked in order, like a student moving through
 *  it for the first time — one large screenshot at a time, not a
 *  grid. Opens the Pre-Class Website tab. */
function PreClassWalkthrough({ steps }: { steps: WalkthroughStep[] }) {
  const [index, setIndex] = useState(0);
  const count = steps.length;
  const current = steps[index];

  const goPrev = () => setIndex((i) => (i === 0 ? count - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === count - 1 ? 0 : i + 1));

  return (
    <Reveal as="section" className="cs1501-walk">
      <p className="label">Pre-class experience</p>
      <h2 className="cs1501-walk__heading">Walk through it like a student would</h2>

      <div className="cs1501-walk__stage">
        <button type="button" className="cs1501-walk__nav" onClick={goPrev} aria-label="Previous screen">
          <span aria-hidden="true">←</span>
        </button>
        <div className="cs1501-walk__frame mfig__frame">
          <Media media={current.media} fit="cover" controls={false} noReducedMotionControl />
        </div>
        <button type="button" className="cs1501-walk__nav" onClick={goNext} aria-label="Next screen">
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <p className="label cs1501-walk__count" aria-hidden="true">
        {pad(index + 1)} / {pad(count)}
      </p>
      <p className="cs1501-walk__caption" aria-live="polite">
        <strong>{current.name}.</strong> {current.descriptor}
      </p>
    </Reveal>
  );
}

/** One centered clickable carousel for the AI Brain unit's three
 *  examples — replaces what used to be three stacked sections.
 *  Prev/next + a "1 / 3" indicator, no auto-advance; title and
 *  bullets stay synced to the visible slide. Opens the Course
 *  Content Website tab. */
function AiSlideshow({ slides }: { slides: AiSlide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const current = slides[index];

  const goPrev = () => setIndex((i) => (i === 0 ? count - 1 : i - 1));
  const goNext = () => setIndex((i) => (i === count - 1 ? 0 : i + 1));

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      goPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      goNext();
    }
  };

  return (
    <Reveal as="section" className="text-section cs1501-ai">
      <div className="text-section__head">
        <h2 className="text-section__title">Interactive models for understanding AI behavior</h2>
        <div className="text-section__aside cs1501-ai__aside">
          <ul className="label cs1501-ai__points">
            <li>Change one variable.</li>
            <li>Watch the system respond.</li>
            <li>Compare what changes with it.</li>
          </ul>
          <p className="label cs1501-ai__close">Interaction makes the tradeoff easier to see.</p>
        </div>
      </div>
      <div className="text-section__body" data-wide>
        <div className="cs1501-ai__deck" onKeyDown={onKeyDown}>
          <div className="cs1501-walk__stage">
            <button type="button" className="cs1501-walk__nav" onClick={goPrev} aria-label="Previous example">
              <span aria-hidden="true">←</span>
            </button>
            <div className="cs1501-walk__frame mfig__frame cs1501-ai__frame">
              <Media key={index} media={current.media} fit="contain" controls={false} noReducedMotionControl />
            </div>
            <button type="button" className="cs1501-walk__nav" onClick={goNext} aria-label="Next example">
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <p className="label cs1501-walk__count" aria-hidden="true">
            {index + 1} / {count}
          </p>

          <div className="cs1501-ai__text" key={index} aria-live="polite">
            <h3 className="cs1501-ai__title">{current.title}</h3>
            <ul className="ct-bullets">
              {current.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** The specificity ladder and "start with the actual problem" shown
 *  as one paired exhibit — equal-width cards, media atop, title and
 *  bullets underneath. Opens the Course Content Website tab. */
function PromptCards({ cards }: { cards: PromptCard[] }) {
  return (
    <Reveal as="section" className="text-section cs1501-cards">
      <div className="text-section__head">
        <h2 className="text-section__title">From prompting to problem framing</h2>
        <p className="label text-section__aside">
          Two visual exercises shift the question from "What should I tell AI?" to "Which decisions should I
          actually hand over?"
        </p>
      </div>
      <div className="text-section__body" data-wide>
        <div className="cs1501-cards__grid">
          {cards.map((card) => (
            <div className="cs1501-cards__card" key={card.title}>
              <div className="cs1501-cards__frame mfig__frame">
                <Media media={card.media} fit="contain" controls={false} />
              </div>
              <h3 className="cs1501-ai__title">{card.title}</h3>
              <ul className="ct-bullets">
                {card.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/** The right half of the pre-class pair: a custom pipeline diagram
 *  showing a student's intake response actually crossing from the
 *  pre-class site into a live class session. The database sits as the
 *  visual bridge between the two labeled zones, not one more box in a
 *  row — this is the page's one system diagram, so it's built by hand
 *  rather than reused from the generic flow/tree diagram variants,
 *  which can't branch. Sits beside Build Your AI Friend (see
 *  <PreClassSystem />) as the second part of the same pre-class
 *  experience. */
function PreClassDataLoop() {
  return (
    <Reveal as="section" className="cs1501-loop">
      <div className="text-section__head">
        <h2 className="text-section__title">Pre-class intake</h2>
        <p className="label ct-sequence__intro">Part 2 · From intake to classroom</p>
      </div>
      <div className="cs1501-loop__body">
        <p className="text-section__lead ct-sequence__lead">Student input became context for the classroom.</p>
        <p className="ct-sequence__subhead">
          Responses persisted before class, making patterns available for discussion, questions, and live demos.
        </p>

        <div className="cs1501-loop__diagram">
          <p className="label cs1501-loop__zone cs1501-loop__zone--first">Before class</p>

          <div className="cs1501-loop__node">Student</div>
          <span className="cs1501-loop__arrow" aria-hidden="true" />

          <div className="cs1501-loop__node cs1501-loop__node--card">
            <p className="cs1501-loop__node-title">Pre-class intake</p>
            <ul className="cs1501-loop__node-list">
              <li>comfort level</li>
              <li>current AI use</li>
              <li>name</li>
            </ul>
          </div>
          <span className="cs1501-loop__arrow" data-label="save" aria-hidden="true" />

          <div className="cs1501-loop__node cs1501-loop__node--db">
            <p className="label cs1501-loop__db-label">Database</p>
            <div className="cs1501-loop__dots" aria-hidden="true">
              {Array.from({ length: 18 }, (_, i) => (
                <span key={i} />
              ))}
            </div>
            <p className="cs1501-loop__db-note">Responses persist. Nothing here disappears on submit.</p>
          </div>
          <span className="cs1501-loop__arrow" data-label="find patterns" aria-hidden="true" />

          <div className="cs1501-loop__node">Patterns across the class</div>
          <span className="cs1501-loop__arrow" aria-hidden="true" />

          <p className="label cs1501-loop__zone">In the room</p>

          <div className="cs1501-loop__node cs1501-loop__node--room">Live class discussion</div>

          <svg className="cs1501-loop__fan" viewBox="0 0 240 40" preserveAspectRatio="none" aria-hidden="true">
            <line x1="120" y1="0" x2="120" y2="14" />
            <line x1="120" y1="14" x2="24" y2="40" />
            <line x1="120" y1="14" x2="120" y2="40" />
            <line x1="120" y1="14" x2="216" y2="40" />
          </svg>

          <div className="cs1501-loop__branches">
            <div className="cs1501-loop__branch">
              <p className="cs1501-loop__branch-title">Discussion</p>
              <p className="cs1501-loop__branch-text">patterns worth comparing</p>
            </div>
            <div className="cs1501-loop__branch">
              <p className="cs1501-loop__branch-title">Questions</p>
              <p className="cs1501-loop__branch-text">differences worth asking about</p>
            </div>
            <div className="cs1501-loop__branch">
              <p className="cs1501-loop__branch-title">Demos</p>
              <p className="cs1501-loop__branch-text">ideas worth expanding live</p>
            </div>
          </div>
        </div>

        <p className="cs1501-loop__takeaway">
          Students were not only learning about systems that store and reuse information. Before the first class,
          they had already participated in one.
        </p>
      </div>
    </Reveal>
  );
}

/** Build Your AI Friend (left) and the pre-class intake pipeline
 *  (right) as two coordinated parts of one pre-class system. Stacks on
 *  narrow screens. */
function PreClassSystem() {
  return (
    <div className="cs1501-system">
      <div className="cs1501-system__col">
        <CaseStudySections sections={cs1501PreClassTab} />
      </div>
      <div className="cs1501-system__col">
        <PreClassDataLoop />
      </div>
    </div>
  );
}

/** The Course Slides shell: prev/next, a large slide, and per-slide
 *  notes below it. `slides` is empty until real slides are captured
 *  — the shell still works end to end, it just has nothing to show
 *  yet (an obviously-marked <Placeholder />, not invented content). */
function SlidesShow({ slides }: { slides: CourseSlide[] }) {
  const [index, setIndex] = useState(0);
  const count = slides.length;
  const current = count > 0 ? slides[Math.min(index, count - 1)] : null;

  const goPrev = () => setIndex((i) => (count === 0 ? 0 : (i - 1 + count) % count));
  const goNext = () => setIndex((i) => (count === 0 ? 0 : (i + 1) % count));

  return (
    <Reveal as="section" className="text-section cs1501-slides">
      <div className="text-section__head">
        <h2 className="text-section__title">Course slides</h2>
        <p className="label text-section__aside">The slides taught in class, walked in order.</p>
      </div>
      <div className="text-section__body" data-wide>
        <div className="cs1501-walk__stage cs1501-slides__stage">
          <button type="button" className="cs1501-walk__nav" onClick={goPrev} disabled={count === 0} aria-label="Previous slide">
            <span aria-hidden="true">←</span>
          </button>
          <div className="cs1501-walk__frame mfig__frame cs1501-slides__frame">
            {current ? (
              <Media media={current.media} fit="contain" controls={false} />
            ) : (
              <Placeholder file="public/portfolio/cs1501/slides/slide-1.png, slide-2.png, …">
                Slides haven’t been added yet. Drop images in and list them (with their notes) in cs1501Slides.
              </Placeholder>
            )}
          </div>
          <button type="button" className="cs1501-walk__nav" onClick={goNext} disabled={count === 0} aria-label="Next slide">
            <span aria-hidden="true">→</span>
          </button>
        </div>

        <p className="label cs1501-walk__count" aria-hidden="true">
          {count === 0 ? '00 / 00' : `${pad(index + 1)} / ${pad(count)}`}
        </p>

        {count > 1 && (
          <div className="cs1501-slides__dots" role="group" aria-label="Jump to slide">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className="cs1501-slides__dot"
                data-active={i === index || undefined}
                aria-label={`Go to slide ${pad(i + 1)}`}
                aria-current={i === index || undefined}
                onClick={() => setIndex(i)}
              />
            ))}
          </div>
        )}

        {current && (
          <div className="cs1501-slides__notes" aria-live="polite">
            <p className="label cs1501-slides__notes-label">Why it's in the deck</p>
            {current.bullets.length ? (
              <ul className="ct-bullets">
                {current.bullets.map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            ) : (
              <Placeholder>Notes for this slide will go here.</Placeholder>
            )}
          </div>
        )}
      </div>
    </Reveal>
  );
}

export default function Cs1501() {
  const [active, setActive] = useState(0);

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = TABS.length - 1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((i) => (i === last ? 0 : i + 1));
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (i === 0 ? last : i - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      setActive(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      setActive(last);
    }
  };

  return (
    <article className="cs-cs1501">
      <header className="cs1501-hero">
        <div className="wrap cs1501-hero__inner">
          <div className="cs1501-hero__scene" aria-hidden="true">
            <span className="cs1501-hero__frag cs1501-hero__frag--a">const course = "CS 1501";</span>
            <span className="cs1501-hero__frag cs1501-hero__frag--b">teach(behavior, not just output)</span>
            <span className="cs1501-hero__frag cs1501-hero__frag--c">{'>'} building_with_ai --live</span>
            <svg className="cs1501-hero__lines" viewBox="0 0 600 40" preserveAspectRatio="none">
              <line x1="30" y1="30" x2="570" y2="30" />
              <circle cx="30" cy="30" r="3" />
              <circle cx="300" cy="30" r="3" />
              <circle cx="570" cy="30" r="3" />
            </svg>
          </div>

          <p className="label cs1501-hero__eyebrow">
            <span className="cs1501-hero__prompt" aria-hidden="true">
              {'>'}
            </span>{' '}
            CS 1501
            <span className="cs1501-hero__cursor" aria-hidden="true" />
          </p>
          <h1 className="cs1501-hero__title">
            Building Software <em className="cs1501-hero__title-with">with</em> AI Systems
          </h1>
        </div>
      </header>

      <nav className="cs1501-tabnav" aria-label="CS 1501 sections">
        <div className="wrap">
          <div className="ct-tabs__list cs1501-tabnav__list" role="tablist" aria-label="CS 1501 artifacts" onKeyDown={onKeyDown}>
            {TABS.map((tab, i) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`cs1501-tab-${i}`}
                aria-selected={i === active}
                aria-controls="cs1501-tabpanel"
                tabIndex={i === active ? 0 : -1}
                className="ct-tabs__tab"
                data-active={i === active || undefined}
                onClick={() => setActive(i)}
              >
                <span className="cs1501-tabnav__index" aria-hidden="true">
                  {pad(i + 1)}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <div className="wrap project-body">
        <div
          id="cs1501-tabpanel"
          role="tabpanel"
          aria-labelledby={`cs1501-tab-${active}`}
          tabIndex={0}
          className="cs1501-tabpanel"
        >
          {active === 0 && (
            <>
              <CaseStudySections sections={cs1501ContentIntro} />
              <AiSlideshow slides={cs1501AiSlides} />
              <PromptCards cards={cs1501PromptCards} />
              <CaseStudySections sections={cs1501ContentClosing} />
            </>
          )}
          {active === 1 && <SlidesShow slides={cs1501Slides} />}
          {active === 2 && (
            <>
              <PreClassWalkthrough steps={cs1501WalkthroughSteps} />
              <PreClassSystem />
            </>
          )}
        </div>
      </div>

      <NextProject from="cs1501" />
    </article>
  );
}
