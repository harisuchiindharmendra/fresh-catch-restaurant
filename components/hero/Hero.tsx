'use client';

import { useEffect, useRef } from 'react';
import HeroVideo from './HeroVideo';
import HeroParticles from './HeroParticles';
import HeroTitle from './HeroTitle';
import Caustics from '@/components/effects/Caustics';
import MagneticButton from '@/components/ui/MagneticButton';
import { useSceneStore } from '@/store/scene-store';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { pointer } from '@/lib/pointer';

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();

    const ctx = gsap.context(() => {
      // intro choreography
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('.eyebrow-line', {
        scaleX: 0,
        duration: 1.6,
        transformOrigin: '0% 50%',
      })
        .from(
          '.eyebrow-text',
          { opacity: 0, letterSpacing: '0.1em', duration: 1.6 },
          '-=1.4'
        )
        .from(
          '.char',
          {
            yPercent: 110,
            duration: 1.6,
            stagger: { each: 0.015, from: 'start' },
          },
          '-=1.2'
        )
        .from(
          subRef.current,
          { y: 30, opacity: 0, duration: 1.2 },
          '-=1.0'
        )
        .from(
          ctaRef.current?.children || [],
          { y: 22, opacity: 0, duration: 1, stagger: 0.1 },
          '-=0.8'
        )
        .from(scrollHintRef.current, { opacity: 0, duration: 1 }, '-=0.5');

      // camera-dolly INTO the scene as user scrolls
      gsap.to(videoWrapRef.current, {
        scale: 1.25,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // foreground content recedes (push back into Z, slight blur, fade)
      gsap.to(stageRef.current, {
        yPercent: -18,
        scale: 0.92,
        filter: 'blur(8px)',
        opacity: 0,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.2,
        },
      });

      // overlay darkens as scroll goes — sense of going deeper
      gsap.to('.hero-deep', {
        opacity: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
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

  // subtle pointer parallax on the whole hero stage (very soft)
  useEffect(() => {
    const stage = stageRef.current;
    const video = videoWrapRef.current;
    if (!stage || !video) return;
    let raf = 0;
    let cx = 0;
    let cy = 0;
    const tick = () => {
      const tx = (pointer.lerpNX - 0.5) * 18;
      const ty = (pointer.lerpNY - 0.5) * 12;
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      stage.style.setProperty('--px', `${cx.toFixed(2)}px`);
      stage.style.setProperty('--py', `${cy.toFixed(2)}px`);
      video.style.setProperty('--vx', `${(-cx * 0.4).toFixed(2)}px`);
      video.style.setProperty('--vy', `${(-cy * 0.4).toFixed(2)}px`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="hero"
      ref={sectionRef}
      className="relative h-[110vh] w-full overflow-hidden bg-navy-950"
    >
      {/* deepest layer — video */}
      <div
        ref={videoWrapRef}
        className="hero-video-wrap absolute inset-0 will-change-transform"
        style={{ transform: 'translate3d(var(--vx,0), var(--vy,0), 0)' }}
      >
        <HeroVideo src="/video/hero-video.mp4" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/55 via-navy-900/45 to-navy-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/75 via-transparent to-navy-950/30" />
        <div className="hero-deep absolute inset-0 bg-navy-950 opacity-0" />
      </div>

      {/* mid layer — caustics + particles */}
      <Caustics intensity={0.55} />
      <HeroParticles />

      {/* foreground content */}
      <div
        ref={stageRef}
        className="relative z-10 h-full mx-auto max-w-[1480px] px-6 lg:px-12 flex flex-col justify-center will-change-transform"
        style={{ transform: 'translate3d(var(--px,0), var(--py,0), 0)' }}
      >
        <div className="max-w-5xl">
          <div ref={eyebrowRef} className="flex items-center gap-4 mb-10">
            <span className="eyebrow-line block h-px w-12 bg-gold" />
            <p className="eyebrow-text text-[11px] uppercase tracking-[0.5em] text-gold">
              Fresh Catch · Est. 2014
            </p>
          </div>

          <HeroTitle lineOne="Fresh From The Ocean." lineTwo="Crafted Into Art." />

          <p
            ref={subRef}
            className="mt-10 max-w-xl text-base md:text-lg text-ivory/70 leading-relaxed font-light"
          >
            An elevated seafood dining experience designed for unforgettable
            nights — where every plate is a quiet conversation with the sea.
          </p>

          <div
            ref={ctaRef}
            className="mt-14 flex flex-col sm:flex-row items-start gap-4"
          >
            <MagneticButton
              href="#reserve"
              variant="solid"
              cursorLabel="reserve"
            >
              Reserve a Table
              <span aria-hidden>→</span>
            </MagneticButton>
            <MagneticButton
              href="#dishes"
              variant="ghost"
              cursorLabel="enter"
            >
              Explore Experience
              <span aria-hidden>→</span>
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* scroll hint */}
      <div
        ref={scrollHintRef}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 text-ivory/55"
      >
        <span className="text-[10px] uppercase tracking-[0.4em]">Enter</span>
        <span className="relative block w-px h-14 overflow-hidden bg-ivory/10">
          <span className="absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-gold to-transparent drift-down" />
        </span>
      </div>

      {/* depth scrim — corners pulled in */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[8]"
        style={{
          background:
            'radial-gradient(140% 100% at 50% 60%, transparent 50%, rgba(4,9,18,0.55) 85%, rgba(4,9,18,1) 100%)',
        }}
      />
    </section>
  );
}
