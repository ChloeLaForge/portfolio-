import { Fragment, useEffect, useRef, useState } from 'react';
import type {
  ArchitectureSplitSection,
  ArchTreeNode,
  Bullet,
  CaptionCopy,
  CaseStudy as CaseStudyData,
  CaseStudySection,
  ComparisonSection,
  ContextChip,
  ContextModelSection,
  ContextSection,
  DiagramSection,
  DualMediaSection,
  FeatureOverviewSection,
  MediaScale,
  MediaSection,
  MediaTextSection,
  OperatingState,
  PrinciplesSection,
  SequenceCue,
  SequenceSection,
  StatementSection,
  SystemModelSection,
  TabPanel,
  TabsSection,
  TextSection,
} from '../content/case-studies/types';
import { Media } from './Media';
import { Reveal } from './Reveal';
import './case-study.css';

/* ============================================================
   CASE STUDY
   Renders a project's ordered section data. Every media block is
   a silent product-demo loop: no controls, contain-fit so no
   application UI is cropped, and a per-section scale so the page
   has rhythm rather than one uniform size.
   ============================================================ */

function Caption({ caption }: { caption?: CaptionCopy }) {
  if (!caption) return null;
  return (
    <figcaption className="caption">
      <strong>{caption.lead}</strong>
      {caption.text}
    </figcaption>
  );
}

/** The one wrapper for a demo figure. Product-demo defaults:
 *  contain fit, no controls, 2× handled inside <Media>. */
export function MediaFigure({
  media,
  scale = 'normal',
  aspect,
  fit = 'contain',
  caption,
  mediaKey,
  loop,
  onEnded,
}: {
  media: MediaSection['media'];
  scale?: MediaScale;
  aspect?: string;
  fit?: 'cover' | 'contain';
  caption?: CaptionCopy;
  /** Remounts just the media (not the figure's reveal) when it changes —
   *  so a swapped-in clip starts and plays from the top. */
  mediaKey?: string | number;
  loop?: boolean;
  onEnded?: () => void;
}) {
  return (
    <Reveal as="figure" className="mfig" data-scale={scale}>
      <div className="mfig__frame">
        <Media key={mediaKey} media={media} aspect={aspect} fit={fit} controls={false} loop={loop} onEnded={onEnded} />
      </div>
      <Caption caption={caption} />
    </Reveal>
  );
}

/** A short, scannable list — a dash marker, not a disc. Used under
 *  text, statement and media+text bodies to keep the page fast. A
 *  bullet may be plain text or a bold lead-in + line, for lists meant
 *  to be skimmed by their lead-ins first. */
function Bullets({ items }: { items?: Bullet[] }) {
  if (!items?.length) return null;
  return (
    <ul className="ct-bullets">
      {items.map((b, i) => (
        <li key={i}>
          {typeof b === 'string' ? (
            b
          ) : (
            <>
              <strong className="ct-bullets__lead">{b.lead}</strong> {b.text}
            </>
          )}
        </li>
      ))}
    </ul>
  );
}

function TextBlock({ section }: { section: TextSection }) {
  return (
    <Reveal as="section" className="text-section">
      <div className="text-section__head">
        <h2 className="text-section__title">{section.heading}</h2>
      </div>
      <div className="text-section__body">
        {section.lead && <p className="text-section__lead">{section.lead}</p>}
        {section.body?.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <Bullets items={section.bullets} />
      </div>
    </Reveal>
  );
}

function ComparisonBlock({ section }: { section: ComparisonSection }) {
  return (
    <Reveal as="section" className="text-section ct-compare">
      <div className="text-section__head">
        <h2 className="text-section__title">{section.heading}</h2>
      </div>
      <ol className="ct-compare__grid" data-cols={section.columns.length}>
        {section.columns.map((col, i) => (
          <li className="ct-compare__col" key={col.label} data-last={i === section.columns.length - 1 || undefined}>
            {col.eyebrow && <p className="label ct-compare__eyebrow">{col.eyebrow}</p>}
            <p className="label ct-compare__label">{col.label}</p>
            <p className="ct-compare__text">{col.text}</p>
            {col.tags?.length ? <p className="label ct-compare__tags">{col.tags.join(' · ')}</p> : null}
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/** The project-framing beat between the opening hook and the detailed
 *  sections: one claim, one line of body copy, 2–4 short labelled
 *  points, and the hero's Focus / Context metadata folded in rather
 *  than left to occupy the opening viewport. */
function ContextBlock({ section }: { section: ContextSection }) {
  return (
    <Reveal as="section" className="text-section ct-context">
      <div className="text-section__head">
        <h2 className="text-section__title">{section.heading}</h2>
      </div>
      <div className="text-section__body">
        {section.lead && <p className="text-section__lead">{section.lead}</p>}
        {section.body?.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <ul className="ct-context__points">
          {section.points.map((point) => (
            <li className="ct-context__point" key={point.label}>
              <p className="label ct-context__point-label">{point.label}</p>
              <p className="ct-context__point-text">{point.text}</p>
            </li>
          ))}
        </ul>
        {section.meta?.length ? (
          <dl className="ct-context__meta">
            {section.meta.map((row) => (
              <div className="ct-context__meta-row" key={row.label}>
                <dt className="label">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        ) : null}
      </div>
    </Reveal>
  );
}

function StatementBlock({ section }: { section: StatementSection }) {
  const body = (
    <div className="ct-statement__body">
      <p className="ct-statement__line">{section.text}</p>
      <Bullets items={section.bullets} />
    </div>
  );

  if (!section.heading) {
    return (
      <Reveal as="section" className="ct-statement ct-statement--bare" data-closing={section.closing || undefined}>
        {body}
      </Reveal>
    );
  }

  return (
    <Reveal as="section" className="text-section ct-statement" data-closing={section.closing || undefined}>
      <div className="text-section__head">
        <h2 className="text-section__title">{section.heading}</h2>
      </div>
      {body}
    </Reveal>
  );
}

/** One image of the compass composition — a minimal label/descriptor
 *  pair sits with the frame rather than a heavy standalone text block. */
function CompassItem({
  item,
  position,
}: {
  item: FeatureOverviewSection['items'][number];
  position: 'top' | 'left' | 'right' | 'bottom';
}) {
  return (
    <figure className="ct-overview__compass-item" data-position={position}>
      <div className="ct-overview__compass-frame">
        <Media media={item.media} fit="contain" controls={false} noReducedMotionControl />
      </div>
      <figcaption className="ct-overview__compass-caption">
        <span className="label">{item.name}</span>
        <span className="ct-overview__compass-desc">{item.descriptor}</span>
      </figcaption>
    </figure>
  );
}

function FeatureOverviewBlock({ section }: { section: FeatureOverviewSection }) {
  if (section.layout === 'compass') {
    const [top, left, right, bottom] = section.items;
    return (
      <Reveal as="section" className="ct-overview ct-overview--compass">
        <div className="ct-overview__compass">
          <div className="ct-overview__compass-center">
            <h2 className="ct-overview__compass-heading">{section.heading}</h2>
            {section.lead && <p className="ct-overview__compass-lead">{section.lead}</p>}
          </div>
          <CompassItem item={top} position="top" />
          <CompassItem item={left} position="left" />
          <CompassItem item={right} position="right" />
          <CompassItem item={bottom} position="bottom" />
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal as="section" className="ct-overview">
      <div className="text-section__head">
        <h2 className="text-section__title">{section.heading}</h2>
      </div>
      <div className="ct-overview__body">
        {section.lead && <p className="text-section__lead">{section.lead}</p>}
        <ul className="ct-overview__grid" data-count={section.items.length}>
          {section.items.map((item) => (
            <li className="ct-overview__item" key={item.name}>
              <div className="ct-overview__frame">
                <Media media={item.media} fit="cover" controls={false} noReducedMotionControl />
              </div>
              <p className="label ct-overview__name">{item.name}</p>
              <p className="ct-overview__desc">{item.descriptor}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function Diagram({ section }: { section: DiagramSection }) {
  const { variant } = section;
  return (
    <div className={`ct-diagram ct-diagram--${variant}`}>
      {variant === 'layers' && (
        <ol className="ct-diagram__layers">
          {section.bands?.map((band) => (
            <li className="ct-diagram__band" key={band.label}>
              <p className="label ct-diagram__band-label">{band.label}</p>
              <ul className="ct-diagram__chips">
                {band.items.map((it) => (
                  <li key={it}>{it}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}

      {variant === 'flow' && (
        <ol className="ct-diagram__flow" data-numbered={section.numbered || undefined}>
          {section.nodes?.map((node, i) => (
            <li className="ct-diagram__node" key={node.label}>
              {section.numbered && (
                <span className="label ct-diagram__node-index">{String(i + 1).padStart(2, '0')}</span>
              )}
              <span className="ct-diagram__node-label">{node.label}</span>
              {node.sub && <span className="ct-diagram__node-sub">{node.sub}</span>}
            </li>
          ))}
        </ol>
      )}

      {variant === 'map' && (
        <ol className="ct-diagram__map">
          {section.rows?.map((row) => (
            <li className="ct-diagram__row" key={row.from}>
              <span className="ct-diagram__from">{row.from}</span>
              <span className="ct-diagram__to">{row.to}</span>
            </li>
          ))}
        </ol>
      )}

      {variant === 'tree' && (
        <div className="ct-diagram__tree">
          <p className="ct-diagram__tree-root">{section.root}</p>
          <ul>
            {section.children?.map((child, i) => (
              <li key={child} data-last={i === (section.children?.length ?? 0) - 1 || undefined}>
                <span aria-hidden="true" className="ct-diagram__tree-branch">
                  {i === (section.children?.length ?? 0) - 1 ? '└──' : '├──'}
                </span>
                {child}
              </li>
            ))}
          </ul>
        </div>
      )}

      {section.note && <p className="ct-diagram__note">{section.note}</p>}
    </div>
  );
}

function DiagramBlock({ section }: { section: DiagramSection }) {
  if (!section.heading && !section.intro) {
    return (
      <Reveal as="section" className="ct-diagram-section ct-diagram-section--bare">
        <Diagram section={section} />
      </Reveal>
    );
  }
  return (
    <Reveal as="section" className="text-section ct-diagram-section">
      <div className="text-section__head">
        {section.heading && <h2 className="text-section__title">{section.heading}</h2>}
        {section.intro && <p className="label text-section__aside">{section.intro}</p>}
      </div>
      <div className="ct-diagram-section__body">
        <Diagram section={section} />
      </div>
    </Reveal>
  );
}

function PrinciplesBlock({ section }: { section: PrinciplesSection }) {
  return (
    <Reveal as="section" className="text-section ct-principles">
      <div className="text-section__head">
        <h2 className="text-section__title">{section.heading}</h2>
      </div>
      <ol className="ct-principles__grid">
        {section.items.map((item, i) => (
          <li className="ct-principles__item" key={item}>
            <span className="label ct-principles__index">{String(i + 1).padStart(2, '0')}</span>
            <span className="ct-principles__text">{item}</span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

function MediaBlock({ section }: { section: MediaSection }) {
  return (
    <MediaFigure
      media={section.media}
      scale={section.scale}
      aspect={section.aspect}
      fit={section.fit}
      caption={section.caption}
    />
  );
}

function MediaTextBlock({ section }: { section: MediaTextSection }) {
  return (
    <Reveal
      as="section"
      className="ct-mediatext"
      data-side={section.side ?? 'right'}
      data-emphasis={section.emphasis}
    >
      <div className="ct-mediatext__text">
        {section.heading && <h2 className="text-section__title">{section.heading}</h2>}
        {section.intro && <p className="label ct-mediatext__intro">{section.intro}</p>}
        {section.lead && <p className="text-section__lead">{section.lead}</p>}
        {section.body.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <Bullets items={section.bullets} />
        {section.takeaway && <p className="ct-mediatext__takeaway">{section.takeaway}</p>}
        {section.steps?.length ? (
          <ol className="ct-mediatext__steps">
            {section.steps.map((step, i) => (
              <li className="ct-mediatext__step" key={step.title}>
                <span className="label ct-mediatext__step-index">{String(i + 1).padStart(2, '0')}</span>
                <div className="ct-mediatext__step-content">
                  <h3 className="ct-mediatext__step-title">{step.title}</h3>
                  <p className="ct-mediatext__step-body">{step.body}</p>
                </div>
              </li>
            ))}
          </ol>
        ) : null}
        {section.link && (
          <a
            className="ct-mediatext__link"
            href={section.link.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {section.link.label}
          </a>
        )}
        {section.compare && (
          <div className="ct-mediatext__compare">
            <ul className="ct-mediatext__compare-rows">
              {section.compare.rows.map((row) => (
                <li key={row.label}>
                  {row.eyebrow && <span className="label ct-mediatext__compare-eyebrow">{row.eyebrow}</span>}
                  <span className="label ct-mediatext__compare-label">{row.label}</span>
                  <span className="ct-mediatext__compare-text">{row.text}</span>
                </li>
              ))}
            </ul>
            <div className="ct-mediatext__compare-opportunity">
              <span className="label">{section.compare.opportunity.label}</span>
              <p>{section.compare.opportunity.text}</p>
              {section.compare.opportunity.tags?.length ? (
                <p className="label ct-mediatext__compare-tags">{section.compare.opportunity.tags.join(' · ')}</p>
              ) : null}
            </div>
          </div>
        )}
      </div>
      <figure className="ct-mediatext__media">
        {section.mediaLabel && <p className="label ct-mediatext__media-label">{section.mediaLabel}</p>}
        <div className="mfig__frame">
          <Media
            media={section.media}
            aspect={section.aspect}
            fit={section.fit ?? 'contain'}
            controls={false}
          />
        </div>
        <Caption caption={section.caption} />
        {section.annotation && <p className="label ct-mediatext__annotation">{section.annotation}</p>}
      </figure>
    </Reveal>
  );
}

function DualMediaBlock({ section }: { section: DualMediaSection }) {
  const { left } = section;
  const hasLeftHead = left.intro || left.heading || left.lead;
  const hasLeftFoot = left.belowHeading || left.belowText;
  return (
    <Reveal as="section" className="ct-dual">
      <div className="ct-dual__grid">
        <div className="ct-dual__left">
          <div className="text-section__head">
            <h2 className="text-section__title">{section.heading}</h2>
            {section.intro && <p className="label ct-sequence__intro">{section.intro}</p>}
          </div>
          {section.lead && <p className="text-section__lead">{section.lead}</p>}
          {section.body?.map((p, i) => (
            <p key={i} className="ct-dual__para">
              {p}
            </p>
          ))}
          <Bullets items={section.bullets} />
          {hasLeftHead && (
            <div className="ct-dual__left-text">
              {left.intro && <p className="label ct-dual__left-intro">{left.intro}</p>}
              {left.heading && <h3 className="ct-sequence__title">{left.heading}</h3>}
              {left.lead && <p className="ct-dual__left-lead">{left.lead}</p>}
            </div>
          )}
          {left.media && <MediaFigure media={left.media} aspect={left.aspect} scale="inset" />}
          {left.arrow && (
            <p className="ct-dual__arrow">
              <span className="ct-dual__arrow-glyph" aria-hidden="true">
                →
              </span>
              <span className="sr-only">Becomes the media on the right</span>
            </p>
          )}
          {hasLeftFoot && (
            <div className="ct-dual__left-text">
              {left.belowHeading && <h3 className="ct-sequence__title">{left.belowHeading}</h3>}
              {left.belowText && <p className="ct-dual__left-lead">{left.belowText}</p>}
            </div>
          )}
        </div>
        <div className="ct-dual__right">
          {section.items.map((item, i) => (
            <MediaFigure key={i} media={item.media} caption={item.caption} />
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/** A small persistent chip chain — reinforces a section's through-line
 *  (a resident request, an account's setup path) without becoming a
 *  real diagram. Renders inline, wraps on mobile, adds no meaningful
 *  height. */
function SequenceCueStrip({ cue }: { cue: SequenceCue }) {
  return (
    <div className="ct-sequence__cue" aria-hidden="true">
      {cue.steps.map((step, i) => (
        <Fragment key={step.label}>
          {i > 0 && (
            <span className="ct-sequence__cue-arrow" aria-hidden="true">
              →
            </span>
          )}
          <span className="ct-sequence__cue-chip" data-tone={step.tone ?? 'neutral'}>
            {step.label}
          </span>
        </Fragment>
      ))}
    </div>
  );
}

function SequenceBlock({ section }: { section: SequenceSection }) {
  const side = section.stepLayout === 'side';
  return (
    <Reveal as="section" id={section.id} className="ct-sequence" data-step-layout={section.stepLayout}>
      <div className="text-section__head">
        <h2 className="text-section__title">{section.heading}</h2>
        {section.intro && <p className="label ct-sequence__intro">{section.intro}</p>}
      </div>
      <div className="ct-sequence__body">
        {section.lead && <p className="text-section__lead ct-sequence__lead">{section.lead}</p>}
        {section.principle && <p className="ct-sequence__principle">{section.principle}</p>}
        {section.body?.map((p, i) => (
          <p key={i} className="ct-sequence__subhead">
            {p}
          </p>
        ))}
        <Bullets items={section.bullets} />
        {section.cue && <SequenceCueStrip cue={section.cue} />}
        {section.media && (
          <MediaFigure
            media={section.media}
            scale={section.mediaScale}
            aspect={section.aspect}
            fit={section.fit}
            caption={section.caption}
          />
        )}
        <ol className="ct-sequence__steps">
          {section.steps.map((step, i) => (
            <li className="ct-sequence__step" key={step.title}>
              <span className="label ct-sequence__index">{String(i + 1).padStart(2, '0')}</span>
              <div className="ct-sequence__content">
                <div className="ct-sequence__content-text">
                  {step.eyebrow && <p className="label ct-sequence__step-eyebrow">{step.eyebrow}</p>}
                  <h3 className="ct-sequence__title">{step.title}</h3>
                  {step.body.map((p, j) => (
                    <p key={j} className="ct-sequence__para">
                      {p}
                    </p>
                  ))}
                  <Bullets items={step.bullets} />
                </div>
                {step.media && (
                  <div className="ct-sequence__content-media">
                    <MediaFigure
                      media={step.media}
                      scale={side ? undefined : step.mediaScale}
                      aspect={step.aspect}
                      fit={step.fit}
                      caption={step.caption}
                    />
                  </div>
                )}
              </div>
            </li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

/** The consulting-case tab's compact visual: a small node ring
 *  (optionally routed through a center chip — plain for a manual
 *  hub, emphasized for the operating system itself) or a vertical
 *  knowledge flow with a protected-boundary divider. Chips and
 *  hairlines only — no diagram library, no meaningful added height. */
function OperatingStateStrip({ state }: { state: OperatingState }) {
  return (
    <div className="ct-tabs__opstate" data-connection={state.connection}>
      {state.nodes?.length ? (
        <div className="ct-tabs__opstate-row">
          {state.nodes.map((node) => (
            <span key={node.label} className="ct-tabs__opstate-node" data-tone={node.tone}>
              {node.label}
            </span>
          ))}
        </div>
      ) : null}
      {state.center && <span className="ct-tabs__opstate-center">{state.center}</span>}
      {state.flow?.length ? (
        <ol className="ct-tabs__opstate-flow">
          {state.flow.map((step, i) => (
            <li key={step}>
              {i > 0 && (
                <span className="ct-tabs__opstate-flow-arrow" aria-hidden="true">
                  ↓
                </span>
              )}
              <span className="ct-tabs__opstate-flow-step">{step}</span>
            </li>
          ))}
        </ol>
      ) : null}
      {state.boundary && (
        <div className="ct-tabs__opstate-boundary">
          <span className="ct-tabs__opstate-boundary-guidance">{state.boundary.left}</span>
          <span className="ct-tabs__opstate-boundary-divider" aria-hidden="true" />
          <span className="ct-tabs__opstate-boundary-authority">{state.boundary.right}</span>
        </div>
      )}
    </div>
  );
}

/** How often the "tree" variant's mockups auto-advance, and how long
 *  after a manual click before the visitor can reasonably be assumed
 *  to have moved on. Deliberately slow — this teaches, it doesn't
 *  animate for its own sake. */
const TABS_AUTO_MS = 4000;

/** Slow, readable auto-cycle interval shared by the context-model demo
 *  and the closing system-model exhibit — teaches the mechanism
 *  without feeling like an animation. */
const AUTO_CYCLE_MS = 3400;

/** A small, visually-secondary switch for an auto-cycling demo —
 *  "Auto trace [On]" / "Auto preview [On]". Sits beside the demo's
 *  own instructional hint, never centered over the visualization. */
function AutoToggle({ label, on, onToggle }: { label: string; on: boolean; onToggle: () => void }) {
  return (
    <button type="button" className="ct-autotoggle" data-on={on || undefined} aria-pressed={on} onClick={onToggle}>
      <span className="ct-autotoggle__label">{label}</span>
      <span className="ct-autotoggle__switch" aria-hidden="true">
        <span className="ct-autotoggle__knob" />
      </span>
      <span className="ct-autotoggle__state">{on ? 'On' : 'Off'}</span>
    </button>
  );
}

/** Slow interval for the knowledge tabs' AUTO mode — each access level
 *  holds long enough to read its bullets and catch the clip. */
const TABS_CYCLE_MS = 6500;

/** A compact AUTO / MANUAL segmented switch (Barclay's two explorers).
 *  Same mono/pill language as <AutoToggle>, but the two states are named
 *  outright so neither reads as "off". */
function ModeToggle({ auto, onChange, label }: { auto: boolean; onChange: (auto: boolean) => void; label: string }) {
  return (
    <div className="ct-modetoggle" role="group" aria-label={label}>
      <button
        type="button"
        className="ct-modetoggle__opt"
        data-active={auto || undefined}
        aria-pressed={auto}
        onClick={() => onChange(true)}
      >
        Auto
      </button>
      <button
        type="button"
        className="ct-modetoggle__opt"
        data-active={!auto || undefined}
        aria-pressed={!auto}
        onClick={() => onChange(false)}
      >
        Manual
      </button>
    </div>
  );
}

/** True while `ref`'s element is meaningfully on screen — auto modes only
 *  run then, so a demo never advances unseen. */
function useInView(ref: React.RefObject<Element>, threshold = 0.3) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [ref, threshold]);
  return inView;
}

/** A short interactive tab group. 'nodes' is a compact consulting
 *  chain of claims (no media); 'panel' is a labelled strip over a
 *  media+bullets panel. Both use the standard WAI-ARIA tabs pattern
 *  with roving arrow-key navigation, so either works from keyboard
 *  alone. `autoAdvance` (the 'tree' variant only) quietly cycles the
 *  tabs until the visitor interacts or switches it off. */
function TabsBlock({ section }: { section: TabsSection }) {
  const [active, setActive] = useState(section.defaultIndex ?? 0);
  const baseId = `tabs-${section.id}`;
  const [autoOn, setAutoOn] = useState(Boolean(section.autoAdvance || section.videoSequence));
  const [hovering, setHovering] = useState(false);
  const [interacted, setInteracted] = useState(false);
  const [cycleOn, setCycleOn] = useState(Boolean(section.autoCycle));
  const [cycleHold, setCycleHold] = useState(false);
  const interactiveRef = useRef<HTMLDivElement>(null);
  const inView = useInView(interactiveRef);

  useEffect(() => {
    if (section.autoCycle && window.matchMedia('(prefers-reduced-motion: reduce)').matches) setCycleOn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!section.autoCycle || !cycleOn || !inView || cycleHold) return;
    const last = section.tabs.length - 1;
    const id = window.setTimeout(() => setActive((i) => (i === last ? 0 : i + 1)), TABS_CYCLE_MS);
    return () => window.clearTimeout(id);
  }, [section.autoCycle, section.tabs.length, cycleOn, inView, cycleHold, active]);

  useEffect(() => {
    if (!section.autoAdvance && !section.videoSequence) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAutoOn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!section.autoAdvance || !autoOn || hovering) return;
    const last = section.tabs.length - 1;
    const id = window.setInterval(() => {
      setActive((i) => (i === last ? 0 : i + 1));
    }, TABS_AUTO_MS);
    return () => window.clearInterval(id);
  }, [section.autoAdvance, section.tabs.length, autoOn, hovering]);

  const selectTab = (i: number) => {
    setActive(i);
    setInteracted(true);
    if (section.autoAdvance || section.videoSequence) setAutoOn(false);
    if (section.autoCycle) setCycleOn(false);
  };

  // Video sequence: the finished clip's own `ended` event (never a timer)
  // hands the stage to the next tab, wrapping back to the first.
  const advanceOnEnded = () => setActive((i) => (i === section.tabs.length - 1 ? 0 : i + 1));

  const onKeyDown = (e: React.KeyboardEvent) => {
    const last = section.tabs.length - 1;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault();
      selectTab(active === last ? 0 : active + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault();
      selectTab(active === 0 ? last : active - 1);
    } else if (e.key === 'Home') {
      e.preventDefault();
      selectTab(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      selectTab(last);
    }
  };

  const current = section.tabs[active];
  const split = section.variant === 'panel' && Boolean(section.videoSequence);
  const Main: React.ElementType = split ? 'div' : Fragment;

  const tablist = (
    <div
      className="ct-tabs__list"
      role="tablist"
      aria-label={section.heading ?? section.intro}
      data-pristine={(section.showTabArrows && !interacted) || undefined}
      onKeyDown={onKeyDown}
    >
      {section.tabs.map((tab, i) => (
        <button
          key={tab.label}
          type="button"
          role="tab"
          id={`${baseId}-tab-${i}`}
          aria-selected={i === active}
          aria-controls={`${baseId}-panel-${i}`}
          tabIndex={i === active ? 0 : -1}
          className="ct-tabs__tab"
          data-active={i === active || undefined}
          data-tone={section.variant === 'tree' ? tab.mockup : undefined}
          onClick={() => selectTab(i)}
          onFocus={section.autoAdvance ? () => setHovering(true) : undefined}
          onBlur={section.autoAdvance ? () => setHovering(false) : undefined}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );

  return (
    <Reveal as="section" className={`ct-tabs ct-tabs--${section.variant}${section.autoCycle ? ' ct-tabs--cycle' : ''}${split ? ' ct-tabs--split' : ''}`}>
      <Main {...(split ? { className: 'ct-tabs__split-main' } : {})}>
      {(section.heading || section.intro) && (
        <div className="text-section__head">
          {section.heading && <h2 className="text-section__title">{section.heading}</h2>}
          {section.intro && <p className="label text-section__aside">{section.intro}</p>}
        </div>
      )}
      {section.lead && <p className="text-section__lead ct-tabs__lead">{section.lead}</p>}
      {section.body?.map((p, i) => (
        <p key={i} className="ct-tabs__body">
          {p}
        </p>
      ))}

      {section.tabsCue || section.autoAdvance || section.videoSequence ? (
        <div className="ct-cue-row">
          <p className="ct-cue-text">
            {section.tabsHint && <span className="label">{section.tabsHint}</span>}
            {section.tabsCue && (
              <span className="ct-cue-accent">
                {section.tabsHint ? ' · ' : ''}
                {section.tabsCue}
                <span className="ct-cue-arrow" aria-hidden="true">
                  ↓
                </span>
              </span>
            )}
          </p>
          {(section.autoAdvance || section.videoSequence) && (
            <AutoToggle label="Auto preview" on={autoOn} onToggle={() => setAutoOn((v) => !v)} />
          )}
        </div>
      ) : (
        section.tabsHint &&
        (section.autoCycle ? (
          <p className="label ct-tabs__hint ct-tabs__hint--cue">
            {section.tabsHint}
            <span className="ct-cue-arrow" aria-hidden="true">
              ↓
            </span>
          </p>
        ) : (
          <p className="label ct-tabs__hint">{section.tabsHint}</p>
        ))
      )}
      <div
        ref={interactiveRef}
        className="ct-tabs__interactive"
        onMouseEnter={section.autoAdvance ? () => setHovering(true) : section.autoCycle ? () => setCycleHold(true) : undefined}
        onMouseLeave={section.autoAdvance ? () => setHovering(false) : section.autoCycle ? () => setCycleHold(false) : undefined}
        onFocus={section.autoCycle ? () => setCycleHold(true) : undefined}
        onBlur={section.autoCycle ? () => setCycleHold(false) : undefined}
      >
        {section.autoCycle ? (
          <div className="ct-tabs__bar">
            {tablist}
            <ModeToggle
              label={`${section.heading ?? 'Tabs'} mode`}
              auto={cycleOn}
              onChange={setCycleOn}
            />
          </div>
        ) : (
          tablist
        )}

        <div
          id={`${baseId}-panel-${active}`}
          role="tabpanel"
          aria-labelledby={`${baseId}-tab-${active}`}
          tabIndex={0}
          className="ct-tabs__panel"
        >
        {section.variant === 'nodes' ? (
          <>
            {current.operatingState && <OperatingStateStrip state={current.operatingState} />}
            <div className="ct-tabs__node-body">
              {current.heading && <p className="ct-tabs__node-claim">{current.heading}</p>}
              {current.text && <p className="ct-tabs__node-support">{current.text}</p>}
            </div>
          </>
        ) : section.variant === 'tree' ? (
          <div className="ct-tabs__tree-body">
            <div className="ct-tabs__tree-text">
              {current.heading && <h3 className="ct-sequence__title">{current.heading}</h3>}
              {current.text && <p className="ct-tabs__node-support">{current.text}</p>}
              {current.supportLine && <p className="ct-tabs__support-line">{current.supportLine}</p>}
              <Bullets items={current.bullets} />
            </div>
            {current.mockup ? (
              <ConceptMockup kind={current.mockup} />
            ) : current.tree ? (
              <div className="ct-arch-tree ct-tabs__tree">
                <p className="ct-arch-tree__root">{current.tree.label}</p>
                {current.tree.children?.length ? (
                  <ul>
                    {current.tree.children.map((child, i) => (
                      <ArchTreeItem
                        key={child.label}
                        node={child}
                        isLast={i === current.tree!.children!.length - 1}
                      />
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <TabPanelBlock key={section.autoCycle ? active : undefined} tab={current} hideMedia={split} />
        )}
        </div>
      </div>

      {section.footnote && <p className="ct-tabs__footnote">{section.footnote}</p>}
      {section.closing && (
        <div className="ct-tabs__closing">
          {section.closing.label && <p className="label ct-tabs__closing-label">{section.closing.label}</p>}
          {section.closing.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      )}
      </Main>
      {split && current.media && (
        <div className="ct-tabs__split-media">
          <MediaFigure
            media={current.media}
            aspect={current.aspect}
            fit={current.fit}
            caption={current.caption}
            mediaKey={active}
            loop={!autoOn}
            onEnded={autoOn ? advanceOnEnded : undefined}
          />
        </div>
      )}
    </Reveal>
  );
}

/** The 'panel' variant's tab body: media + bullets, with an optional
 *  embedded configurable/system-controlled comparison. */
function TabPanelBlock({ tab, hideMedia = false }: { tab: TabPanel; hideMedia?: boolean }) {
  return (
    <div className="ct-tabs__panel-grid">
      <div className="ct-tabs__panel-text">
        {tab.heading && <h3 className="ct-sequence__title">{tab.heading}</h3>}
        {tab.text && <p className="ct-tabs__panel-text-body">{tab.text}</p>}
        <Bullets items={tab.bullets} />
        {tab.comparison?.length ? (
          <ol className="ct-compare__grid ct-tabs__compare" data-cols={tab.comparison.length}>
            {tab.comparison.map((col, i) => (
              <li
                className="ct-compare__col"
                key={col.label}
                data-last={i === tab.comparison!.length - 1 || undefined}
              >
                <p className="label ct-compare__label">{col.label}</p>
                <p className="ct-compare__text">{col.text}</p>
              </li>
            ))}
          </ol>
        ) : null}
      </div>
      {tab.media && !hideMedia && (
        <MediaFigure media={tab.media} aspect={tab.aspect} fit={tab.fit} caption={tab.caption} />
      )}
    </div>
  );
}

/** One node of the recursive object-model tree. Indentation and branch
 *  glyphs come from CSS/depth alone, so any nesting depth just works.
 *  `tone` sets a `--tone-color` custom property that cascades to every
 *  descendant label, so only a branch's own top node needs it. A node
 *  with an `id` is a real button, linked (by that shared id) to its
 *  authoritative-owner row — hovering/focusing either emphasizes both. */
function ArchTreeItem({
  node,
  isLast,
  activeId = null,
  onHover,
  onLeave,
}: {
  node: ArchTreeNode;
  isLast: boolean;
  /** Omitted entirely on a static illustrative tree (no hover-link). */
  activeId?: string | null;
  onHover?: (id: string) => void;
  onLeave?: (id: string) => void;
}) {
  const style = node.tone ? ({ '--tone-color': `var(--bw-${node.tone})` } as React.CSSProperties) : undefined;
  return (
    <li data-last={isLast || undefined} data-tone={node.tone} style={style}>
      <span className="ct-arch-tree__branch" aria-hidden="true">
        {isLast ? '└──' : '├──'}
      </span>
      {node.id ? (
        <button
          type="button"
          className="ct-arch-tree__label ct-arch-tree__label--linked"
          data-active={activeId === node.id || undefined}
          data-dimmed={(activeId != null && activeId !== node.id) || undefined}
          onMouseEnter={() => onHover?.(node.id!)}
          onMouseLeave={() => onLeave?.(node.id!)}
          onFocus={() => onHover?.(node.id!)}
          onBlur={() => onLeave?.(node.id!)}
        >
          {node.label}
        </button>
      ) : (
        <span className="ct-arch-tree__label">{node.label}</span>
      )}
      {node.children?.length ? (
        <ul>
          {node.children.map((child, i) => (
            <ArchTreeItem
              key={child.label}
              node={child}
              isLast={i === node.children!.length - 1}
              activeId={activeId}
              onHover={onHover}
              onLeave={onLeave}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

/** The closing "how the model fits together" exhibit: the expanded
 *  object tree beside the authoritative-owner map, read as one
 *  architecture explanation side by side on desktop. A branch and its
 *  matching owners row share an id; hovering or focusing either one
 *  emphasizes both, so the correspondence reads without a legend. */
function ArchitectureSplitBlock({ section }: { section: ArchitectureSplitSection }) {
  const [hovered, setActive] = useState<string | null>(null);
  const onHover = (id: string) => setActive(id);
  const onLeave = (id: string) => setActive((a) => (a === id ? null : a));

  /* AUTO (opt-in): walk the linked relationships in owners-list order by
     feeding `active` — the same value hover sets — so the tree and rows
     react exactly as they do under a pointer. A pointer inside the exhibit
     pauses the loop and hover takes over; MANUAL stops it outright. */
  const [autoOn, setAutoOn] = useState(Boolean(section.autoCycle));
  const [autoIndex, setAutoIndex] = useState(0);
  const [pointerOver, setPointerOver] = useState(false);
  const gridRef = useRef<HTMLDivElement>(null);
  const inView = useInView(gridRef);
  const autoIds = [...new Set(section.ownersRows.flatMap((r) => (r.id ? [r.id] : [])))];

  useEffect(() => {
    if (section.autoCycle && window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAutoOn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!section.autoCycle || !autoOn || !inView || pointerOver || autoIds.length === 0) return;
    const id = window.setTimeout(() => setAutoIndex((i) => (i + 1) % autoIds.length), AUTO_CYCLE_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [section.autoCycle, autoOn, inView, pointerOver, autoIndex, autoIds.length]);

  const autoActiveId = section.autoCycle && autoOn && inView && !pointerOver ? autoIds[autoIndex % autoIds.length] ?? null : null;
  const active = hovered ?? autoActiveId;
  const root = section.tree;
  const rootStyle = root.tone ? ({ '--tone-color': `var(--bw-${root.tone})` } as React.CSSProperties) : undefined;

  return (
    <Reveal as="section" className="ct-arch">
      {section.intro && <p className="label ct-arch__intro">{section.intro}</p>}
      {section.heading && <h2 className="text-section__title ct-arch__heading">{section.heading}</h2>}
      {section.lead && section.autoCycle ? (
        <div className="ct-arch__lead-row">
          <p className="text-section__lead ct-arch__lead">{section.lead}</p>
          <ModeToggle label="Relationship tour mode" auto={autoOn} onChange={setAutoOn} />
        </div>
      ) : (
        section.lead && <p className="text-section__lead ct-arch__lead">{section.lead}</p>
      )}
      <div
        ref={gridRef}
        className="ct-arch__grid"
        onMouseEnter={section.autoCycle ? () => setPointerOver(true) : undefined}
        onMouseLeave={section.autoCycle ? () => setPointerOver(false) : undefined}
        onFocus={section.autoCycle ? () => setPointerOver(true) : undefined}
        onBlur={section.autoCycle ? () => setPointerOver(false) : undefined}
      >
        <div className="ct-arch-tree" style={rootStyle}>
          {root.id ? (
            <button
              type="button"
              className="ct-arch-tree__root ct-arch-tree__root--linked"
              data-active={active === root.id || undefined}
              data-dimmed={(active != null && active !== root.id) || undefined}
              onMouseEnter={() => onHover(root.id!)}
              onMouseLeave={() => onLeave(root.id!)}
              onFocus={() => onHover(root.id!)}
              onBlur={() => onLeave(root.id!)}
            >
              {root.label}
            </button>
          ) : (
            <p className="ct-arch-tree__root">{root.label}</p>
          )}
          <ul>
            {root.children?.map((child, i) => (
              <ArchTreeItem
                key={child.label}
                node={child}
                isLast={i === (root.children?.length ?? 0) - 1}
                activeId={active}
                onHover={onHover}
                onLeave={onLeave}
              />
            ))}
          </ul>
          {section.treeNote && <p className="ct-arch-tree__note">{section.treeNote}</p>}
        </div>
        <div className="ct-arch-owners">
          <h3 className="ct-sequence__title ct-arch-owners__heading">{section.ownersHeading}</h3>
          {section.hint && <p className="label ct-arch-owners__hint">{section.hint}</p>}
          <ol className="ct-diagram__map">
            {section.ownersRows.map((row) => (
              <li
                className="ct-diagram__row"
                key={row.from}
                data-active={(row.id && active === row.id) || undefined}
                data-dimmed={(active != null && (!row.id || active !== row.id)) || undefined}
                data-linked={Boolean(row.id) || undefined}
                tabIndex={row.id ? 0 : undefined}
                role={row.id ? 'button' : undefined}
                onMouseEnter={row.id ? () => onHover(row.id!) : undefined}
                onMouseLeave={row.id ? () => onLeave(row.id!) : undefined}
                onFocus={row.id ? () => onHover(row.id!) : undefined}
                onBlur={row.id ? () => onLeave(row.id!) : undefined}
              >
                <span className="ct-diagram__from">{row.from}</span>
                <span className="ct-diagram__to">
                  {row.tone && (
                    <span
                      className="ct-diagram__row-dot"
                      aria-hidden="true"
                      style={{ background: `var(--bw-${row.tone})` }}
                    />
                  )}
                  {row.to}
                </span>
              </li>
            ))}
          </ol>
          {section.ownersNote && <p className="ct-arch-owners__note">{section.ownersNote}</p>}
        </div>
      </div>
    </Reveal>
  );
}

/** The page's closing exhibit: a two-direction interactive system
 *  explorer. BARCLAY WOODS anchors the top; the four principles sit
 *  in a row beneath it; the system objects sit in a row beneath that.
 *  Hovering or focusing EITHER a principle or an object emphasizes
 *  the other side of that relationship and reveals a short line — the
 *  principle's own explanation, or the object's own contextual line.
 *  A click/tap pins the selection, so touch works the same way.
 *
 *  Auto play (default on, off under prefers-reduced-motion) quietly
 *  cycles through every principle then every object using this exact
 *  same `active` mechanism — no separate animation state. Hovering
 *  the exhibit pauses the cycle without touching the toggle; a manual
 *  click pins that selection and turns auto play off, same as the
 *  tabs' "Auto preview" and the context-model's "Auto trace". */
function SystemModelBlock({ section }: { section: SystemModelSection }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [autoOn, setAutoOn] = useState(true);
  const [autoIndex, setAutoIndex] = useState(0);
  const [pointerOver, setPointerOver] = useState(false);

  const totalStates = section.principles.length + section.nodes.length;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAutoOn(false);
  }, []);

  useEffect(() => {
    if (!autoOn || pointerOver) return;
    const id = window.setInterval(() => {
      setAutoIndex((i) => (i + 1) % totalStates);
    }, AUTO_CYCLE_MS);
    return () => window.clearInterval(id);
  }, [autoOn, pointerOver, totalStates]);

  const autoActiveId =
    autoOn && !pointerOver
      ? autoIndex < section.principles.length
        ? section.principles[autoIndex].id
        : section.nodes[autoIndex - section.principles.length].id
      : null;

  const hover = (id: string) => setHovered(id);
  const unhover = (id: string) => setHovered((a) => (a === id ? null : a));
  const toggle = (id: string) => {
    setAutoOn(false);
    setPinned((a) => (a === id ? null : id));
  };

  const active = hovered ?? pinned ?? autoActiveId;

  const activePrinciple = section.principles.find((p) => p.id === active) ?? null;
  const activeNode = section.nodes.find((n) => n.id === active) ?? null;

  const relatedPrincipleIds = new Set(
    activePrinciple
      ? [activePrinciple.id]
      : activeNode
        ? section.principles.filter((p) => p.connections.includes(activeNode.id)).map((p) => p.id)
        : [],
  );
  const relatedNodeIds = new Set(activeNode ? [activeNode.id] : activePrinciple ? activePrinciple.connections : []);

  const explanation = activePrinciple?.text ?? activeNode?.text ?? null;
  const activeToneStyle = activePrinciple
    ? ({ '--active-tone': `var(--bw-${activePrinciple.tone})` } as React.CSSProperties)
    : undefined;

  const stateFor = (id: string, related: Set<string>) =>
    active === id ? 'active' : related.has(id) ? 'related' : active ? 'dim' : 'idle';

  return (
    <Reveal as="section" className="ct-system-model">
      <div className="text-section__head">
        <h2 className="text-section__title">{section.heading}</h2>
        {section.subheading && <p className="text-section__lead">{section.subheading}</p>}
      </div>

      <div className="ct-cue-row ct-system-model__cue">
        <p className="ct-cue-text">
          <span className="ct-cue-accent">Turn off auto play to click through at your own pace.</span>
        </p>
        <AutoToggle label="Auto play" on={autoOn} onToggle={() => setAutoOn((v) => !v)} />
      </div>

      <div
        className="ct-system-model__body"
        onMouseEnter={() => setPointerOver(true)}
        onMouseLeave={() => setPointerOver(false)}
        onFocus={() => setPointerOver(true)}
        onBlur={() => setPointerOver(false)}
      >
        <p className="ct-system-model__center">{section.center}</p>

        <div className="ct-system-model__principles" role="group" aria-label="System principles">
          {section.principles.map((p) => (
            <button
              key={p.id}
              type="button"
              className="ct-system-model__principle"
              style={{ '--tone-color': `var(--bw-${p.tone})` } as React.CSSProperties}
              data-state={stateFor(p.id, relatedPrincipleIds)}
              onMouseEnter={() => hover(p.id)}
              onMouseLeave={() => unhover(p.id)}
              onFocus={() => hover(p.id)}
              onBlur={() => unhover(p.id)}
              onClick={() => toggle(p.id)}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="ct-system-model__nodes" role="group" aria-label="System objects" style={activeToneStyle}>
          {section.nodes.map((n) => (
            <button
              key={n.id}
              type="button"
              className="ct-system-model__node"
              data-state={stateFor(n.id, relatedNodeIds)}
              onMouseEnter={() => hover(n.id)}
              onMouseLeave={() => unhover(n.id)}
              onFocus={() => hover(n.id)}
              onBlur={() => unhover(n.id)}
              onClick={() => toggle(n.id)}
            >
              {n.label}
            </button>
          ))}
        </div>

        <p className="ct-system-model__explain" aria-live="polite">
          {explanation ?? 'Select a principle or system object to explore.'}
        </p>
      </div>
    </Reveal>
  );
}

/** Ids from the root down to `targetId`, inclusive — or null if the
 *  tree doesn't contain it. */
function pathTo(node: ArchTreeNode, targetId: string): string[] | null {
  if (node.id === targetId) return [node.id];
  for (const child of node.children ?? []) {
    const rest = pathTo(child, targetId);
    if (rest) return [...(node.id ? [node.id] : []), ...rest];
  }
  return null;
}

/** Every id in the subtree rooted at `node`, inclusive. */
function subtreeIds(node: ArchTreeNode): string[] {
  return [...(node.id ? [node.id] : []), ...(node.children ?? []).flatMap(subtreeIds)];
}

function findNode(node: ArchTreeNode, targetId: string): ArchTreeNode | null {
  if (node.id === targetId) return node;
  for (const child of node.children ?? []) {
    const found = findNode(child, targetId);
    if (found) return found;
  }
  return null;
}

/** A node's role relative to the selected node — drives both its
 *  colour in the tree and which chip group it would appear in. */
type ContextNodeState = 'selected' | 'parent' | 'branch' | 'dim';

function stateFor(id: string, activeId: string, ancestorIds: Set<string>, descendantIds: Set<string>): ContextNodeState {
  if (id === activeId) return 'selected';
  if (ancestorIds.has(id)) return 'parent';
  if (descendantIds.has(id)) return 'branch';
  return 'dim';
}

/** One clickable node in the context-model's example hierarchy. Its
 *  colour state — selected / parent (ancestor) / branch (descendant) /
 *  dim (unrelated) — is computed once per render by the parent, using
 *  the same four-way split as the context bucket and AI panel, so the
 *  three panels read as one connected legend. */
function ContextTreeItem({
  node,
  isLast,
  activeId,
  ancestorIds,
  descendantIds,
  onSelect,
}: {
  node: ArchTreeNode;
  isLast: boolean;
  activeId: string;
  ancestorIds: Set<string>;
  descendantIds: Set<string>;
  onSelect: (id: string) => void;
}) {
  const id = node.id!;
  const state = stateFor(id, activeId, ancestorIds, descendantIds);
  return (
    <li data-last={isLast || undefined}>
      <span className="ct-context-model__branch" data-state={state} aria-hidden="true">
        {isLast ? '└──' : '├──'}
      </span>
      <button
        type="button"
        className="ct-context-model__node"
        data-state={state}
        aria-pressed={id === activeId}
        onClick={() => onSelect(id)}
      >
        {node.label}
      </button>
      {node.children?.length ? (
        <ul>
          {node.children.map((child, i) => (
            <ContextTreeItem
              key={child.id ?? child.label}
              node={child}
              isLast={i === node.children!.length - 1}
              activeId={activeId}
              ancestorIds={ancestorIds}
              descendantIds={descendantIds}
              onSelect={onSelect}
            />
          ))}
        </ul>
      ) : null}
    </li>
  );
}

const CHIP_LEGEND: Record<ContextChip['kind'], string> = {
  selected: 'Selected',
  parent: 'Parent',
  branch: 'Branch',
  excluded: 'Excluded',
};

/** "Behind the system": a small clickable example hierarchy, the
 *  colour-matched context bucket it makes relevant, and the "AI
 *  receives" panel derived from the same chips. Selecting a node
 *  colours its ancestors (parent context) and its own subtree
 *  (branch context) — everything else dims — so tree, bucket and AI
 *  panel read as one legend without the paragraph underneath. */
/** An explicit "Auto trace" toggle (default on) governs the cycle;
 *  hovering/focusing the demo pauses it for as long as attention is
 *  actually on it, without flipping the toggle itself. A manual node
 *  click turns the toggle off so the visitor's own selection sticks. */
function ContextModelBlock({ section }: { section: ContextModelSection }) {
  const [activeId, setActiveId] = useState(section.defaultNodeId);
  const cycle = section.autoCycle && section.autoCycle.length > 1 ? section.autoCycle : null;
  const [autoOn, setAutoOn] = useState(Boolean(cycle));
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    if (!cycle) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setAutoOn(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!cycle || !autoOn || hovering) return;
    const id = window.setInterval(() => {
      setActiveId((current) => {
        const idx = cycle.indexOf(current);
        return cycle[(idx + 1) % cycle.length];
      });
    }, AUTO_CYCLE_MS);
    return () => window.clearInterval(id);
  }, [cycle, autoOn, hovering]);

  const selectNode = (id: string) => {
    setActiveId(id);
    if (cycle) setAutoOn(false);
  };

  const path = pathTo(section.tree, activeId) ?? [section.tree.id ?? ''];
  const activeNode = findNode(section.tree, activeId) ?? section.tree;
  const ancestorIds = new Set(path.slice(0, -1));
  const descendantIds = new Set(subtreeIds(activeNode).filter((id) => id !== activeId));
  const rootState = stateFor(section.tree.id ?? '', activeId, ancestorIds, descendantIds);

  const chips = section.chips[activeId] ?? [];
  const included = chips.filter((c) => c.kind !== 'excluded');
  const excluded = chips.filter((c) => c.kind === 'excluded');

  return (
    <Reveal as="section" className="ct-context-model">
      <div className="text-section__head">
        {section.intro && <p className="label ct-context-model__intro">{section.intro}</p>}
        <h2 className="text-section__title">{section.heading}</h2>
      </div>
      {section.body?.length ? (
        <div className="ct-context-model__lede">
          {section.body.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      ) : null}

      {(section.hint || cycle) && (
        <div className="ct-cue-row ct-context-model__cue">
          <p className="ct-cue-text">
            <span className="ct-cue-accent">
              <span className="ct-context-model__live" data-playing={(autoOn && !hovering) || undefined} aria-hidden="true" />
              {section.hint}
              <span className="ct-cue-arrow" aria-hidden="true">
                ↓
              </span>
            </span>
          </p>
          {cycle && <AutoToggle label="Auto trace" on={autoOn} onToggle={() => setAutoOn((v) => !v)} />}
        </div>
      )}

      <div
        className="ct-context-model__demo"
        onMouseEnter={() => setHovering(true)}
        onFocus={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onBlur={() => setHovering(false)}
      >
        <div className="ct-context-model__tree" role="group" aria-label="Example hierarchy">
          <p className="label ct-context-model__panel-label">Visible tree</p>
          <p className="ct-context-model__panel-sublabel">what the user sees</p>
          <div className="ct-arch-tree ct-context-model__tree-frame">
            <button
              type="button"
              className="ct-context-model__node ct-context-model__node--root"
              data-state={rootState}
              aria-pressed={section.tree.id === activeId}
              onClick={() => selectNode(section.tree.id!)}
            >
              {section.tree.label}
            </button>
            <ul>
              {(section.tree.children ?? []).map((child, i) => (
                <ContextTreeItem
                  key={child.id ?? child.label}
                  node={child}
                  isLast={i === (section.tree.children?.length ?? 0) - 1}
                  activeId={activeId}
                  ancestorIds={ancestorIds}
                  descendantIds={descendantIds}
                  onSelect={selectNode}
                />
              ))}
            </ul>
          </div>
        </div>

        <div className="ct-context-model__flow ct-context-model__flow--vertical" aria-hidden="true">
          <span className="ct-context-model__flow-glyph" key={`flow-v-${activeId}`}>
            ↕
          </span>
        </div>

        <div className="ct-context-model__bucket" aria-live="polite">
          <p className="label ct-context-model__panel-label">Backend context bucket</p>
          <p className="ct-context-model__panel-sublabel">what the system retrieves</p>
          <ul className="ct-context-model__chips" key={`bucket-${activeId}`}>
            {chips.map((chip, i) => (
              <li className="ct-context-model__chip" data-kind={chip.kind} key={i}>
                <span className="label ct-context-model__chip-label">{chip.label}</span>
                <span className="ct-context-model__chip-text">{chip.text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="ct-context-model__flow ct-context-model__flow--horizontal" aria-hidden="true">
          <span className="ct-context-model__flow-glyph" key={`flow-h-${activeId}`}>
            →
          </span>
        </div>

        <div className="ct-context-model__ai">
          <p className="label ct-context-model__panel-label">AI receives</p>
          <p className="ct-context-model__panel-sublabel">only the relevant slice</p>
          <div className="ct-context-model__ai-body" key={`ai-${activeId}`}>
            <p className="ct-context-model__ai-task">
              <span className="label">Current task</span> {activeNode.label}
            </p>
            <p className="label ct-context-model__ai-heading">Context included</p>
            <ul className="ct-context-model__ai-list">
              {included.map((c, i) => (
                <li key={i} data-kind={c.kind}>
                  <span className="ct-context-model__ai-tag">{CHIP_LEGEND[c.kind]}</span>
                  {c.text}
                </li>
              ))}
            </ul>
            {excluded.length ? (
              <>
                <p className="label ct-context-model__ai-heading">Not included</p>
                <ul className="ct-context-model__ai-list">
                  {excluded.map((c, i) => (
                    <li key={i} data-kind="excluded">
                      {c.text}
                    </li>
                  ))}
                </ul>
              </>
            ) : null}
          </div>
        </div>
      </div>

      <div className="ct-context-model__note">
        <span className="ct-context-model__note-connector" aria-hidden="true">
          ↓
        </span>
        <p className="ct-context-model__note-label">{section.noteLabel}</p>
        {section.noteBody?.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <ol className="ct-context-model__outcomes">
          {section.outcomes.map((o, i) => (
            <li key={o.label}>
              <p className="label ct-context-model__stage-label">
                <span className="ct-context-model__stage-index">{String(i + 1).padStart(2, '0')}</span>
                {o.label}
              </p>
              <p className="ct-context-model__stage-headline">{o.headline}</p>
              <p className="ct-context-model__stage-detail">{o.detail}</p>
              <p className="label ct-context-model__stage-cue" aria-hidden="true">
                <span>{o.cue}</span>
                {i < section.outcomes.length - 1 && (
                  <>
                    <span className="ct-context-model__stage-line" />
                    <span className="ct-context-model__stage-arrow">→</span>
                  </>
                )}
              </p>
            </li>
          ))}
        </ol>
        <p className="ct-context-model__closing">{section.closing}</p>
      </div>
    </Reveal>
  );
}

/** A tiny inline-SVG tree glyph — three nodes, two branches — marking
 *  each mockup as descended from the same tree/structured-context
 *  architecture. Deliberately faint and wordless: the "blueprint"
 *  the miniature interface is built from, not another label. */
function BlueprintMark() {
  return (
    <span className="ct-concept__blueprint" aria-hidden="true">
      <svg viewBox="0 0 32 24" width="32" height="24" className="ct-concept__blueprint-tree">
        <line x1="16" y1="12" x2="6" y2="5" />
        <line x1="16" y1="12" x2="6" y2="19" />
        <line x1="18.5" y1="12" x2="26" y2="12" />
        <circle cx="6" cy="5" r="2.25" />
        <circle cx="6" cy="19" r="2.25" />
        <circle cx="16" cy="12" r="2.25" />
      </svg>
      <span className="ct-concept__blueprint-label">Blueprint</span>
    </span>
  );
}

/** A larger, more developed mockup of an application built on the
 *  same reasoning/context architecture — plain HTML/CSS, no image
 *  generation, no dependency. Each variant is its own shape (a
 *  requirements-to-implementation workspace, a branching system map,
 *  a course/concept study workspace) with its own restrained accent
 *  color, so the three read as distinct products rather than one
 *  diagram with swapped labels. `BlueprintMark` and the "structured
 *  context" tag are the two shared tells that all three descend from
 *  the same tree. */
function ConceptMockup({ kind }: { kind: NonNullable<TabPanel['mockup']> }) {
  return (
    <div className={`ct-concept ct-concept--${kind}`} aria-hidden="true">
      <div className="ct-concept__header">
        <BlueprintMark />
        <span className="ct-concept__marker">
          <span className="ct-concept__marker-dot" />
          Structured context
        </span>
      </div>
      <div className="ct-concept__body">
        {kind === 'apps' && (
          <div className="ct-concept__workspace">
            <span className="ct-concept__ws-label ct-concept__ws-label--source">Requirements</span>
            <span aria-hidden="true" />
            <span className="ct-concept__ws-label ct-concept__ws-label--output">Implementation</span>
            {(
              [
                ['Authentication', 'Data', 'done'],
                ['User roles', 'API', 'done'],
                ['Dashboard', 'Interface', 'active'],
                ['Data model', 'Implementation', 'pending'],
              ] as const
            ).map(([req, stage, state]) => (
              <Fragment key={req}>
                <span className="ct-concept__ws-req">{req}</span>
                <span className="ct-concept__ws-link" aria-hidden="true" />
                <span className="ct-concept__stage" data-state={state}>
                  {stage}
                </span>
              </Fragment>
            ))}
          </div>
        )}
        {kind === 'consulting' && (
          <div className="ct-concept__map">
            <span className="ct-concept__map-node ct-concept__map-node--root">Problem</span>
            <span className="ct-concept__map-connector" />
            <div className="ct-concept__map-branches">
              <span>Stakeholders</span>
              <span>Constraints</span>
              <span>Processes</span>
            </div>
            <span className="ct-concept__map-connector" />
            <div className="ct-concept__map-branches ct-concept__map-branches--evidence">
              <span>Evidence</span>
              <span>Evidence</span>
              <span>Evidence</span>
            </div>
            <span className="ct-concept__map-connector" />
            <span className="ct-concept__map-node ct-concept__map-node--result">Recommendation</span>
          </div>
        )}
        {kind === 'study' && (
          <div className="ct-concept__course">
            <div className="ct-concept__course-path">
              <span>Calculus</span>
              <span className="ct-concept__course-sep">›</span>
              <span>Unit 2</span>
              <span className="ct-concept__course-sep">›</span>
              <span data-active="true">Derivatives</span>
            </div>
            <div className="ct-concept__course-grid">
              <div className="ct-concept__sidebar">
                <span>Unit 1</span>
                <span data-active="true">Unit 2</span>
                <span>Review</span>
              </div>
              <div className="ct-concept__main">
                <div className="ct-concept__card ct-concept__card--concept">Concept: Derivatives</div>
                <div className="ct-concept__row">
                  <span>Formula: d/dx</span>
                  <span>Example</span>
                </div>
                <div className="ct-concept__row">
                  <span>Prerequisite: Limits</span>
                </div>
                <div className="ct-concept__mastery-row">
                  <span className="ct-concept__mastery">
                    <span data-filled="true" />
                    <span data-filled="true" />
                    <span data-filled="true" />
                    <span />
                    <span />
                  </span>
                  <span className="ct-concept__mastery-label">Review progress</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <p className="ct-concept__tag">
        {kind === 'apps' && 'Architecture application: requirements to systems to implementation'}
        {kind === 'consulting' && 'Analysis application: problem to drivers to evidence to recommendations'}
        {kind === 'study' && 'Learning application: topic to concepts to relationships to understanding'}
      </p>
    </div>
  );
}

function Section({ section }: { section: CaseStudySection }) {
  switch (section.kind) {
    case 'text':
      return <TextBlock section={section} />;
    case 'comparison':
      return <ComparisonBlock section={section} />;
    case 'context':
      return <ContextBlock section={section} />;
    case 'statement':
      return <StatementBlock section={section} />;
    case 'feature-overview':
      return <FeatureOverviewBlock section={section} />;
    case 'diagram':
      return <DiagramBlock section={section} />;
    case 'principles':
      return <PrinciplesBlock section={section} />;
    case 'media':
      return <MediaBlock section={section} />;
    case 'media+text':
      return <MediaTextBlock section={section} />;
    case 'dual-media':
      return <DualMediaBlock section={section} />;
    case 'sequence':
      return <SequenceBlock section={section} />;
    case 'tabs':
      return <TabsBlock section={section} />;
    case 'architecture-split':
      return <ArchitectureSplitBlock section={section} />;
    case 'system-model':
      return <SystemModelBlock section={section} />;
    case 'context-model':
      return <ContextModelBlock section={section} />;
  }
}

/** The lead paragraphs + key points under a project hero, on their own —
 *  lets a page compose its own body around them (CS 1501's tabbed layout)
 *  instead of always pairing them with the full section list. */
export function CaseStudyIntro({ data }: { data: Pick<CaseStudyData, 'intro' | 'keyPoints'> }) {
  const hasIntro = data.intro.length > 0 || (data.keyPoints?.length ?? 0) > 0;
  if (!hasIntro) return null;
  return (
    <Reveal as="div" className="ct-intro">
      {data.intro.map((p, i) => (
        <p key={i} className="lead">
          {p}
        </p>
      ))}
      {data.keyPoints?.length ? (
        <ul className="ct-intro__points">
          {data.keyPoints.map((b, i) => (
            <li key={i}>{b}</li>
          ))}
        </ul>
      ) : null}
    </Reveal>
  );
}

/** Just the ordered section list, with no wrapper and no intro — for a
 *  page that needs to interleave the section renderer with its own
 *  layout (CS 1501's tab panels) rather than rendering one flat list. */
export function CaseStudySections({ sections }: { sections: CaseStudySection[] }) {
  return (
    <>
      {sections.map((section) => (
        <Fragment key={section.id}>
          <Section section={section} />
        </Fragment>
      ))}
    </>
  );
}

export function CaseStudy({ data }: { data: CaseStudyData }) {
  return (
    <div className="wrap project-body">
      <CaseStudyIntro data={data} />
      <CaseStudySections sections={data.sections} />
    </div>
  );
}
