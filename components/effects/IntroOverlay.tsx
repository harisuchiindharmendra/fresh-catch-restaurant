'use client';

import { useEffect, useRef } from 'react';
import { registerGSAP, gsap } from '@/lib/gsap';

export default function IntroOverlay() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const topBarRef = useRef<HTMLDivElement>(null);
  const bottomBarRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const lineRef = useRef<HTMLSpanElement>(null);
  const codeRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    registerGSAP();
    const wrap = wrapRef.current;
    if (!wrap) return;

    document.documentElement.style.overflow = 'hidden';

    const tl = gsap.timeline({
      defaults: { ease: 'expo.out' },
      onComplete: () => {
        document.documentElement.style.overflow = '';
        wrap.style.pointerEvents = 'none';
      },
    });

    tl.from(topBarRef.current, { scaleY: 0, transformOrigin: '50% 0%', duration: 1, ease: 'expo.inOut' }, 0)
      .from(bottomBarRef.current, { scaleY: 0, transformOrigin: '50% 100%', duration: 1, ease: 'expo.inOut' }, 0)
      .from(codeRef.current, { opacity: 0, y: 8, duration: 0.8 }, 0.3)
      .from(lineRef.current, { scaleX: 0, transformOrigin: '0% 50%', duration: 1.2 }, 0.4)
      .from(
        wordRef.current,
        { yPercent: 110, duration: 1.4 },
        0.5
      )
      .to(
        codeRef.current,
        { opacity: 0, duration: 0.6, ease: 'power2.in' },
        '+=0.3'
      )
      .to(wordRef.current, { yPercent: -110, duration: 1.2, ease: 'expo.in' }, '<')
      .to(lineRef.current, { scaleX: 0, transformOrigin: '100% 50%', duration: 1 }, '<+=0.1')
      .to(
        wrap,
        { clipPath: 'inset(50% 0% 50% 0%)', duration: 1.4, ease: 'expo.inOut' },
        '+=0.05'
      )
      .set(wrap, { display: 'none' });

    return () => {
      tl.kill();
      document.documentElement.style.overflow = '';
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className="intro-overlay fixed inset-0 z-[120] bg-navy-950 flex flex-col"
    >
      <div ref={topBarRef} className="origin-top absolute inset-x-0 top-0 h-1/2 bg-navy-950" />
      <div ref={bottomBarRef} className="origin-bottom absolute inset-x-0 bottom-0 h-1/2 bg-navy-950" />

      <div className="relative z-10 flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6 px-6 text-center">
          <span
            ref={codeRef}
            className="text-[10px] uppercase tracking-[0.5em] text-gold/90"
          >
            Service No. 4128 · Now Pouring
          </span>
          <span className="relative block overflow-hidden">
            <span
              ref={wordRef}
              className="block font-serif italic text-[clamp(3rem,12vw,9rem)] leading-none text-ivory"
              style={{ letterSpacing: '-0.02em' }}
            >
              Fresh Catch
            </span>
          </span>
          <span
            ref={lineRef}
            className="block h-px w-48 bg-gradient-to-r from-transparent via-gold to-transparent origin-left"
          />
        </div>
      </div>
    </div>
  );
}
