import type { ReactNode } from 'react';
import { Reveal } from './Reveal';
import './text.css';

/* ============================================================
   TEXT BLOCKS
   Prose sections for project pages. The heading sits in a narrow
   left column and the content in a wide right one — the same
   two-column armature the homepage uses, so pages feel related
   without every page following the same sequence.
   ============================================================ */

export function TextSection({
  title,
  aside,
  children,
  wide = false,
}: {
  title: string;
  /** Optional annotation under the heading — a date, a role, a status. */
  aside?: ReactNode;
  children?: ReactNode;
  /** Lets the body run the full width instead of the reading measure. */
  wide?: boolean;
}) {
  return (
    <Reveal as="section" className="text-section">
      <div className="text-section__head">
        <h2 className="text-section__title">{title}</h2>
        {aside && <p className="label text-section__aside">{aside}</p>}
      </div>
      <div className="text-section__body" data-wide={wide || undefined}>
        {children}
      </div>
    </Reveal>
  );
}

/**
 * Temporary copy, obviously marked as such. Every one of these is
 * a thing to write. Delete the component call when you write it.
 */
export function Placeholder({ children, file }: { children?: ReactNode; file?: string }) {
  return (
    <div className="placeholder">
      <p className="placeholder__body">{children ?? 'Copy for this section has not been written yet.'}</p>
      {file && <p className="placeholder__file">{file}</p>}
    </div>
  );
}

export interface ProcessStep {
  title: string;
  body?: ReactNode;
}

/** A genuine sequence — steps in order, numbered because the order matters. */
export function ProcessSection({ title, steps }: { title: string; steps: ProcessStep[] }) {
  return (
    <Reveal as="section" className="text-section">
      <div className="text-section__head">
        <h2 className="text-section__title">{title}</h2>
      </div>
      <ol className="process">
        {steps.map((step, i) => (
          <li className="process__step" key={step.title}>
            <span className="process__index">{String(i + 1).padStart(2, '0')}</span>
            <div className="process__content">
              <h3 className="process__title">{step.title}</h3>
              {step.body && <div className="process__body">{step.body}</div>}
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}
