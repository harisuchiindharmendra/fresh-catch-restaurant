'use client';

import { useEffect, useRef, useState } from 'react';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { useSceneStore } from '@/store/scene-store';
import { siteConfig } from '@/lib/config';

/**
 * v10 reservation — left-anchored on a 12-column grid. The form
 * occupies cols 2–7. Right side holds visit info + order CTAs.
 *
 * Date input: native calendar picker preserved. Empty state shows a
 * refined "Select date" overlay via peer-invalid; native "mm/dd/yyyy"
 * is hidden via CSS until value or focus.
 */
export default function Reservation() {
  const ref = useRef<HTMLElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);
  const [submitted, setSubmitted] = useState(false);
  const a = siteConfig.address;

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

      gsap.from('.cta-aside > *', {
        y: 20,
        opacity: 0,
        duration: 1.4,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 70%' },
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
      <div className="mx-auto max-w-[1500px] px-8 lg:px-16 py-36 lg:py-52 w-full">
        <div className="grid grid-cols-12 gap-y-16 gap-x-8">
          {/* Form column — cols 2-7 */}
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
              We hold seatings through the day and into the evening. Tables
              for two through eight, by reservation.
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
                  {/* Date field — native calendar still opens.
                      Empty state shows our overlay placeholder; native
                      "mm/dd/yyyy" hidden until focus or value (CSS in globals). */}
                  <div className="relative">
                    <input
                      required
                      type="date"
                      aria-label="Reservation date"
                      className="date-input peer w-full bg-transparent border-b border-ivory/12 focus:border-ivory/50 py-3 text-sm text-ivory outline-none transition-colors duration-700"
                    />
                    <span
                      aria-hidden
                      className="date-placeholder pointer-events-none absolute inset-y-0 left-0 flex items-center text-sm text-ivory/35 transition-opacity duration-300 peer-focus:opacity-0 peer-valid:opacity-0"
                    >
                      Select date
                    </span>
                  </div>
                  <select
                    required
                    defaultValue=""
                    aria-label="Number of guests"
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
                  We will confirm by phone within the hour.
                </p>
              </div>
            )}

            <p className="pt-10 text-[10px] uppercase tracking-[0.4em] text-ivory/30">
              Or call ·{' '}
              <a
                href={`tel:${siteConfig.phone.tel}`}
                className="text-ivory/60 hover:text-ivory transition-colors duration-700"
              >
                {siteConfig.phone.display}
              </a>
            </p>
          </div>

          {/* Visit + Order column — cols 9-11 */}
          <aside className="cta-aside col-span-12 lg:col-span-3 lg:col-start-9 space-y-12 lg:pt-32">
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/40">
                Visit
              </p>
              <address className="not-italic text-[14px] text-ivory/70 leading-[1.85] font-light">
                {a.line1}
                <br />
                {a.line2}
                <br />
                {a.city}, {a.state} {a.postal}
              </address>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${a.line1}, ${a.line2}, ${a.city}, ${a.state} ${a.postal}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-ivory/55 hover:text-ivory transition-colors duration-700"
              >
                Directions
                <span
                  aria-hidden
                  className="inline-block w-8 h-px bg-current transition-all duration-700 group-hover:w-12"
                />
              </a>
            </div>

            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/40">
                Hours
              </p>
              <p className="text-[14px] text-ivory/70 leading-[1.85] font-light">
                {siteConfig.hours.summary}
                <br />
                <span className="text-ivory/40 text-[13px]">All week</span>
              </p>
            </div>

            <div className="space-y-4 pt-2 border-t border-ivory/10">
              <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/40 pt-6">
                Or order in
              </p>
              <div className="flex flex-col gap-3">
                {/* TODO — replace href='#' with the real Swiggy restaurant URL */}
                <a
                  href={siteConfig.order.swiggy}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-between gap-4 border-b border-ivory/10 hover:border-gold/40 py-3 text-[11px] uppercase tracking-[0.4em] text-ivory/65 hover:text-ivory transition-all duration-700"
                >
                  <span>Swiggy</span>
                  <span
                    aria-hidden
                    className="inline-block w-8 h-px bg-current transition-all duration-700 group-hover:w-12"
                  />
                </a>
                {/* TODO — replace href='#' with the real Zomato restaurant URL */}
                <a
                  href={siteConfig.order.zomato}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-between gap-4 border-b border-ivory/10 hover:border-gold/40 py-3 text-[11px] uppercase tracking-[0.4em] text-ivory/65 hover:text-ivory transition-all duration-700"
                >
                  <span>Zomato</span>
                  <span
                    aria-hidden
                    className="inline-block w-8 h-px bg-current transition-all duration-700 group-hover:w-12"
                  />
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
