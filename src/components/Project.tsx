import { Link } from 'react-router-dom';
import { getNextProject, type Project } from '../content/projects';
import './project.css';

/**
 * The masthead for a project page. Title, one framing line, and a
 * small metadata table on the right. Everything comes from
 * src/content/projects.ts so a title change happens in one place.
 */
export function ProjectHero({
  project,
  children,
  minimal,
}: {
  project: Project;
  children?: React.ReactNode;
  /** Breadcrumb + title only — no subtitle, no meta table. For a page
   *  whose opening beat is a product demonstration rather than this
   *  masthead; the subtitle/meta still exist on `project` and can be
   *  surfaced further down the page instead. */
  minimal?: boolean;
}) {
  return (
    <header className="project-hero wrap">
      <p className="label project-hero__index">
        <Link to="/#work" className="project-hero__back">
          Work
        </Link>
        <span aria-hidden="true"> / </span>
        {project.index}
      </p>

      <h1 className="project-hero__title">{project.title}</h1>

      {!minimal && (
        <div className="project-hero__split">
          <p className="project-hero__subtitle">{children ?? project.subtitle}</p>
          <dl className="project-hero__meta">
            {project.meta.map((row) => (
              <div className="project-hero__row" key={row.label}>
                <dt className="label">{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </header>
  );
}

/** Wraps around the three projects so there is never a dead end. */
export function NextProject({ from }: { from: Project['id'] }) {
  const next = getNextProject(from);
  return (
    <nav className="next wrap" aria-label="Next project">
      <Link to={next.route} className="next__link">
        <span className="label next__label">Next</span>
        <span className="next__title">{next.title}</span>
        <span className="next__branch">{next.branch}</span>
        <svg className="next__arrow" width="26" height="8" viewBox="0 0 26 8" aria-hidden="true">
          <path d="M0 4h24M20.5 0.5 24.5 4l-4 3.5" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
      </Link>
    </nav>
  );
}
