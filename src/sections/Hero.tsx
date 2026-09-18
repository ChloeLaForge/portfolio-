import { site } from '../content/site';
import './hero.css';

/**
 * Identification only. The name is here but deliberately secondary —
 * the dominant composition on the homepage is the thesis and the three
 * projects branching from it, in the section immediately below.
 */
export function Hero() {
  return (
    <section className="hero wrap" aria-labelledby="hero-name">
      <p className="label hero__context">{site.context}</p>
      <h1 className="hero__name" id="hero-name">
        {site.name}
      </h1>
    </section>
  );
}
