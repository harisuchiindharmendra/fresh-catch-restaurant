# Fresh Catch — Cinematic Seafood Dining

A motion-first, cinematic luxury restaurant experience. Built with Next.js (App Router), TypeScript, Tailwind, GSAP + ScrollTrigger, Lenis smooth scroll, and a custom interaction layer (magnetic buttons, char-split title with cursor distortion, depth-stage gallery, scroll-driven camera dolly).

## Quick start

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 3000 |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |

## Project structure

```
app/                    Next.js App Router
  layout.tsx            Metadata, fonts, globals
  page.tsx              Section composition
  opengraph-image.tsx   Edge-rendered OG card
  robots.ts, sitemap.ts SEO endpoints
  icon.svg              Favicon
  globals.css           Tailwind + custom utilities

components/
  hero/                 Hero with depth layers, particles, char-split title
  dishes/               Floating dish artifacts (not a grid)
  chef/                 Documentary reveal + light sweep
  dining/               Dolly-zoom parallax + magnetic glass card
  gallery/              3D depth masonry
  cta/                  Final cinematic with narrowing focus

  ui/                   Navigation, Footer, SideInfoPanel, MagneticButton
  effects/              SmoothScroll (Lenis), CustomCursor, Aurora,
                        Caustics, FilmGrain, Vignette

lib/
  pointer.ts            Global smoothed pointer singleton (RAF-driven)
  scroll-state.ts       Global scroll velocity/progress singleton
  config.ts             Site copy, dishes, gallery data
  gsap.ts               Single-registration GSAP helper
  scroll.ts             Reduced-motion + mobile helpers

store/
  scene-store.ts        Zustand: active scene + scroll progress

public/
  video/hero-video.mp4  Hero background video
  images/               Optional local image overrides
```

## Swapping in your own imagery

The dish, chef, dining, and gallery sections load remote Unsplash placeholders. To swap with your photos:

1. Drop files in `public/images/`
2. Open `lib/config.ts` and replace the `https://...` URLs with `/images/your-file.jpg`

## Performance & accessibility

- Smooth scroll runs through Lenis with custom easing; respects `prefers-reduced-motion`.
- The custom cursor is disabled on touch devices and reduced-motion users.
- All GSAP timelines are registered through one helper to prevent plugin double-registration.
- The hero canvas pauses out of viewport.
- All heavy DOM work happens inside `useEffect` (SSR-safe).
- Hero video is long-cached via `Cache-Control: public, max-age=31536000, immutable`.

## Deployment

Production builds run cleanly via `next build`. The project ships with a `vercel.json` set to the Next.js framework preset. Deploy to any platform that supports the Next.js App Router (Vercel, Netlify, Cloudflare Pages, self-hosted Node).

Set `NEXT_PUBLIC_SITE_URL` in the deployment environment so the OG image, sitemap, and robots emit the correct origin.

## License

Proprietary — all rights reserved.
