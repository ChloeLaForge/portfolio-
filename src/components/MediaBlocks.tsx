import type { ReactNode } from 'react';
import type { Media as MediaType } from '../content/media';
import { Media } from './Media';
import { Reveal } from './Reveal';
import './media.css';

/* ============================================================
   MEDIA BLOCKS
   Thin compositions over <Media />. Each one is a layout choice,
   not a different rendering engine — so any block accepts an
   image, a video or an empty slot without changes.
   ============================================================ */

interface CaptionProps {
  /** Short bold lead-in, e.g. "Figure 02". */
  title?: string;
  children?: ReactNode;
}

function Caption({ title, children }: CaptionProps) {
  if (!title && !children) return null;
  return (
    <figcaption className="caption">
      {title && <strong>{title}</strong>}
      {children}
    </figcaption>
  );
}

/** A single large piece of media inside the content measure. */
export function LargeMedia({
  media,
  aspect,
  fit,
  caption,
  captionTitle,
  priority,
}: {
  media: MediaType;
  aspect?: string;
  fit?: 'cover' | 'contain';
  caption?: ReactNode;
  captionTitle?: string;
  priority?: boolean;
}) {
  return (
    <Reveal as="figure" className="captioned">
      <Media media={media} aspect={aspect} fit={fit} priority={priority} />
      <Caption title={captionTitle}>{caption}</Caption>
    </Reveal>
  );
}

/** Same as LargeMedia, but intended for video. Kept separate so
 *  video sections stay obvious when you're scanning a page file. */
export function VideoBlock({
  media,
  aspect = '16/9',
  caption,
  captionTitle,
}: {
  media: MediaType;
  aspect?: string;
  caption?: ReactNode;
  captionTitle?: string;
}) {
  return (
    <Reveal as="figure" className="captioned">
      <Media media={media} aspect={aspect} />
      <Caption title={captionTitle}>{caption}</Caption>
    </Reveal>
  );
}

/** Two, three or four items side by side; collapses on small screens. */
export function ImageGrid({
  items,
  columns = 2,
  aspect,
  fit,
  caption,
  captionTitle,
}: {
  items: MediaType[];
  columns?: 2 | 3 | 4;
  aspect?: string;
  fit?: 'cover' | 'contain';
  caption?: ReactNode;
  captionTitle?: string;
}) {
  return (
    <Reveal as="figure" className="captioned">
      <div className="media-grid" data-columns={columns}>
        {items.map((item, i) => (
          <Media key={i} media={item} aspect={aspect} fit={fit} />
        ))}
      </div>
      <Caption title={captionTitle}>{caption}</Caption>
    </Reveal>
  );
}

/** Media with its caption set beside it rather than beneath. */
export function CaptionedMedia({
  media,
  aspect,
  fit,
  captionTitle,
  caption,
  side = 'right',
}: {
  media: MediaType;
  aspect?: string;
  fit?: 'cover' | 'contain';
  captionTitle?: string;
  caption?: ReactNode;
  side?: 'left' | 'right';
}) {
  return (
    <Reveal as="figure" className="captioned-aside" data-side={side}>
      <div className="captioned-aside__media">
        <Media media={media} aspect={aspect} fit={fit} />
      </div>
      <div className="captioned-aside__text">
        <Caption title={captionTitle}>{caption}</Caption>
      </div>
    </Reveal>
  );
}

/** Breaks the gutters — use once per page at most. */
export function FullBleedMedia({
  media,
  aspect = '21/9',
  caption,
  captionTitle,
}: {
  media: MediaType;
  aspect?: string;
  caption?: ReactNode;
  captionTitle?: string;
}) {
  return (
    <Reveal as="figure" className="full-bleed">
      <Media media={media} aspect={aspect} />
      <Caption title={captionTitle}>{caption}</Caption>
    </Reveal>
  );
}
