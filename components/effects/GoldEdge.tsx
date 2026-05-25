'use client';

import { useEffect, useRef } from 'react';
import { scrollState } from '@/lib/scroll-state';

/**
 * Cinematic edge lighting. Two large blurred radial gradients sit at
 * opposite corners — gold in the upper-right, deep ocean in the lower-
 * left. Both drift slowly over the page (multi-minute cycle) and shift
 * very gently with scroll progress.
 *
 * Total surface motion is ~12px per minute. You won't see it move.
 * You'll just feel the room is lit by something warm off-frame.
 *
 * Sits at z-5 — above background, below all content. mix-blend-screen.
 */
export default function GoldEdge() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let t = 0;
    const tick = () => {
      // ~3-minute cycle. You will not see this move.
      t += 0.00022;
      const p = scrollState.progress;
      const goldX = 78 + Math.sin(t) * 4 + p * 8;
      const goldY = 22 + Math.cos(t * 0.7) * 3 - p * 6;
      const blueX = 18 + Math.cos(t * 0.5) * 5;
      const blueY = 82 + Math.sin(t * 0.6) * 4 + p * 4;
      el.style.background = `
        radial-gradient(48% 40% at ${goldX.toFixed(2)}% ${goldY.toFixed(
        2
      )}%, rgba(200,168,106,0.16), transparent 70%),
        radial-gradient(55% 45% at ${blueX.toFixed(2)}% ${blueY.toFixed(
        2
      )}%, rgba(35,84,138,0.14), transparent 72%)
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
      className="pointer-events-none fixed inset-0 z-[5] mix-blend-screen"
    />
  );
}
