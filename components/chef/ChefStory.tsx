'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { useSceneStore } from '@/store/scene-store';

/**
 * Quiet documentary frame.
 *
 * No letterbox bars, no light sweep, no cursor spotlight, no drop cap,
 * no vertical Twenty type, no word-by-word reveal, no chapter mark.
 *
 * Just: a tall portrait, three short paragraphs, an attribution. Slow
 * parallax on the image. One fade on the text.
 */
export default function ChefStory() {
  const ref = useRef<HTMLElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.from('.chef-fade > *', {
        y: 24,
        opacity: 0,
        duration: 1.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.chef-fade', start: 'top 78%' },
      });

      gsap.from('.chef-portrait', {
        opacity: 0,
        scale: 1.05,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });

      gsap.to('.chef-portrait-inner', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      });

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveScene(2),
        onEnterBack: () => setActiveScene(2),
      });
    }, ref);
    return () => ctx.revert();
  }, [setActiveScene]);

  return (
    <section
      id="chef"
      ref={ref}
      className="relative bg-navy-950 py-40 lg:py-56"
    >
      <div className="mx-auto max-w-[1400px] px-8 lg:px-16 grid grid-cols-12 gap-10 lg:gap-20 items-center">
        <div className="chef-portrait col-span-12 lg:col-span-7 relative aspect-[4/5] lg:aspect-[5/6] overflow-hidden bg-navy-800/30">
          <div className="chef-portrait-inner absolute inset-0 -top-10 -bottom-10">
            <Image
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1400&q=85"
              alt="Chef Marcus Aurelio"
              fill
              sizes="(max-width: 1024px) 100vw, 58vw"
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
        </div>

        <div className="chef-fade col-span-12 lg:col-span-5 space-y-10">
          <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/45">
            The Chef
          </p>

          <h2 className="font-serif text-[clamp(2.2rem,4.6vw,4.2rem)] leading-[1.05] text-ivory font-light">
            Twenty years
            <br />
            <span className="italic text-ivory/55">at the pass.</span>
          </h2>

          <div className="space-y-7 text-ivory/60 text-[15px] lg:text-base leading-[1.95] max-w-md font-light">
            <p>
              Chef Marcus Aurelio started his career on a small fishing boat
              off the Galician coast — long before he ever set foot in a
              Michelin kitchen.
            </p>
            <p>
              The menu is not a statement. It is a quiet correspondence
              between season, supplier, and the room. Three fishermen.
              Nothing frozen. When the sea is rough, the menu is short.
            </p>
            <p className="font-serif italic text-lg lg:text-xl text-ivory/75 leading-snug pt-2">
              You cannot improve what the ocean has already perfected. You
              can only listen, and step out of the way.
            </p>
          </div>

          <div className="pt-2">
            <p className="text-sm text-ivory/85 font-medium">Marcus Aurelio</p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-ivory/40 mt-1">
              Chef · Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
