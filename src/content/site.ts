/* ============================================================
   SITE
   Every word and link that isn't project-specific.
   All prose here is placeholder and meant to be rewritten.
   ============================================================ */

export const site = {
  name: 'Chloe LaForge',
  context: 'Systems Engineering @ UVA',

  about: {
    /** Short by design — it exists to make the work legible, not to retell a resume. */
    body: 'I’m a Systems Engineering student at the University of Virginia. I’m interested in how people stay responsible for the systems they build when AI is part of building them — in the modelling, the interface, and the teaching.',
  },

  links: {
    /** Drop the PDF at /public/resume.pdf, or point this at a hosted file. */
    resume: '/resume.pdf',
    linkedin: 'https://www.linkedin.com/in/',
  },
} as const;
