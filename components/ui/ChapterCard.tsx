'use client';

import { useEffect, useRef } from 'react';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';

interface Props {
  triggerId: string;
  numeral: string;
  title: string;
  caption: string;
}

export default function ChapterCard({ triggerId, numeral, title, caption }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    registerGSAP();
    const el = ref.current;
    if (!el) return;
    const trigger = document.getElementById(triggerId);
    if (!trigger) return;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger,
          start: 'top 80%',
          end: 'top 30%',
          scrub: 1.2,
        },
      });
      tl.fromTo(
        el.querySelector('.cc-numeral'),
        { yPercent: 30, opacity: 0 },
        { yPercent: 0, opacity: 1, ease: 'expo.out' }
      )
        .fromTo(
          el.querySelector('.cc-line'),
          { scaleX: 0 },
          { scaleX: 1, transformOrigin: '0% 50%', ease: 'expo.out' },
          0
        )
        .fromTo(
          el.querySelectorAll('.cc-meta > *'),
          { yPercent: 50, opacity: 0 },
          { yPercent: 0, opacity: 1, stagger: 0.05, ease: 'expo.out' },
          0
        )
        .to(el, { opacity: 0, duration: 0.6, ease: 'power2.in' }, '+=0.2');
    }, el);
    return () => ctx.revert();
  }, [triggerId]);

  return (
    <div
      ref={ref}
      aria-hidden
      className="cc-card pointer-events-none absolute left-6 lg:left-12 top-10 z-20 flex items-end gap-5"
    >
      <span className="cc-numeral font-serif italic text-[clamp(3.5rem,7vw,6rem)] leading-none text-gold/90 will-change-transform">
        {numeral}
      </span>
      <div className="cc-meta pb-3 flex flex-col gap-2">
        <span className="block h-px w-12 bg-gold cc-line origin-left" />
        <span className="text-[10px] uppercase tracking-[0.4em] text-ivory/70">
          {title}
        </span>
        <span className="text-[11px] uppercase tracking-[0.3em] text-muted">
          {caption}
        </span>
      </div>
    </div>
  );
}
