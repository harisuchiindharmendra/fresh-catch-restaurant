'use client';

import { useEffect, useRef } from 'react';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { dishes } from '@/lib/config';
import { useSceneStore } from '@/store/scene-store';
import FloatingDish from './FloatingDish';
import Caustics from '@/components/effects/Caustics';

const positions: {
  offsetX: number;
  parallax: number;
  rotate: number;
  width: string;
  align: 'left' | 'right';
  numeral: string;
}[] = [
  { offsetX: 4, parallax: 90, rotate: -1.2, width: 'w-[78%] lg:w-[42%]', align: 'left', numeral: 'I' },
  { offsetX: 2, parallax: 150, rotate: 1.4, width: 'w-[82%] lg:w-[48%]', align: 'right', numeral: 'II' },
  { offsetX: 10, parallax: 110, rotate: -0.8, width: 'w-[72%] lg:w-[38%]', align: 'left', numeral: 'III' },
  { offsetX: 4, parallax: 180, rotate: 1.0, width: 'w-[84%] lg:w-[50%]', align: 'right', numeral: 'IV' },
];

export default function SignatureDishes() {
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current?.children || [], {
        y: 100,
        opacity: 0,
        duration: 1.8,
        stagger: 0.16,
        ease: 'expo.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 75%' },
      });

      gsap.utils.toArray<HTMLElement>('.floating-dish').forEach((el, i) => {
        const direction = i % 2 === 0 ? -40 : 40;
        gsap.from(el, {
          y: 160,
          x: direction,
          opacity: 0,
          duration: 2,
          ease: 'expo.out',
          delay: (i % 2) * 0.18,
          scrollTrigger: { trigger: el, start: 'top 88%' },
        });
      });

      const items = gsap.utils.toArray<HTMLElement>('.floating-dish');
      items.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          items.forEach((other) => {
            if (other !== el) {
              gsap.to(other, {
                opacity: 0.22,
                filter: 'blur(8px) saturate(0.5)',
                duration: 0.9,
                ease: 'power3.out',
              });
            }
          });
          gsap.to(el, { zIndex: 5, duration: 0 });
        });
        el.addEventListener('mouseleave', () => {
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
      className="relative bg-navy-950 pt-44 pb-80 lg:pt-60 lg:pb-[26rem] overflow-hidden"
    >
      <Caustics intensity={0.25} />

      {/* monumental chapter mark */}
      <div className="pointer-events-none absolute top-20 left-6 lg:left-12 flex items-end gap-5 z-10">
        <span className="font-serif italic text-[clamp(4rem,7vw,7rem)] leading-none text-gold/95 editorial-numeral">
          II
        </span>
        <div className="pb-3 flex flex-col gap-1.5">
          <span className="block h-px w-12 bg-gold" />
          <span className="text-[10px] uppercase tracking-[0.4em] text-ivory/80">
            The Menu
          </span>
          <span className="text-[10px] uppercase tracking-[0.3em] text-muted">
            A study in restraint
          </span>
        </div>
      </div>

      <div className="relative mx-auto max-w-[1600px] px-6 lg:px-12">
        <header ref={headingRef} className="max-w-3xl mb-44 lg:mb-60 mt-32">
          <h2 className="font-serif text-[clamp(2.6rem,7vw,6rem)] leading-[0.95] text-ivory font-light">
            Four plates.
            <br />
            <span className="italic text-ivory/55">Each, an argument.</span>
          </h2>
          <p className="mt-12 max-w-xl text-ivory/55 text-base leading-[1.9] font-light">
            We change the menu with the tide. Below, four plates the kitchen
            has refused to take off the pass — artifacts, not menu items.
          </p>
          <p className="mt-6 text-[10px] uppercase tracking-[0.5em] text-gold/80">
            Hover · Observe · Recede
          </p>
        </header>

        <div className="stage-3d space-y-72 lg:space-y-[26rem]">
          {dishes.map((dish, i) => (
            <FloatingDish
              key={dish.name}
              index={i}
              name={dish.name}
              description={dish.description}
              image={dish.image}
              pairing={dish.pairing}
              {...positions[i % positions.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
