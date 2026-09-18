import { useCallback, useEffect, useRef, useState } from 'react';
import type { Media as MediaType } from '../content/media';
import { useReducedMotion } from '../lib/useReducedMotion';
import './media.css';

interface MediaProps {
  media: MediaType;
  /** Overrides the aspect ratio declared on the media object. */
  aspect?: string;
  /** 'cover' crops to the frame, 'contain' fits inside it. */
  fit?: 'cover' | 'contain';
  /** CSS object-position, for an intentional focal crop when `fit="cover"`
   *  clips a source whose own aspect ratio differs from the frame's. */
  objectPosition?: string;
  /** Loads eagerly and skips lazy decoding — use for the first image on a page. */
  priority?: boolean;
  className?: string;
  /** Hides the play/pause control on decorative loops. */
  controls?: boolean;
  /**
   * By default a hidden control still reappears under
   * prefers-reduced-motion so the clip stays reachable. Set this when
   * the video sits inside another interactive element (e.g. a card
   * `<Link>`), where a nested `<button>` would be invalid.
   */
  noReducedMotionControl?: boolean;
  /** Videos only. Overrides `media.loop` for the `loop` attribute while still
   *  autoplaying — pass `false` to play once and fire `onEnded`. */
  loop?: boolean;
  /** Videos only. Fires when a non-looping clip actually finishes. */
  onEnded?: () => void;
}

/**
 * The one component that knows how to render a picture, a silent
 * looping video, or a slot that has nothing in it yet. Everything
 * else on the site composes this.
 */
export function Media({
  media,
  aspect,
  fit = 'cover',
  objectPosition = 'center',
  priority = false,
  className = '',
  controls = true,
  noReducedMotionControl = false,
  loop,
  onEnded,
}: MediaProps) {
  const ratio = aspect ?? media.aspect ?? '16/9';
  const style = { aspectRatio: ratio } as React.CSSProperties;

  if (media.kind === 'placeholder') {
    return (
      <div className={`media media--empty ${className}`.trim()} style={style} role="img" aria-label={media.note ?? 'Media placeholder'}>
        <div className="media__slot">
          <span className="media__path">{media.expects}</span>
          {media.note && <span className="media__note">{media.note}</span>}
        </div>
      </div>
    );
  }

  if (media.kind === 'video') {
    return (
      <MediaVideo
        media={media}
        style={style}
        fit={fit}
        objectPosition={objectPosition}
        className={className}
        controls={controls}
        noReducedMotionControl={noReducedMotionControl}
        loop={loop}
        onEnded={onEnded}
      />
    );
  }

  return (
    <div className={`media ${className}`.trim()} style={style}>
      <img
        src={media.src}
        srcSet={media.srcSet}
        sizes={media.sizes ?? '(max-width: 900px) 100vw, 80vw'}
        alt={media.alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        style={{ objectFit: fit, objectPosition }}
      />
    </div>
  );
}

/**
 * A silent product-demo loop.
 *
 * - autoplay / muted / loop / playsInline when motion is allowed
 * - plays at `media.rate` (default 2×), asserted programmatically and
 *   reasserted on `loadedmetadata` / `play` because some browsers reset it
 * - source and decoding are deferred until the frame is near the viewport,
 *   and playback pauses whenever the frame is substantially offscreen, so a
 *   page full of these never decodes a dozen multi-MB files at once
 * - under prefers-reduced-motion it holds on its poster with a Play control
 *   and never force-applies the 2× rate
 * - the reserved aspect box (set by the caller) means no layout shift
 */
function MediaVideo({
  media,
  style,
  fit,
  objectPosition,
  className,
  controls,
  noReducedMotionControl,
  loop,
  onEnded,
}: {
  media: Extract<MediaType, { kind: 'video' }>;
  style: React.CSSProperties;
  fit: 'cover' | 'contain';
  objectPosition: string;
  className: string;
  controls: boolean;
  noReducedMotionControl: boolean;
  loop?: boolean;
  onEnded?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();

  const shouldLoop = loop ?? media.loop !== false;
  const autoplayWanted = media.loop !== false && !reducedMotion;
  const rate = reducedMotion ? 1 : media.rate ?? 2;

  // `near`: within a screen of the viewport — safe to attach a source.
  // `onscreen`: substantially visible — safe to actually play.
  const [near, setNear] = useState(false);
  const [onscreen, setOnscreen] = useState(false);
  const [wantPlay, setWantPlay] = useState(autoplayWanted);

  useEffect(() => setWantPlay(autoplayWanted), [autoplayWanted]);

  // Defer the source until the frame approaches the viewport.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setNear(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: '400px 0px' },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  // Pause when substantially offscreen, resume on re-entry.
  useEffect(() => {
    const node = wrapRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setOnscreen(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        const e = entries[entries.length - 1];
        setOnscreen(e.isIntersecting && e.intersectionRatio >= 0.3);
      },
      { threshold: [0, 0.3, 0.6] },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const playing = near && onscreen && wantPlay;

  const assertRate = useCallback(() => {
    const el = videoRef.current;
    if (el && el.playbackRate !== rate) el.playbackRate = rate;
  }, [rate]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el || !near) return;
    assertRate();
    if (playing) {
      const p = el.play();
      if (p) p.then(assertRate).catch(() => {});
    } else {
      el.pause();
    }
  }, [playing, near, assertRate]);

  // Decorative loops hide the control; reduced motion re-exposes it so the
  // clip stays reachable — unless the video is nested in another
  // interactive element, where a <button> would be invalid.
  const showToggle = controls || (reducedMotion && !noReducedMotionControl);

  return (
    <div ref={wrapRef} className={`media media--video ${className}`.trim()} style={style}>
      <video
        ref={videoRef}
        src={near ? media.src : undefined}
        poster={media.poster}
        muted
        playsInline
        loop={shouldLoop}
        onEnded={onEnded}
        preload={near ? 'metadata' : 'none'}
        aria-label={media.alt}
        onLoadedMetadata={assertRate}
        onPlay={assertRate}
        style={{ objectFit: fit, objectPosition }}
      />
      {showToggle && (
        <button
          type="button"
          className="media__toggle"
          onClick={() => setWantPlay((p) => !p)}
          aria-pressed={playing}
        >
          {playing ? 'Pause' : 'Play'}
          <span className="sr-only"> video: {media.alt}</span>
        </button>
      )}
    </div>
  );
}
