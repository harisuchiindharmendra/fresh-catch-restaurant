'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { gallery } from '@/lib/config';
import { BLUR_NAVY } from '@/lib/imagePlaceholder';
import { useSceneStore } from '@/store/scene-store';

/**
 * Memory archive — not a grid, not 3D depth, not hover-recede.
 *
 * Images at varied scales, placed asymmetrically with intentional
 * empty space between them. Each fades in slowly on entry, with a
 * subtle parallax drift. Hover reveals only a hairline caption —
 * no overlay, no scrim, no scale.
 */
const layout = [
  { col: 'col-start-1 lg:col-start-2 col-span-10 lg:col-span-5', aspect: 'aspect-[4/5]', parallax: 60 },
  { col: 'col-start-2 lg:col-start-9 col-span-9 lg:col-span-4', aspect: 'aspect-[4/3]', parallax: 100 },
  { col: 'col-start-1 lg:col-start-3 col-span-9 lg:col-span-4', aspect: 'aspect-square', parallax: 50 },
  { col: 'col-start-3 lg:col-start-8 col-span-9 lg:col-span-5', aspect: 'aspect-[4/5]', parallax: 90 },
  { col: 'col-start-1 lg:col-start-2 col-span-10 lg:col-span-6', aspect: 'aspect-[4/3]', parallax: 70 },
  { col: 'col-start-2 lg:col-start-9 col-span-9 lg:col-span-4', aspect: 'aspect-[3/4]', parallax: 110 },
  { col: 'col-start-1 lg:col-start-3 col-span-10 lg:col-span-4', aspect: 'aspect-square', parallax: 60 },
  { col: 'col-start-3 lg:col-start-8 col-span-9 lg:col-span-5', aspect: 'aspect-[4/3]', parallax: 90 },
];

export default function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.from('.gallery-fade > *', {
        y: 24,
        opacity: 0,
        duration: 1.6,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.gallery-fade', start: 'top 80%' },
      });

      gsap.utils.toArray<HTMLElement>('.gallery-frame').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 60,
          duration: 1.8,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%' },
        });
        const parallax = Number(el.dataset.parallax || '60');
        gsap.to(el, {
          y: -parallax,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        });
      });

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveScene(4),
        onEnterBack: () => setActiveScene(4),
      });
    }, ref);
    return () => ctx.revert();
  }, [setActiveScene]);

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative bg-navy-950 py-40 lg:py-56 overflow-hidden"
    >
      <div className="mx-auto max-w-[1500px] px-8 lg:px-16">
        <header className="gallery-fade max-w-2xl mb-32 lg:mb-44">
          <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/45 mb-8">
            Memory
          </p>
          <h2 className="font-serif text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] text-ivory font-light">
            Quiet pleasures,
            <br />
            <span className="italic text-ivory/50">remembered later.</span>
          </h2>
        </header>

        <div className="grid grid-cols-12 gap-y-32 lg:gap-y-44 gap-x-6">
          {gallery.map((g, i) => {
            const l = layout[i % layout.length];
            return (
              <figure
                key={i}
                data-parallax={l.parallax}
                className={`gallery-frame relative ${l.col} will-change-transform`}
              >
                <div className={`relative ${l.aspect} overflow-hidden bg-navy-800/40`}>
                  <Image
                    src={g.src}
                    alt={g.caption}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    placeholder="blur"
                    blurDataURL={BLUR_NAVY}
                    quality={80}
                    className="object-cover"
                  />
                </div>
                <figcaption className="mt-4 text-[10px] uppercase tracking-[0.4em] text-ivory/35">
                  {g.caption}
                </figcaption>
              </figure>
            );
          })}
        </div>
      </div>
    </section>
  );
}
