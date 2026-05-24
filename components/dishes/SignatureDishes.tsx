'use client';

import { useEffect, useRef } from 'react';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { dishes } from '@/lib/config';
import { useSceneStore } from '@/store/scene-store';
import FloatingDish from './FloatingDish';
import Caustics from '@/components/effects/Caustics';

const positions = [
  { offsetX: 6, parallax: 80, rotate: -1.2, width: 'w-[68%] lg:w-[40%]', align: 'left' as const },
  { offsetX: 4, parallax: 140, rotate: 1.4, width: 'w-[72%] lg:w-[46%]', align: 'right' as const },
  { offsetX: 10, parallax: 100, rotate: -0.8, width: 'w-[66%] lg:w-[38%]', align: 'left' as const },
  { offsetX: 2, parallax: 170, rotate: 1.0, width: 'w-[74%] lg:w-[48%]', align: 'right' as const },
];

export default function SignatureDishes() {
  const ref = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current?.children || [], {
        y: 80,
        opacity: 0,
        duration: 1.6,
        stagger: 0.14,
        ease: 'expo.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 75%' },
      });

      gsap.utils.toArray<HTMLElement>('.floating-dish').forEach((el, i) => {
        gsap.from(el, {
          y: 140,
          opacity: 0,
          duration: 1.8,
          ease: 'expo.out',
          delay: (i % 2) * 0.18,
          scrollTrigger: { trigger: el, start: 'top 85%' },
        });
      });

      // sibling defocus on hover (group-style cross-component effect)
      const items = gsap.utils.toArray<HTMLElement>('.floating-dish');
      items.forEach((el) => {
        el.addEventListener('mouseenter', () => {
          items.forEach((other) => {
            if (other !== el) {
              gsap.to(other, {
                opacity: 0.32,
                filter: 'blur(6px)',
                duration: 0.8,
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
              filter: 'blur(0px)',
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
      className="relative bg-navy-950 pt-40 pb-72 lg:pt-56 lg:pb-96 overflow-hidden"
    >
      <Caustics intensity={0.25} />

      <div className="relative mx-auto max-w-[1500px] px-6 lg:px-12">
        <header
          ref={headingRef}
          className="max-w-3xl mb-40 lg:mb-56 mix-blend-difference"
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="block h-px w-12 bg-gold" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold">
              02 — The Menu
            </p>
          </div>
          <h2 className="font-serif text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.98] text-ivory font-light">
            A short list.
            <br />
            <span className="italic text-ivory/55">Each plate, a study.</span>
          </h2>
          <p className="mt-10 max-w-xl text-ivory/55 text-base leading-[1.85] font-light">
            We change the menu with the tide. Four dishes the kitchen has
            refused to take off the pass — artifacts, not menu items.
          </p>
        </header>

        <div className="stage-3d space-y-56 lg:space-y-72">
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
