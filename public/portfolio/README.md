# Media

Everything visual on the site lives here. You should never need to edit a
component to swap an image or add a video.

```
public/portfolio/
├── notebook/
├── barclay-woods/
└── cs1501/
```

Anything in `public/` is served from the site root, so
`public/portfolio/notebook/tree.png` is referenced as
`/portfolio/notebook/tree.png`.

## The three-step swap

**1. Drop the file** into the right project folder.

**2. Find the slot.** Empty slots render on the page as a ruled well with the
exact filename they're waiting for. That string is the path to use.

**3. Replace `slot(...)` with a real media object.**

```ts
// before
slot('/portfolio/notebook/tree.png', '3/2', 'Finished output')

// after — image
{ kind: 'image', src: '/portfolio/notebook/tree.png', alt: 'The generated project tree' }

// after — silent looping video
{ kind: 'video', src: '/portfolio/notebook/build.mp4',
  poster: '/portfolio/notebook/build-poster.jpg',
  alt: 'Building a notebook alongside the model' }
```

Homepage previews live in `src/content/projects.ts`.
Project page media lives in the matching file in `src/pages/`.

## What the media system handles for you

| | |
|---|---|
| Formats | `.png` `.jpg` `.webp` for images, `.mp4` for video |
| Video | muted, looping, `playsInline`, autoplays on load |
| Reduced motion | video holds on its poster frame with a Play control instead |
| Lazy loading | every image except ones marked `priority` |
| Aspect ratio | set per slot (`'16/9'`, `'3/2'`, `'4/5'`, or any CSS ratio) — the frame is reserved before the file loads, so nothing jumps |
| Fit | `fit="cover"` crops to the frame, `fit="contain"` fits inside it |

## Responsive images

For large hero images, export a few widths and pass a `srcSet`:

```ts
{
  kind: 'image',
  src: '/portfolio/barclay-woods/interface-1600.webp',
  srcSet: '/portfolio/barclay-woods/interface-800.webp 800w, ' +
          '/portfolio/barclay-woods/interface-1600.webp 1600w, ' +
          '/portfolio/barclay-woods/interface-2400.webp 2400w',
  sizes: '(max-width: 900px) 100vw, 80vw',
  alt: 'The Barclay Woods resident dashboard',
}
```

## Video notes

- Export **without an audio track**. Autoplay only works muted, and a silent
  file is smaller.
- Aim for **under ~8 MB** per homepage preview. H.264 MP4, 1600px wide is
  plenty — these play at roughly half the screen width.
- Always ship a **poster frame**. It's what people on reduced motion see, and
  it's what shows during loading.
- Trim to a **clean loop**. Nothing on this site has playback controls beyond
  play/pause, so a visible cut is a visible cut.

## Naming

Lowercase, hyphenated, descriptive: `system-map.png`, `live-build.mp4`,
`slide-01.png`. The slots already use this convention — matching it means the
swap is a one-line change.

## Resume

The nav and footer link to `/resume.pdf`. Drop the PDF at `public/resume.pdf`,
or point `site.links.resume` in `src/content/site.ts` at a hosted file.
