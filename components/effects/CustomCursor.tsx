'use client';

import { useEffect, useRef } from 'react';
import { pointer } from '@/lib/pointer';
import { getReducedMotion } from '@/lib/scroll';

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0;
    if (isTouch || getReducedMotion()) return;

    document.documentElement.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let scale = 1;
    let targetScale = 1;
    let labelText = '';

    const updateHover = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest<HTMLElement>(
        'a, button, input, select, textarea, [data-cursor], [role="button"]'
      );
      if (interactive) {
        targetScale = 2.4;
        const labelAttr = interactive.getAttribute('data-cursor');
        labelText = labelAttr || '';
        document.documentElement.classList.add('cursor-hover');
      } else {
        targetScale = 1;
        labelText = '';
        document.documentElement.classList.remove('cursor-hover');
      }
    };

    window.addEventListener('pointermove', updateHover, { passive: true });

    let raf = 0;
    const tick = () => {
      rx += (pointer.x - rx) * 0.22;
      ry += (pointer.y - ry) * 0.22;
      scale += (targetScale - scale) * 0.18;

      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      if (label.textContent !== labelText) label.textContent = labelText;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', updateHover);
      document.documentElement.classList.remove('has-custom-cursor');
      document.documentElement.classList.remove('cursor-hover');
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] w-10 h-10 rounded-full border border-ivory/70 mix-blend-difference will-change-transform"
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] w-[5px] h-[5px] rounded-full bg-gold mix-blend-difference will-change-transform"
      />
      <span
        ref={labelRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] text-[9px] uppercase tracking-[0.4em] text-ivory mix-blend-difference will-change-transform"
        style={{ transform: 'translate3d(-9999px,-9999px,0)' }}
      />
    </>
  );
}
