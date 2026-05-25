'use client';

import { useEffect, useRef, useState } from 'react';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { useSceneStore } from '@/store/scene-store';

/**
 * Quiet final scene. No ocean wave SVG, no chapter mark, no char-split
 * headline, no focus-narrowing radial mask, no magnetic button. Just a
 * calm form and a line of text. The end.
 */
export default function Reservation() {
  const ref = useRef<HTMLElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.from('.cta-fade > *', {
        y: 24,
        opacity: 0,
        duration: 1.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 75%' },
      });

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

  return (
    <section
      id="reserve"
      ref={ref}
      className="relative min-h-screen bg-navy-950 flex items-center"
    >
      <div className="cta-fade mx-auto max-w-2xl px-8 lg:px-16 py-40 lg:py-56 w-full">
        <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/45 mb-10">
          Reservations
        </p>

        <h2 className="font-serif text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[1.0] text-ivory font-light">
          Take your seat
          <br />
          <span className="italic text-ivory/55">at the sea.</span>
        </h2>

        <p className="mt-10 max-w-md text-[15px] text-ivory/55 leading-[1.9] font-light">
          Seatings at 18:00, 20:30, and 22:30. Reservations open thirty days
          ahead.
        </p>

        {!submitted ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="mt-16 space-y-7 max-w-md"
          >
            <div className="grid grid-cols-2 gap-6">
              <input
                required
                placeholder="Name"
                className="w-full bg-transparent border-b border-ivory/15 focus:border-ivory/55 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none transition-colors duration-700"
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="w-full bg-transparent border-b border-ivory/15 focus:border-ivory/55 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none transition-colors duration-700"
              />
            </div>
            <div className="grid grid-cols-2 gap-6">
              <input
                required
                type="date"
                className="w-full bg-transparent border-b border-ivory/15 focus:border-ivory/55 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none transition-colors duration-700"
              />
              <select
                required
                defaultValue=""
                className="w-full bg-transparent border-b border-ivory/15 focus:border-ivory/55 py-3 text-sm text-ivory outline-none transition-colors duration-700 cursor-pointer"
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

            <button
              type="submit"
              className="group mt-8 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.35em] text-ivory hover:text-gold transition-colors duration-700"
            >
              Request a table
              <span
                aria-hidden
                className="inline-block w-8 h-px bg-current transition-all duration-700 group-hover:w-12"
              />
            </button>
          </form>
        ) : (
          <div className="mt-16 max-w-md space-y-3">
            <p className="font-serif italic text-3xl text-ivory">Thank you.</p>
            <p className="text-ivory/55 text-sm leading-relaxed">
              We will confirm by email within the hour.
            </p>
          </div>
        )}

        <p className="mt-20 text-[10px] uppercase tracking-[0.4em] text-ivory/35">
          Or call ·{' '}
          <a
            href="tel:+15552473474"
            className="text-ivory/65 hover:text-ivory transition-colors duration-700"
          >
            +1 (555) 247-FISH
          </a>
        </p>
      </div>
    </section>
  );
}
