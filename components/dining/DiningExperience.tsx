'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { useSceneStore } from '@/store/scene-store';

/**
 * The room. Full-bleed interior image with a slow parallax dolly.
 * Below the image, simple stacked copy. No glass card, no glow rim,
 * no animated counter, no magnetic float, no chapter mark.
 */
export default function DiningExperience() {
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.fromTo(
        bgRef.current,
        { yPercent: -6, scale: 1.05 },
        {
          yPercent: 6,
          scale: 1.14,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        }
      );

      gsap.from('.dining-fade > *', {
        y: 24,
        opacity: 0,
        duration: 1.6,
        stagger: 0.12,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.dining-fade', start: 'top 80%' },
      });

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveScene(3),
        onEnterBack: () => setActiveScene(3),
      });
    }, ref);
    return () => ctx.revert();
  }, [setActiveScene]);

  return (
    <section
      id="dining"
      ref={ref}
      className="relative bg-navy-950"
    >
      {/* Big silent image — full bleed, slow dolly */}
      <div className="relative h-[90vh] lg:h-screen overflow-hidden">
        <div
          ref={bgRef}
          className="absolute inset-0 -inset-y-[10%] will-change-transform"
        >
          <Image
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=85"
            alt="Restaurant interior"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-navy-950/45 via-navy-900/20 to-navy-950/85" />
        </div>
      </div>

      {/* Quiet copy beneath, plenty of breath */}
      <div className="mx-auto max-w-[1400px] px-8 lg:px-16 py-32 lg:py-44">
        <div className="dining-fade grid grid-cols-12 gap-8 lg:gap-20 items-end">
          <div className="col-span-12 lg:col-span-5">
            <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/45 mb-8">
              The Room
            </p>
            <h2 className="font-serif text-[clamp(2rem,4.2vw,3.6rem)] leading-[1.05] text-ivory font-light">
              Forty seats.
              <br />
              <span className="italic text-ivory/55">One open kitchen.</span>
            </h2>
          </div>

          <div className="col-span-12 lg:col-span-5 lg:col-start-8 space-y-8 text-ivory/55 text-[15px] leading-[1.9] font-light max-w-md">
            <p>
              Low light. Heavy linen. Conversation kept just below the sound
              of the pass.
            </p>
            <p>
              The room was built by Studio Lascelles to disappear — so the
              food, and the evening, could be remembered.
            </p>
            <div className="grid grid-cols-2 gap-8 pt-6 border-t border-ivory/10">
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-ivory/40 mb-2">
                  Seating
                </p>
                <p className="font-serif text-2xl text-ivory/90">40 guests</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.35em] text-ivory/40 mb-2">
                  Service
                </p>
                <p className="font-serif text-2xl text-ivory/90">Tue — Sun</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
