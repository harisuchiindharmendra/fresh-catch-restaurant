'use client';

import { useEffect, useRef } from 'react';
import { scrollState } from '@/lib/scroll-state';

/**
 * Bottom-anchored volumetric depth fog that thickens with scroll progress.
 * Creates the feeling of descending deeper into the ocean — light recedes,
 * the floor of the page gets foggier the further down you go.
 *
 * Pure CSS gradient driven by RAF, no canvas, ~0 perf cost.
 */
export default function DepthFog() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let lerpP = 0;
    const tick = () => {
      lerpP += (scrollState.progress - lerpP) * 0.05;
      const intensity = 0.25 + lerpP * 0.5;
      const stretch = 30 + lerpP * 40;
      el.style.background = `linear-gradient(0deg, rgba(4,9,18,${intensity.toFixed(
        3
      )}) 0%, rgba(4,9,18,0) ${stretch.toFixed(1)}%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[58]"
    />
  );
}
