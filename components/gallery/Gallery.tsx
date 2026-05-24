'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { gallery } from '@/lib/config';
import { useSceneStore } from '@/store/scene-store';
import { pointer } from '@/lib/pointer';
import { getReducedMotion, isMobile } from '@/lib/scroll';

const layout: { col: string; row: string; z: number; aspect: string; offsetY: number }[] = [
  { col: 'col-span-6 lg:col-span-3', row: 'row-span-2', z: -90, aspect: 'aspect-[3/4]', offsetY: 20 },
  { col: 'col-span-6 lg:col-span-4', row: 'row-span-1', z: 30, aspect: 'aspect-[4/3]', offsetY: 60 },
  { col: 'col-span-6 lg:col-span-3', row: 'row-span-1', z: -160, aspect: 'aspect-square', offsetY: -30 },
  { col: 'col-span-6 lg:col-span-2', row: 'row-span-1', z: 80, aspect: 'aspect-square', offsetY: 100 },
  { col: 'col-span-6 lg:col-span-5', row: 'row-span-1', z: -50, aspect: 'aspect-[4/3]', offsetY: 0 },
  { col: 'col-span-6 lg:col-span-3', row: 'row-span-2', z: 50, aspect: 'aspect-[3/4]', offsetY: 50 },
  { col: 'col-span-6 lg:col-span-2', row: 'row-span-1', z: -120, aspect: 'aspect-square', offsetY: -10 },
  { col: 'col-span-6 lg:col-span-2', row: 'row-span-1', z: 10, aspect: 'aspect-square', offsetY: 80 },
];

export default function Gallery() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.from('.gallery-heading > *', {
        y: 100,
        opacity: 0,
        duration: 1.6,
        stagger: 0.16,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.gallery-heading', start: 'top 80%' },
      });

      gsap.utils.toArray<HTMLElement>('.g-item').forEach((el, i) => {
        gsap.fromTo(
          el,
          { y: 140, opacity: 0, scale: 0.92, rotate: i % 2 === 0 ? -1.5 : 1.5 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotate: 0,
            duration: 1.8,
            ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 92%' },
            delay: (i % 4) * 0.08,
          }
        );
      });

      const items = gsap.utils.toArray<HTMLElement>('.g-item');
      items.forEach((el) => {
        const inner = el.querySelector<HTMLElement>('.g-tilt');
        if (!inner) return;
        el.addEventListener('mouseenter', () => {
          gsap.to(inner, {
            scale: 1.1,
            z: 220,
            duration: 1,
            ease: 'power3.out',
          });
          items.forEach((other) => {
            if (other !== el) {
              gsap.to(other, {
                opacity: 0.18,
                filter: 'blur(10px) saturate(0.5)',
                duration: 0.8,
                ease: 'power3.out',
              });
            }
          });
        });
        el.addEventListener('mouseleave', () => {
          gsap.to(inner, {
            scale: 1,
            z: 0,
            duration: 1.1,
            ease: 'power3.out',
          });
          items.forEach((other) => {
            gsap.to(other, {
              opacity: 1,
              filter: 'blur(0px) saturate(1)',
              duration: 1,
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

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || getReducedMotion() || isMobile()) return;
    let raf = 0;
    let rx = 0;
    let ry = 0;
    const tick = () => {
      const targetRX = -(pointer.lerpNY - 0.5) * 5;
      const targetRY = (pointer.lerpNX - 0.5) * 6;
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
      className="relative bg-navy-950 py-44 lg:py-60 overflow-hidden"
    >
      {/* chapter mark */}
      <div className="pointer-events-none absolute top-20 left-6 lg:left-12 flex items-end gap-5 z-10">
        <span className="font-serif italic text-[clamp(4rem,7vw,7rem)] leading-none text-gold/95 editorial-numeral">
          V
        </span>
        <div className="pb-3 flex flex-col gap-1.5">
          <span className="block h-px w-12 bg-gold" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-ivory/80">
            Memory
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
            Eight nights at the pass
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-[1700px] px-6 lg:px-12">
        <header className="gallery-heading max-w-3xl mb-28 mt-32">
          <h2 className="font-serif text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] text-ivory font-light">
            Quiet pleasures,
            <br />
            <span className="italic text-ivory/55">remembered later.</span>
          </h2>
          <p className="mt-10 max-w-xl text-ivory/55 text-base leading-[1.85] font-light">
            Hover any frame — the others recede. A small physics for memory.
          </p>
        </header>

        <div className="stage-3d" style={{ perspective: '2200px' }}>
          <div
            ref={stageRef}
            className="grid grid-cols-6 lg:grid-cols-12 auto-rows-[180px] lg:auto-rows-[240px] gap-3 lg:gap-5 will-change-transform"
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
