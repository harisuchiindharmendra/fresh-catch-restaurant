'use client';

import { useEffect, useRef, useState } from 'react';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { useSceneStore } from '@/store/scene-store';
import MagneticButton from '@/components/ui/MagneticButton';
import { pointer } from '@/lib/pointer';
import { getReducedMotion, isMobile } from '@/lib/scroll';

export default function Reservation() {
  const ref = useRef<HTMLElement>(null);
  const focusRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.from('.cta-chapter > *', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });

      gsap.fromTo(
        '.cta-headline .char',
        { yPercent: 120, opacity: 0 },
        {
          yPercent: 0,
          opacity: 1,
          duration: 1.4,
          stagger: 0.02,
          ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 70%' },
        }
      );

      gsap.from('.cta-sub', {
        y: 30,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 65%' },
      });

      gsap.from('.cta-form > *, .cta-thanks', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.cta-form-wrap', start: 'top 80%' },
      });

      gsap.from('.cta-tail', {
        y: 20,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 55%' },
      });

      // narrowing focus — vignette tightens
      gsap.fromTo(
        '.cta-focus',
        { background: 'radial-gradient(120% 90% at 50% 50%, rgba(4,9,18,0) 70%, rgba(4,9,18,0.6) 100%)' },
        {
          background: 'radial-gradient(70% 50% at 50% 50%, rgba(4,9,18,0) 40%, rgba(4,9,18,0.92) 100%)',
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 70%',
            end: 'bottom 80%',
            scrub: 1.2,
          },
        }
      );

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveScene(5),
        onEnterBack: () => setActiveScene(5),
      });
    }, ref);
    return () => ctx.revert();
  }, [setActiveScene]);

  // soft cursor pull on the focus mask center
  useEffect(() => {
    const el = focusRef.current;
    if (!el || getReducedMotion() || isMobile()) return;
    let raf = 0;
    let lx = 50;
    let ly = 50;
    const tick = () => {
      const targetX = 50 + (pointer.lerpNX - 0.5) * 6;
      const targetY = 50 + (pointer.lerpNY - 0.5) * 6;
      lx += (targetX - lx) * 0.04;
      ly += (targetY - ly) * 0.04;
      el.style.background = `radial-gradient(70% 55% at ${lx.toFixed(
        1
      )}% ${ly.toFixed(1)}%, rgba(200,168,106,0.10), transparent 65%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const headline = 'Take your seat at the sea.';
  const renderChars = (text: string) =>
    text.split('').map((c, i) => (
      <span key={i} className="char inline-block">
        {c === ' ' ? ' ' : c}
      </span>
    ));

  return (
    <section
      id="reserve"
      ref={ref}
      className="relative min-h-screen bg-navy-950 flex items-center overflow-hidden"
    >
      {/* deep ambient backdrop */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_60%,_rgba(35,84,138,0.18),_transparent_60%)] breath" />
        <div
          ref={focusRef}
          className="absolute inset-0 pointer-events-none mix-blend-screen"
        />
        <div className="cta-focus absolute inset-0 pointer-events-none" />
        <div className="absolute inset-x-0 top-0 h-px gold-line" />
        <div className="absolute inset-x-0 bottom-0 h-px gold-line opacity-50" />
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 lg:px-12 py-32 text-center w-full">
        <div className="cta-chapter flex items-center justify-center gap-4 mb-10">
          <span className="block h-px w-12 bg-gold" />
          <p className="text-[10px] uppercase tracking-[0.5em] text-gold">
            06 — Tonight
          </p>
          <span className="block h-px w-12 bg-gold" />
        </div>

        <h2 className="cta-headline font-serif text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.98] text-ivory font-light text-balance overflow-hidden">
          <span className="block">{renderChars('Take your seat')}</span>
          <span className="block italic text-ivory/55">
            {renderChars('at the sea.')}
          </span>
        </h2>

        <p className="cta-sub mt-10 max-w-xl mx-auto text-ivory/55 text-lg leading-[1.85] font-light">
          A short night. A long memory. Seatings at 18:00, 20:30, and 22:30.
          Reservations open thirty days ahead.
        </p>

        <div className="cta-form-wrap mt-16">
          {!submitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="cta-form space-y-6 max-w-md mx-auto text-left"
            >
              <div className="grid grid-cols-2 gap-5">
                <input
                  required
                  placeholder="Name"
                  data-cursor="type"
                  className="w-full bg-transparent border-b border-ivory/15 focus:border-gold py-3 text-sm text-ivory placeholder:text-muted outline-none transition-colors duration-500"
                />
                <input
                  required
                  type="email"
                  placeholder="Email"
                  data-cursor="type"
                  className="w-full bg-transparent border-b border-ivory/15 focus:border-gold py-3 text-sm text-ivory placeholder:text-muted outline-none transition-colors duration-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-5">
                <input
                  required
                  type="date"
                  data-cursor="date"
                  className="w-full bg-transparent border-b border-ivory/15 focus:border-gold py-3 text-sm text-ivory placeholder:text-muted outline-none transition-colors duration-500"
                />
                <select
                  required
                  defaultValue=""
                  data-cursor="guests"
                  className="w-full bg-transparent border-b border-ivory/15 focus:border-gold py-3 text-sm text-ivory outline-none transition-colors duration-500 cursor-pointer"
                >
                  <option value="" disabled className="bg-navy-900">
                    Guests
                  </option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                    <option key={n} value={n} className="bg-navy-900">
                      {n} guest{n > 1 ? 's' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-6 flex justify-center">
                <MagneticButton variant="solid" cursorLabel="confirm">
                  Reserve Your Table
                  <span aria-hidden>→</span>
                </MagneticButton>
              </div>
            </form>
          ) : (
            <div className="cta-thanks max-w-md mx-auto space-y-4">
              <p className="font-serif text-4xl text-ivory">Thank you.</p>
              <p className="text-ivory/60 text-sm leading-relaxed">
                Your request has been received. We will confirm by email
                within the hour.
              </p>
            </div>
          )}
        </div>

        <p className="cta-tail mt-20 text-[10px] uppercase tracking-[0.4em] text-muted">
          Or call · <a href="tel:+15552473474" data-cursor="call" className="text-ivory/70 hover:text-gold transition-colors">+1 (555) 247-FISH</a>
        </p>
      </div>
    </section>
  );
}
