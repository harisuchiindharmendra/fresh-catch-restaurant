'use client';

import { useEffect, useRef } from 'react';
import { pointer } from '@/lib/pointer';
import { getReducedMotion } from '@/lib/scroll';

/**
 * Aman-Resorts-quiet cursor.
 *
 * One 6-pixel ivory dot. mix-blend-difference so it always reads but
 * never asserts. Soft inertia. On interactive targets we just shift
 * opacity 0.6 → 1 and grow the dot by 50% (no rings, no labels,
 * no ripples, no glow, no scaling pop).
 *
 * If you can describe it with two CSS properties, that's the whole
 * effect.
 */
export default function MinimalCursor() {
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0;
    if (isTouch || getReducedMotion()) return;

    document.documentElement.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    if (!dot) return;

    let scale = 1;
    let targetScale = 1;
    let opacity = 0.65;
    let targetOpacity = 0.65;
    let glow = 0;
    let targetGlow = 0;

    const updateHover = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest(
        'a, button, input, select, textarea, [data-cursor], [role="button"]'
      );
      if (interactive) {
        targetScale = 1.6;
        targetOpacity = 1;
        targetGlow = 1;
      } else {
        targetScale = 1;
        targetOpacity = 0.65;
        targetGlow = 0;
      }
    };

    window.addEventListener('pointermove', updateHover, { passive: true });

    let raf = 0;
    const tick = () => {
      scale += (targetScale - scale) * 0.12;
      opacity += (targetOpacity - opacity) * 0.12;
      glow += (targetGlow - glow) * 0.12;
      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%) scale(${scale.toFixed(
        3
      )})`;
      dot.style.opacity = opacity.toFixed(3);
      dot.style.boxShadow = `0 0 ${(8 + glow * 16).toFixed(1)}px rgba(245,239,230,${(
        0.15 +
        glow * 0.35
      ).toFixed(2)})`;
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
    <div
      ref={dotRef}
      aria-hidden
      className="pointer-events-none fixed top-0 left-0 z-[100] w-[6px] h-[6px] rounded-full bg-ivory mix-blend-difference will-change-transform"
      style={{ opacity: 0 }}
    />
  );
}
