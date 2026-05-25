'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { dishes } from '@/lib/config';
import { useSceneStore } from '@/store/scene-store';

/**
 * Editorial — not a grid, not "floating artifacts", not Roman-numeral
 * backdrops. Just dishes presented like a high-fashion magazine spread:
 * one per "page", alternating left/right, restrained typography, generous
 * negative space. Single soft fade-up on enter.
 */
export default function SignatureDishes() {
  const ref = useRef<HTMLElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('.spread').forEach((el) => {
        gsap.from(el.querySelectorAll('.spread-fade'), {
          y: 30,
          opacity: 0,
          duration: 1.6,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 78%' },
        });
        gsap.from(el.querySelector('.spread-image'), {
          opacity: 0,
          scale: 1.04,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 78%' },
        });
      });

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveScene(1),
        onEnterBack: () => setActiveScene(1),
      });
    }, ref);
    return () => ctx.revert();
  }, [setActiveScene]);

  return (
    <section
      id="dishes"
      ref={ref}
      className="relative bg-navy-950 py-40 lg:py-56"
    >
      <div className="mx-auto max-w-[1400px] px-8 lg:px-16">
        <header className="max-w-2xl mb-40 lg:mb-56 spread">
          <p className="spread-fade text-[10px] uppercase tracking-[0.5em] text-ivory/45 mb-8">
            The Menu
          </p>
          <h2 className="spread-fade font-serif text-[clamp(2.2rem,5vw,4.5rem)] leading-[1.05] text-ivory font-light">
            A short list.
            <br />
            <span className="italic text-ivory/50">Each, considered.</span>
          </h2>
        </header>

        <div className="space-y-44 lg:space-y-60">
          {dishes.map((dish, i) => {
            const isEven = i % 2 === 0;
            return (
              <article
                key={dish.name}
                className={`spread grid grid-cols-12 gap-8 lg:gap-16 items-end ${
                  isEven ? '' : ''
                }`}
              >
                <div
                  className={`spread-image relative col-span-12 lg:col-span-7 ${
                    isEven ? 'lg:col-start-1' : 'lg:col-start-6'
                  }`}
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-navy-800/30">
                    <Image
                      src={dish.image}
                      alt={dish.name}
                      fill
                      sizes="(max-width: 1024px) 100vw, 58vw"
                      className="object-cover"
                    />
                  </div>
                </div>

                <div
                  className={`col-span-12 lg:col-span-4 ${
                    isEven ? 'lg:col-start-9' : 'lg:col-start-2 lg:row-start-1'
                  } pb-4 lg:pb-12`}
                >
                  <p className="spread-fade text-[10px] uppercase tracking-[0.4em] text-ivory/40 mb-6">
                    Plate {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="spread-fade font-serif text-3xl lg:text-5xl text-ivory font-light leading-[1.05]">
                    {dish.name}
                  </h3>
                  <p className="spread-fade mt-6 text-ivory/55 text-[15px] leading-[1.9] max-w-sm">
                    {dish.description}
                  </p>
                  <p className="spread-fade mt-8 text-[10px] uppercase tracking-[0.4em] text-ivory/35">
                    Paired with
                  </p>
                  <p className="spread-fade mt-2 text-sm text-ivory/60 italic font-serif">
                    {dish.pairing}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
