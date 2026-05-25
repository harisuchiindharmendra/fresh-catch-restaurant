'use client';

import { useEffect, useRef } from 'react';
import HeroVideo from './HeroVideo';
import { useSceneStore } from '@/store/scene-store';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';

/**
 * v6 hero — the same restraint as v5, with three additions that
 * elevate it from "minimal" to "lit":
 *
 *   1. Camera breath — the video subtly scales between 1.000 and 1.008
 *      over ~12 seconds. You don't see it; the room exhales.
 *   2. Right-edge gold throw — a soft warm gradient hugs the right
 *      third of the frame, the kind of off-camera fill that lights
 *      Aman Resorts hallway photography.
 *   3. Type pacing — eyebrow holds for 0.6s before the headline
 *      arrives; sub waits another beat. Heavier ease curve.
 *
 * The video stays sacred and untouched.
 */
export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const breathRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      // staggered, weighted intro
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });
      tl.from('.h-eyebrow', { y: 18, opacity: 0, duration: 1.6 }, 0)
        .from('.h-title-1', { y: 36, opacity: 0, duration: 1.8 }, 0.45)
        .from('.h-title-2', { y: 36, opacity: 0, duration: 1.8 }, 0.6)
        .from('.h-sub', { y: 22, opacity: 0, duration: 1.6 }, 1.1)
        .from('.h-cta', { y: 18, opacity: 0, duration: 1.4, stagger: 0.14 }, 1.4);

      // camera breath — runs forever, very slow
      gsap.to(breathRef.current, {
        scale: 1.008,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });

      // scroll-driven dolly + foreground recede
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
        y: -40,
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
        <div ref={breathRef} className="absolute inset-0 will-change-transform">
          <HeroVideo src="/video/hero-video.mp4" />
        </div>
        {/* directional shaping */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/55 via-navy-900/35 to-navy-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-transparent to-navy-950/30" />
        {/* right-edge gold throw — off-camera fill light */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 80% at 95% 50%, rgba(200,168,106,0.10) 0%, rgba(200,168,106,0.04) 35%, transparent 65%)',
          }}
        />
        {/* base vignette */}
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
        className="relative z-10 h-full mx-auto max-w-[1400px] px-8 lg:px-16 flex flex-col justify-end pb-28 lg:pb-36 will-change-transform"
      >
        <div className="max-w-3xl">
          <p className="h-eyebrow text-[10px] uppercase tracking-[0.55em] text-ivory/55 mb-12">
            Fresh Catch · Est. 2014
          </p>

          <h1 className="font-serif text-[clamp(2.8rem,8.4vw,8.2rem)] leading-[0.96] font-light text-ivory text-balance">
            <span className="h-title-1 block">Fresh from the ocean.</span>
            <span className="h-title-2 block italic text-ivory/65 mt-1">
              Crafted into art.
            </span>
          </h1>

          <p className="h-sub mt-12 max-w-md text-[15px] md:text-base text-ivory/55 leading-[1.95] font-light">
            An elevated seafood experience for unforgettable evenings.
          </p>

          <div className="mt-14 flex flex-col sm:flex-row items-start gap-10">
            <a
              href="#reserve"
              className="h-cta group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-ivory hover:text-gold transition-colors duration-700"
            >
              Reserve
              <span
                aria-hidden
                className="inline-block w-10 h-px bg-current transition-all duration-700 group-hover:w-16"
              />
            </a>
            <a
              href="#dishes"
              className="h-cta group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-ivory/55 hover:text-ivory transition-colors duration-700"
            >
              The Menu
              <span
                aria-hidden
                className="inline-block w-10 h-px bg-current transition-all duration-700 group-hover:w-16"
              />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
