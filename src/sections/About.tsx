import { Reveal } from '../components/Reveal';
import { site } from '../content/site';
import './about.css';

/**
 * Small by design. This exists to make the work legible, not to
 * restate a resume — the resume lives at its own link.
 */
export function About() {
  return (
    <Reveal as="section" className="about wrap" id="about">
      <h2 className="about__heading">About</h2>
      <div className="about__body">
        <p>{site.about.body}</p>
        <a className="about__resume" href={site.links.resume} target="_blank" rel="noreferrer">
          Resume
        </a>
      </div>
    </Reveal>
  );
}
