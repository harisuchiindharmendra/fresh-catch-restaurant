'use client';

import { useEffect, useRef } from 'react';
import { pointer } from '@/lib/pointer';
import { getReducedMotion } from '@/lib/scroll';

/**
 * Luxury cursor — pearl core with diffused outer halo.
 *
 * Two layers, both following the pointer at different inertias:
 *
 *   1. Pearl core — 4px ivory dot, mix-blend-difference (always reads,
 *      never asserts). Tracks the pointer almost 1:1 with mild damping.
 *
 *   2. Diffusion halo — 28px soft radial glow, mix-blend-screen, lags
 *      the pointer with slower lerp (creates a subtle inertia trail
 *      without spawning DOM ripples). Pearl-warm ivory.
 *
 * Hover state (a/button/input/select/textarea/[data-cursor]/[role=button]):
 *   - pearl scales 1.5×
 *   - pearl opacity 0.5 → 1
 *   - halo opacity 0.18 → 0.55, scales 1.6×
 *   - all transitions damped at 0.12 — feels expensive, never snappy.
 *
 * Hidden entirely on touch and reduced-motion.
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

    // pearl tracks tightly; halo lags slightly for diffusion feel
    let px = window.innerWidth / 2;
    let py = window.innerHeight / 2;
    let hx = px;
    let hy = py;

    let scale = 1;
    let targetScale = 1;
    let opacity = 0.55;
    let targetOpacity = 0.55;
    let haloOpacity = 0.18;
    let haloTargetOpacity = 0.18;
    let haloScale = 1;
    let haloTargetScale = 1;

    const updateHover = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a, button, input, select, textarea, [data-cursor], [role="button"]'
      );
      if (interactive) {
        targetScale = 1.5;
        targetOpacity = 1;
        haloTargetOpacity = 0.55;
        haloTargetScale = 1.6;
      } else {
        targetScale = 1;
        targetOpacity = 0.55;
        haloTargetOpacity = 0.18;
        haloTargetScale = 1;
      }
    };

    window.addEventListener('pointermove', updateHover, { passive: true });

    let raf = 0;
    const tick = () => {
      // pearl: tight follow (high lerp); halo: gentle drag (lower lerp)
      px += (pointer.x - px) * 0.22;
      py += (pointer.y - py) * 0.22;
      hx += (pointer.x - hx) * 0.08;
      hy += (pointer.y - hy) * 0.08;

      // state damping
      scale += (targetScale - scale) * 0.12;
      opacity += (targetOpacity - opacity) * 0.12;
      haloOpacity += (haloTargetOpacity - haloOpacity) * 0.1;
      haloScale += (haloTargetScale - haloScale) * 0.1;

      pearl.style.transform = `translate3d(${px}px, ${py}px, 0) translate(-50%, -50%) scale(${scale.toFixed(
        3
      )})`;
      pearl.style.opacity = opacity.toFixed(3);

      halo.style.transform = `translate3d(${hx}px, ${hy}px, 0) translate(-50%, -50%) scale(${haloScale.toFixed(
        3
      )})`;
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
      {/* diffusion halo — soft pearl-warm radial gradient, mix-blend-screen */}
      <div
        ref={haloRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[99] w-7 h-7 rounded-full mix-blend-screen will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(255,247,232,0.6) 0%, rgba(245,239,230,0.25) 40%, rgba(245,239,230,0) 70%)',
          opacity: 0,
        }}
      />
      {/* pearl core — 4px ivory dot, always reads via mix-blend-difference */}
      <div
        ref={pearlRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] w-1 h-1 rounded-full bg-ivory mix-blend-difference will-change-transform"
        style={{ opacity: 0 }}
      />
    </>
  );
}
