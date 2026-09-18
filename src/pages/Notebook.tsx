import { ProjectHero, CaseStudy, NextProject } from '../components';
import { getProject } from '../content/projects';
import { notebook } from '../content/case-studies/notebook';

/* ============================================================
   NOTEBOOK — case study
   Composition lives in ../content/case-studies/notebook.ts as an
   ordered list of section descriptors; <CaseStudy /> renders it.
   Argument: the hook (a live build, first, with product media) →
   project context (why it exists) → how the loop works → the
   problem/opportunity → user control (proposal vs. accepted) →
   visual organisation → context mode (revisit) → reusable structure
   → system at a glance → outcome.
   The hero stays to a bare identifier (`minimal`) — the opening
   beat is the hook section's product demonstration, not a masthead.
   ============================================================ */

export default function Notebook() {
  const project = getProject('notebook');

  return (
    <article className="cs-notebook">
      <ProjectHero project={project} minimal />
      <CaseStudy data={notebook} />
      <NextProject from="notebook" />
    </article>
  );
}
