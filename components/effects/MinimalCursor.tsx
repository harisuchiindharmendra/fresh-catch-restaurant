'use client';

import { useEffect, useRef } from 'react';
import { pointer } from '@/lib/pointer';
import { getReducedMotion } from '@/lib/scroll';

/**
 * Quietest possible luxury cursor.
 *
 * Pure ivory. No mix-blend modes (those shift hue against varied
 * backgrounds and were reading as "blue" against the hero video).
 *
 * Two layers:
 *   1. Pearl — 5px solid ivory at 75% opacity, follows tightly.
 *   2. Halo  — 22px soft ivory radial diffusion at 12% opacity,
 *              lags slightly with slower lerp.
 *
 * Hover state (a/button/input/select/textarea/[data-cursor]/[role=button]):
 *   - pearl opacity 0.75 → 1
 *   - halo opacity 0.12 → 0.30
 *   - that's it — no scale pop, no glow burst, no ring growth.
 *
 * Hidden on touch and reduced-motion.
 */
export default function MinimalCursor() {
  const pearlRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0;
    if (isTouch || getReducedMotion()) return;

    document.documentElement.classList.add('has-custom-cursor');

    const pearl = pearlRef.current;
    const halo = haloRef.current;
    if (!pearl || !halo) return;

    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let hx = px;
    let hy = py;

    let pearlOpacity = 0.75;
    let pearlTargetOpacity = 0.75;
    let haloOpacity = 0.12;
    let haloTargetOpacity = 0.12;

    const updateHover = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a, button, input, select, textarea, [data-cursor], [role="button"]'
      );
      if (interactive) {
        pearlTargetOpacity = 1;
        haloTargetOpacity = 0.3;
      } else {
        pearlTargetOpacity = 0.75;
        haloTargetOpacity = 0.12;
      }
    };

    window.addEventListener('pointermove', updateHover, { passive: true });

    let raf = 0;
    const tick = () => {
      px += (pointer.x - px) * 0.22;
      py += (pointer.y - py) * 0.22;
      hx += (pointer.x - hx) * 0.09;
      hy += (pointer.y - hy) * 0.09;

      pearlOpacity += (pearlTargetOpacity - pearlOpacity) * 0.12;
      haloOpacity += (haloTargetOpacity - haloOpacity) * 0.1;

      pearl.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%)`;
      pearl.style.opacity = pearlOpacity.toFixed(3);

      halo.style.transform = `translate3d(${hx}px, ${hy}px, 0) translate(-50%, -50%)`;
      halo.style.opacity = haloOpacity.toFixed(3);

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', updateHover);
      document.documentElement.classList.remove('has-custom-cursor');
    };
  }, []);

  return (
    <>
      {/* halo — pure ivory radial diffusion, no blend mode */}
      <div
        ref={haloRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[99] w-[22px] h-[22px] rounded-full will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(245,239,230,1) 0%, rgba(245,239,230,0.4) 45%, rgba(245,239,230,0) 75%)',
          opacity: 0,
        }}
      />
      {/* pearl — solid ivory, no blend mode */}
      <div
        ref={pearlRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] w-[5px] h-[5px] rounded-full bg-ivory will-change-transform"
        style={{ opacity: 0 }}
      />
    </>
  );
}
