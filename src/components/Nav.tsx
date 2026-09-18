import { Link, useLocation } from 'react-router-dom';
import { projects } from '../content/projects';
import { site } from '../content/site';
import './nav.css';

/**
 * A compact floating project switcher — Home plus the three projects,
 * read directly from content/projects.ts so a title or route change
 * happens in one place. The site name sits quietly at the upper left
 * and LinkedIn, the one external link, at the upper right.
 */
export function Nav() {
  const { pathname } = useLocation();
  const items = [{ label: 'Home', route: '/' }, ...projects.map((p) => ({ label: p.navLabel ?? p.title, route: p.route }))];

  return (
    <header className="nav">
      <div className="nav__brand">
        <Link to="/" className="nav__name">
          {site.name}
        </Link>
        <span className="nav__meta">Systems Engineering · UVA · Portfolio</span>
      </div>
      <nav className="nav__pill" aria-label="Projects">
        {items.map((item) => {
          const active = pathname === item.route;
          return (
            <Link
              key={item.route}
              to={item.route}
              className="nav__item"
              data-active={active || undefined}
              aria-current={active ? 'page' : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <a className="nav__external" href={site.links.linkedin} target="_blank" rel="noreferrer">
        LinkedIn
      </a>
    </header>
  );
}
