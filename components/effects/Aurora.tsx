'use client';

import { useEffect, useRef } from 'react';
import { pointer } from '@/lib/pointer';
import { scrollState } from '@/lib/scroll-state';

export default function Aurora() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.0018;
      const px = pointer.lerpNX;
      const py = pointer.lerpNY;
      const drift = scrollState.progress;
      const x1 = 50 + Math.sin(t) * 18 + (px - 0.5) * 14;
      const y1 = 38 + Math.cos(t * 0.7) * 14 + (py - 0.5) * 10 - drift * 18;
      const x2 = 70 + Math.cos(t * 0.5) * 22 - (px - 0.5) * 10;
      const y2 = 70 + Math.sin(t * 0.6) * 16 + drift * 22;
      el.style.background = `
        radial-gradient(60% 50% at ${x1}% ${y1}%, rgba(200,168,106,0.10), transparent 60%),
        radial-gradient(55% 45% at ${x2}% ${y2}%, rgba(35,84,138,0.18), transparent 65%),
        radial-gradient(80% 60% at 50% 100%, rgba(7,17,31,0.4), transparent 70%)
      `;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] mix-blend-screen opacity-90"
    />
  );
}
