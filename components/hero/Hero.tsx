'use client';

import { useEffect, useRef } from 'react';
import HeroVideo from './HeroVideo';
import { useSceneStore } from '@/store/scene-store';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * Quiet hero — keeps the client's video, removes every gimmick.
 *
 * Layers (back to front):
 *  - video (untouched)
 *  - soft dark gradient overlay
 *  - very subtle vignette
 *  - text: small eyebrow, large serif headline, restrained sub, two
 *    plain text-link CTAs
 *
 * No magnetic buttons, no char-split, no liquid filter, no chromatic
 * aberration, no marine particles, no caustics, no chapter mark, no
 * edition badge, no vertical timestamp, no roman numeral, no scroll
 * hint with animated bar. One slow fade-in on the text block. One
 * slow scroll-driven dolly on the video. That's it.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.from('.hero-fade > *', {
        y: 24,
        opacity: 0,
        duration: 1.6,
        stagger: 0.14,
        ease: 'power3.out',
        delay: 0.3,
      });

      gsap.to(videoWrapRef.current, {
        scale: 1.12,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.4,
        },
      });

      gsap.to(stageRef.current, {
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom 30%',
          scrub: 1.2,
        },
      });

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveScene(0),
        onEnterBack: () => setActiveScene(0),
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [setActiveScene]);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-navy-950"
    >
      <div
        ref={videoWrapRef}
        className="absolute inset-0 will-change-transform"
      >
        <HeroVideo src="/video/hero-video.mp4" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/55 via-navy-900/40 to-navy-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/65 via-transparent to-navy-950/35" />
        {/* corner-vignette pull */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(130% 90% at 50% 55%, transparent 55%, rgba(4,9,18,0.55) 92%, rgba(4,9,18,0.95) 100%)',
          }}
        />
      </div>

      <div
        ref={stageRef}
        className="relative z-10 h-full mx-auto max-w-[1400px] px-8 lg:px-16 flex flex-col justify-end pb-24 lg:pb-32 will-change-transform"
      >
        <div className="hero-fade max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/60 mb-10">
            Fresh Catch · Est. 2014
          </p>

          <h1 className="font-serif text-[clamp(2.6rem,7.4vw,7.2rem)] leading-[0.98] font-light text-ivory text-balance">
            Fresh from the ocean.
            <br />
            <span className="italic text-ivory/65">Crafted into art.</span>
          </h1>

          <p className="mt-10 max-w-md text-[15px] md:text-base text-ivory/55 leading-[1.85] font-light">
            An elevated seafood experience for unforgettable evenings.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-start gap-8">
            <a
              href="#reserve"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-ivory hover:text-gold transition-colors duration-700"
            >
              Reserve
              <span
                aria-hidden
                className="inline-block w-8 h-px bg-current transition-all duration-700 group-hover:w-12"
              />
            </a>
            <a
              href="#dishes"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-ivory/60 hover:text-ivory transition-colors duration-700"
            >
              The Menu
              <span
                aria-hidden
                className="inline-block w-8 h-px bg-current transition-all duration-700 group-hover:w-12"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
