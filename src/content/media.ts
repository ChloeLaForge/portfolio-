/* ============================================================
   MEDIA TYPES
   One shape for every image, video and not-yet-uploaded slot on
   the site. Components never take raw `src` strings — they take
   a Media object, so swapping an image for a video is a one-line
   change in a content file.
   ============================================================ */

export type AspectRatio = '21/9' | '16/9' | '3/2' | '4/3' | '1/1' | '4/5' | '3/4' | (string & {});

export interface ImageMedia {
  kind: 'image';
  /** Path under /public, e.g. '/portfolio/notebook/tree.png' (png | jpg | webp) */
  src: string;
  /** Optional responsive set: '/portfolio/notebook/tree-1200.webp 1200w, ...' */
  srcSet?: string;
  /** Defaults to a sensible full-width hint; override for grids. */
  sizes?: string;
  alt: string;
  aspect?: AspectRatio;
}

export interface VideoMedia {
  kind: 'video';
  /** Path under /public. `.mp4` (no audio) is preferred; `.mov` source
   *  captures are also supported for screen-recording demos. */
  src: string;
  /** Still frame shown before playback and when motion is reduced. */
  poster?: string;
  /** Described for screen readers; videos here are always silent. */
  alt: string;
  aspect?: AspectRatio;
  /** Autoplay muted loop. Default true. Ignored under reduced motion. */
  loop?: boolean;
  /**
   * Playback speed. Screen-recording demos default to 2 (asserted
   * programmatically, never baked into the file). Set to 1 for long
   * clips that read better at normal speed. Forced to 1 under
   * prefers-reduced-motion.
   */
  rate?: number;
}

/** A slot with nothing in it yet. Renders the expected file path so
 *  you can see exactly what to drop into /public and where. */
export interface PlaceholderMedia {
  kind: 'placeholder';
  /** The path this slot is waiting for. */
  expects: string;
  aspect?: AspectRatio;
  /** Optional one-line note about what belongs here. */
  note?: string;
}

export type Media = ImageMedia | VideoMedia | PlaceholderMedia;

/** Shorthand for declaring an empty slot. */
export const slot = (expects: string, aspect: AspectRatio = '16/9', note?: string): PlaceholderMedia => ({
  kind: 'placeholder',
  expects,
  aspect,
  note,
});
