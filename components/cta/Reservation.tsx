'use client';

import { useEffect, useRef, useState } from 'react';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { useSceneStore } from '@/store/scene-store';

/**
 * v7 reservation — left-anchored on a 12-column grid. The form
 * occupies cols 2–7. Cols 8–12 stay empty. The negative space IS
 * the design.
 *
 * No centered alignment, no chapter mark, no animated focus mask,
 * no ocean wave. The room exhales here. The form is small.
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
        scrollTrigger: { trigger: ref.current, start: 'top 78%' },
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
      <div className="mx-auto max-w-[1500px] px-8 lg:px-16 py-44 lg:py-60 w-full">
        <div className="grid grid-cols-12 gap-8">
          <div className="cta-fade col-span-12 lg:col-span-6 lg:col-start-2 space-y-10">
            <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/40">
              Reservations
            </p>

            <h2 className="font-serif text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[1.0] text-ivory font-light">
              Take your seat
              <br />
              <span className="italic text-ivory/55">at the sea.</span>
            </h2>

            <p className="max-w-md text-[15px] text-ivory/50 leading-[1.95] font-light">
              Seatings at 18:00, 20:30, and 22:30. Reservations open thirty
              days ahead.
            </p>

            {!submitted ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-6 max-w-md pt-2"
              >
                <div className="grid grid-cols-2 gap-6">
                  <input
                    required
                    placeholder="Name"
                    className="w-full bg-transparent border-b border-ivory/12 focus:border-ivory/50 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none transition-colors duration-700"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email"
                    className="w-full bg-transparent border-b border-ivory/12 focus:border-ivory/50 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none transition-colors duration-700"
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <input
                    required
                    type="date"
                    className="w-full bg-transparent border-b border-ivory/12 focus:border-ivory/50 py-3 text-sm text-ivory placeholder:text-ivory/35 outline-none transition-colors duration-700"
                  />
                  <select
                    required
                    defaultValue=""
                    className="w-full bg-transparent border-b border-ivory/12 focus:border-ivory/50 py-3 text-sm text-ivory outline-none transition-colors duration-700 cursor-pointer"
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
                  className="group mt-6 inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-ivory hover:text-gold transition-colors duration-700"
                >
                  Request a table
                  <span
                    aria-hidden
                    className="inline-block w-10 h-px bg-current transition-all duration-700 group-hover:w-16"
                  />
                </button>
              </form>
            ) : (
              <div className="pt-4 space-y-3">
                <p className="font-serif italic text-3xl text-ivory">
                  Thank you.
                </p>
                <p className="text-ivory/55 text-sm leading-relaxed max-w-md">
                  We will confirm by email within the hour.
                </p>
              </div>
            )}

            <p className="pt-10 text-[10px] uppercase tracking-[0.4em] text-ivory/30">
              Or call ·{' '}
              <a
                href="tel:+15552473474"
                className="text-ivory/55 hover:text-ivory transition-colors duration-700"
              >
                +1 555 247 FISH
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
