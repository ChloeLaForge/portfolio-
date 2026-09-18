import { Link } from 'react-router-dom';
import { Media } from '../components/Media';
import { projects, type ProjectId } from '../content/projects';
import { useReveal } from '../lib/useReveal';
import './core.css';

/* One shared frame ratio — the Notebook case-study clip's own 1476 × 840 —
 * so that clip fills its frame exactly as it does on the Notebook page.
 * The other two captures are sized to that ratio without losing content:
 *  - Barclay (1514×946, ~1.6) is narrower than the frame, so it is
 *    `contain`ed: the whole app, sidebar to right edge, centered, with a
 *    sliver of the frame's own background on either side.
 *  - Notebook (exact match) and CS 1501 (1522×856, ~1.78, a 1% trim) fill
 *    the frame with `cover`, centered. */
const HOMEPAGE_FRAME_ASPECT = '1476 / 840';
const HOMEPAGE_PREVIEW_FIT: Record<ProjectId, 'cover' | 'contain'> = {
  'barclay-woods': 'contain',
  notebook: 'cover',
  cs1501: 'cover',
};

/**
 * The homepage's entire composition: three projects branching from one
 * shared trunk, with each project's evidence embedded in its branch. No
 * hero, no bio — this section IS the homepage, centered in the viewport.
 *
 * The geometry is hairline rules, not an SVG, so it stays crisp at any
 * zoom and reflows with the column grid. On load it draws itself: trunk
 * down, span across, drops into each branch, then the columns and their
 * media settle in. That shared trunk is the one "connecting" device
 * between the three — deliberately not a literal flowchart of the
 * real-system → reusable-architecture → teaching progression underneath.
 *
 * Each column is one link — index, conceptual statement, a preview (image
 * for Barclay and CS 1501, a silent 2× loop for Notebook) inside one
 * consistent rounded frame, three short bullets naming the strongest idea
 * behind the project, and a cue. Only Notebook moves, which draws a quiet
 * eye to the middle column — the one that conceptually connects the other
 * two.
 *
 * Below 860px the three-column tree collapses to a single spine with
 * ticks — the same relationship, less geometry.
 */
export function Core() {
  const { ref, visible } = useReveal<HTMLDivElement>('0px 0px -15% 0px');

  return (
    <section className="core wrap" id="work" aria-labelledby="core-heading">
      <h2 className="sr-only" id="core-heading">
        Systems thinking and AI, in three projects
      </h2>

      <div className={`branch ${visible ? 'is-drawn' : ''}`} ref={ref}>
        <div className="branch__lines" aria-hidden="true">
          <span className="branch__trunk" />
          <span className="branch__span" />
          <span className="branch__drop" data-col="2" />
          <span className="branch__drop" data-col="3" />
        </div>

        <ol className="branch__cols">
          {projects.map((project, i) => (
            <li className="branch__col" key={project.id} data-accent={project.id} style={{ '--i': i } as React.CSSProperties}>
              <Link to={project.route} className="branch__link">
                <span className="branch__node" aria-hidden="true" />

                <span className="branch__head">
                  <span className="label branch__index">{project.index}</span>
                  <span className="branch__title">{project.title}</span>
                  <span className="branch__caption">{project.branch}</span>
                </span>

                <span className="branch__frame">
                  {/* One shared, rounded frame keeps the row coherent; each
                      preview fits inside it proportionally (see
                      HOMEPAGE_PREVIEW_FIT) — never stretched. controls off
                      + no reduced-motion control: a <button> inside this
                      <a> would be invalid. */}
                  <Media
                    media={project.preview}
                    aspect={HOMEPAGE_FRAME_ASPECT}
                    fit={HOMEPAGE_PREVIEW_FIT[project.id]}
                    controls={false}
                    noReducedMotionControl
                  />
                </span>

                <ul className="branch__bullets">
                  {project.bullets.map((bullet, bi) => (
                    <li key={bi}>{bullet}</li>
                  ))}
                </ul>

                <span className="branch__cue">
                  View project
                  <svg className="branch__arrow" width="16" height="8" viewBox="0 0 16 8" aria-hidden="true">
                    <path d="M0 4h13.5M10.5 0.5 14 4l-3.5 3.5" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
