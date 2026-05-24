'use client';

import { useEffect, useRef } from 'react';
import { pointer } from '@/lib/pointer';
import { scrollState } from '@/lib/scroll-state';

/**
 * Soft moving light "refraction" layer — gives the whole stage an underwater
 * feel without going full WebGL. Cheap: a couple of large blurred conic
 * gradients translated based on cursor + scroll.
 */
export default function Caustics({ intensity = 0.5 }: { intensity?: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.0035;
      const px = (pointer.lerpNX - 0.5) * 80;
      const py = (pointer.lerpNY - 0.5) * 60;
      const drift = scrollState.progress * 200;
      el.style.transform = `translate3d(${Math.sin(t) * 40 + px}px, ${
        Math.cos(t * 0.8) * 30 + py - drift
      }px, 0) rotate(${t * 6}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        ref={ref}
        aria-hidden
        className="absolute -inset-[40%] will-change-transform"
        style={{
          opacity: intensity,
          background:
            'conic-gradient(from 90deg at 50% 50%, rgba(200,168,106,0.0) 0deg, rgba(200,168,106,0.25) 60deg, rgba(35,84,138,0.0) 120deg, rgba(245,239,230,0.18) 200deg, rgba(200,168,106,0.0) 270deg, rgba(35,84,138,0.22) 320deg, rgba(200,168,106,0.0) 360deg)',
          filter: 'blur(120px)',
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
}
