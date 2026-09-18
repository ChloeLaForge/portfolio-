import { CaseStudy, NextProject } from '../components';
import { barclay } from '../content/case-studies/barclay';

/* ============================================================
   BARCLAY WOODS — case study
   Composition lives in ../content/case-studies/barclay.ts. No
   project-hero masthead: the page's opening beat is "Platform at
   a glance" itself, directly under the global nav — no title/
   Role/Focus/Context block ahead of it. The `cs-barclay` class
   scopes media to evidence size (never full-bleed) for this page.
   ============================================================ */

export default function BarclayWoods() {
  return (
    <article className="cs-barclay">
      <CaseStudy data={barclay} />
      <NextProject from="barclay-woods" />
    </article>
  );
}
