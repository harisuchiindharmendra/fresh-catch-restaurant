'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { gallery } from '@/lib/config';
import { useSceneStore } from '@/store/scene-store';
import { pointer } from '@/lib/pointer';
import { getReducedMotion, isMobile } from '@/lib/scroll';

const layout: { col: string; row: string; z: number; aspect: string; offsetY: number }[] = [
  { col: 'col-span-6 lg:col-span-3', row: 'row-span-2', z: -60, aspect: 'aspect-[3/4]', offsetY: 0 },
  { col: 'col-span-6 lg:col-span-4', row: 'row-span-1', z: 0, aspect: 'aspect-[4/3]', offsetY: 40 },
  { col: 'col-span-6 lg:col-span-3', row: 'row-span-1', z: -100, aspect: 'aspect-square', offsetY: -20 },
  { col: 'col-span-6 lg:col-span-2', row: 'row-span-1', z: 60, aspect: 'aspect-square', offsetY: 80 },
  { col: 'col-span-6 lg:col-span-5', row: 'row-span-1', z: -40, aspect: 'aspect-[4/3]', offsetY: 0 },
  { col: 'col-span-6 lg:col-span-3', row: 'row-span-2', z: 30, aspect: 'aspect-[3/4]', offsetY: 40 },
  { col: 'col-span-6 lg:col-span-2', row: 'row-span-1', z: -80, aspect: 'aspect-square', offsetY: -10 },
  { col: 'col-span-6 lg:col-span-2', row: 'row-span-1', z: 0, aspect: 'aspect-square', offsetY: 60 },
];

export default function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.from('.gallery-heading > *', {
        y: 80,
        opacity: 0,
        duration: 1.4,
        stagger: 0.14,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.gallery-heading', start: 'top 80%' },
      });

      gsap.utils.toArray<HTMLElement>('.g-item').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 120, opacity: 0, scale: 0.94 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1.6,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 90%' },
            delay: (i % 4) * 0.08,
          }
        );
      });

      // hover defocus
      const items = gsap.utils.toArray<HTMLElement>('.g-item');
      items.forEach((el) => {
        const inner = el.querySelector<HTMLElement>('.g-tilt');
        if (!inner) return;
        el.addEventListener('mouseenter', () => {
          gsap.to(inner, {
            scale: 1.06,
            z: 120,
            duration: 0.9,
            ease: 'power3.out',
          });
          items.forEach((other) => {
            if (other !== el) {
              gsap.to(other, {
                opacity: 0.32,
                filter: 'blur(8px) saturate(0.6)',
                duration: 0.7,
                ease: 'power3.out',
              });
            }
          });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(inner, {
            scale: 1,
            z: 0,
            duration: 1,
            ease: 'power3.out',
          });
          items.forEach((other) => {
            gsap.to(other, {
              opacity: 1,
              filter: 'blur(0px) saturate(1)',
              duration: 0.9,
              ease: 'power3.out',
            });
          });
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

  // cursor tilt on whole stage
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || getReducedMotion() || isMobile()) return;
    let raf = 0;
    let rx = 0;
    let ry = 0;
    const tick = () => {
      const targetRX = -(pointer.lerpNY - 0.5) * 4;
      const targetRY = (pointer.lerpNX - 0.5) * 5;
      rx += (targetRX - rx) * 0.06;
      ry += (targetRY - ry) * 0.06;
      stage.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(
        2
      )}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="gallery"
      ref={ref}
      className="relative bg-navy-950 py-40 lg:py-56 overflow-hidden"
    >
      <div className="mx-auto max-w-[1600px] px-6 lg:px-12">
        <header className="gallery-heading max-w-3xl mb-24">
          <div className="flex items-center gap-4 mb-8">
            <span className="block h-px w-12 bg-gold" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold">
              05 — Moments
            </p>
          </div>
          <h2 className="font-serif text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.98] text-ivory font-light">
            Quiet pleasures,
            <br />
            <span className="italic text-ivory/55">remembered later.</span>
          </h2>
        </header>

        <div
          className="stage-3d"
          style={{ perspective: '1800px' }}
        >
          <div
            ref={stageRef}
            className="grid grid-cols-6 lg:grid-cols-12 auto-rows-[180px] lg:auto-rows-[220px] gap-3 lg:gap-5 will-change-transform"
            style={{ transformStyle: 'preserve-3d', transition: 'transform 0.05s linear' }}
          >
            {gallery.map((g, i) => {
              const l = layout[i % layout.length];
              return (
                <figure
                  key={i}
                  className={`g-item group relative overflow-hidden cursor-pointer will-change-transform ${l.col} ${l.row}`}
                  style={{
                    transform: `translate3d(0, ${l.offsetY}px, ${l.z}px)`,
                    transformStyle: 'preserve-3d',
                  }}
                  data-cursor="view"
                >
                  <div className={`g-tilt relative w-full h-full will-change-transform`}>
                    <div className={`${l.aspect} h-full relative`}>
                      <Image
                        src={g.src}
                        alt={g.caption}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-navy-950/10 group-hover:bg-navy-950/65 transition-colors duration-700" />
                      <span className="pointer-events-none absolute top-3 right-3 w-6 h-6 border-t border-r border-gold/0 group-hover:border-gold/80 transition-all duration-700" />
                      <span className="pointer-events-none absolute bottom-3 left-3 w-6 h-6 border-b border-l border-gold/0 group-hover:border-gold/80 transition-all duration-700" />
                      <figcaption className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                        <span className="text-[10px] uppercase tracking-[0.4em] text-gold mb-2">
                          0{i + 1}
                        </span>
                        <span className="font-serif text-2xl text-ivory">
                          {g.caption}
                        </span>
                      </figcaption>
                    </div>
                  </div>
                </figure>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
