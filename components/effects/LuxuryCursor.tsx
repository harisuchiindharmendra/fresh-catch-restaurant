'use client';

import { useEffect, useRef } from 'react';
import { pointer } from '@/lib/pointer';
import { getReducedMotion } from '@/lib/scroll';

/**
 * Marine luxury cursor:
 *   - inner pearl (white with subtle glow)
 *   - outer halo ring (ivory, scales on hover)
 *   - 3 sonar ripples emanating on a slow cadence (and on click)
 *   - gold tint when over interactive elements
 *   - smooth inertia (different lerp per layer for depth feel)
 */
export default function LuxuryCursor() {
  const pearlRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const ripple1Ref = useRef<HTMLDivElement>(null);
  const ripple2Ref = useRef<HTMLDivElement>(null);
  const ripple3Ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0;
    if (isTouch || getReducedMotion()) return;

    document.documentElement.classList.add('has-custom-cursor');

    const pearl = pearlRef.current;
    const halo = haloRef.current;
    const ripples = [
      ripple1Ref.current,
      ripple2Ref.current,
      ripple3Ref.current,
    ];
    const label = labelRef.current;
    if (!pearl || !halo || !label) return;

    let hx = 0;
    let hy = 0;
    let scale = 1;
    let targetScale = 1;
    let tint = 0;
    let targetTint = 0;
    let labelText = '';

    const updateHover = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest<HTMLElement>(
        'a, button, input, select, textarea, [data-cursor], [role="button"]'
      );
      if (interactive) {
        targetScale = 2.6;
        targetTint = 1;
        const labelAttr = interactive.getAttribute('data-cursor');
        labelText = labelAttr || '';
        document.documentElement.classList.add('cursor-hover');
      } else {
        targetScale = 1;
        targetTint = 0;
        labelText = '';
        document.documentElement.classList.remove('cursor-hover');
      }
    };

    const onClick = () => {
      // pop a sonar ripple on click
      const r = ripples.find((el) => el && !el.classList.contains('rippling'));
      if (r) {
        r.classList.add('rippling');
        setTimeout(() => r.classList.remove('rippling'), 1400);
      }
    };

    window.addEventListener('pointermove', updateHover, { passive: true });
    window.addEventListener('pointerdown', onClick, { passive: true });

    // ambient sonar — emit ripple every 2.8s from the back ring
    let lastRipple = performance.now();
    const RIPPLE_INTERVAL = 2800;

    let raf = 0;
    const tick = () => {
      // pearl follows fast (low inertia)
      hx += (pointer.x - hx) * 0.28;
      hy += (pointer.y - hy) * 0.28;
      scale += (targetScale - scale) * 0.18;
      tint += (targetTint - tint) * 0.15;

      const goldR = Math.round(245 + (200 - 245) * tint);
      const goldG = Math.round(239 + (168 - 239) * tint);
      const goldB = Math.round(230 + (106 - 230) * tint);
      const pearlColor = `rgba(${goldR}, ${goldG}, ${goldB}, 0.96)`;

      pearl.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      pearl.style.background = pearlColor;
      pearl.style.boxShadow = `0 0 ${
        16 + tint * 24
      }px rgba(${goldR},${goldG},${goldB},${0.55 + tint * 0.35})`;

      halo.style.transform = `translate3d(${hx}px, ${hy}px, 0) translate(-50%, -50%) scale(${scale})`;
      halo.style.borderColor = `rgba(${goldR},${goldG},${goldB},${0.55 + tint * 0.35})`;

      if (label.textContent !== labelText) label.textContent = labelText;
      label.style.transform = `translate3d(${pointer.x + 22}px, ${
        pointer.y + 22
      }px, 0)`;
      label.style.opacity = String(labelText ? 1 : 0);

      // ambient sonar
      const now = performance.now();
      if (now - lastRipple > RIPPLE_INTERVAL) {
        lastRipple = now;
        const idx = Math.floor((now / RIPPLE_INTERVAL) % ripples.length);
        const r = ripples[idx];
        if (r && !r.classList.contains('rippling')) {
          r.style.left = `${pointer.x}px`;
          r.style.top = `${pointer.y}px`;
          r.classList.add('rippling');
          setTimeout(() => r.classList.remove('rippling'), 1400);
        }
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', updateHover);
      window.removeEventListener('pointerdown', onClick);
      document.documentElement.classList.remove('has-custom-cursor');
      document.documentElement.classList.remove('cursor-hover');
    };
  }, []);

  return (
    <>
      {/* sonar ripples (3 reusable rings) */}
      <div
        ref={ripple1Ref}
        aria-hidden
        className="cursor-ripple pointer-events-none fixed top-0 left-0 z-[99] rounded-full border border-ivory/35 will-change-transform"
      />
      <div
        ref={ripple2Ref}
        aria-hidden
        className="cursor-ripple pointer-events-none fixed top-0 left-0 z-[99] rounded-full border border-ivory/35 will-change-transform"
      />
      <div
        ref={ripple3Ref}
        aria-hidden
        className="cursor-ripple pointer-events-none fixed top-0 left-0 z-[99] rounded-full border border-gold/45 will-change-transform"
      />
      {/* outer halo ring */}
      <div
        ref={haloRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] w-9 h-9 rounded-full border will-change-transform mix-blend-difference"
        style={{ borderColor: 'rgba(245,239,230,0.55)' }}
      />
      {/* inner pearl */}
      <div
        ref={pearlRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] w-[7px] h-[7px] rounded-full will-change-transform"
      />
      {/* contextual label */}
      <span
        ref={labelRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] text-[9px] uppercase tracking-[0.4em] text-ivory/85 will-change-transform transition-opacity duration-300"
        style={{ transform: 'translate3d(-9999px,-9999px,0)', opacity: 0 }}
      />
    </>
  );
}
