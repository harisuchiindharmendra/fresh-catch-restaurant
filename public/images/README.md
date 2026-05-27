# Fresh Catch — Image System

The site is wired to load real photos from this folder. Right now the
homepage uses themed placehold.co fallback images so it can never go
black if a remote URL fails. Drop your real photos here and update
`lib/config.ts` to swap in `/images/...` paths.

## Where files should go

```
public/images/
├── dishes/
│   ├── tandoori-pomfret.jpg     (used by `Tandoori Pomfret` card)
│   ├── mangalorean-fish-curry.jpg
│   ├── meen-pollichathu.jpg
│   └── prawn-ghee-roast.jpg
├── chef.jpg                      (chef portrait — vertical 4:5 ideal)
├── dining.jpg                    (interior — landscape 16:9 or 4:3)
└── gallery/
    ├── 01.jpg
    ├── 02.jpg
    ├── 03.jpg
    ├── 04.jpg
    ├── 05.jpg
    ├── 06.jpg
    ├── 07.jpg
    └── 08.jpg
```

## Recommended specs

- **Dishes** — 1600 × 2000 px (4:5), JPEG q 85, <500 KB each
- **Chef** — 1400 × 1750 px (4:5)
- **Dining** — 2400 × 1600 px (3:2)
- **Gallery** — varies by frame aspect ratio (see layout in `Gallery.tsx`).
  Anything 1200–1600 px on the long edge at q 80 is plenty; the site
  will request the right size via next/image.

## After dropping files

Open `lib/config.ts` and change the `image:` values:

```ts
// before — placeholder
image: ph('Tandoori Pomfret'),

// after — your photo
image: '/images/dishes/tandoori-pomfret.jpg',
```

Same for the chef portrait (in `components/chef/ChefStory.tsx`), the
dining interior (in `components/dining/DiningExperience.tsx`), and the
gallery (in `lib/config.ts` → `gallery` array).

No re-deploy needed if you keep the same filenames — just push and
production picks them up.
