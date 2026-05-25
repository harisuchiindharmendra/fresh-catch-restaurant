'use client';

import { useEffect, useRef } from 'react';
import { pointer } from '@/lib/pointer';
import { getReducedMotion } from '@/lib/scroll';

type Ripple = {
  el: HTMLDivElement;
  born: number;
  ttl: number;
  size: number;
  hue: 'ivory' | 'gold';
};

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const ripplesRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch =
      window.matchMedia('(pointer: coarse)').matches ||
      navigator.maxTouchPoints > 0;
    if (isTouch || getReducedMotion()) return;

    document.documentElement.classList.add('has-custom-cursor');

    const dot = dotRef.current;
    const ring = ringRef.current;
    const halo = haloRef.current;
    const label = labelRef.current;
    const ripplesRoot = ripplesRootRef.current;
    if (!dot || !ring || !halo || !label || !ripplesRoot) return;

    let rx = window.innerWidth / 2;
    let ry = window.innerHeight / 2;
    let hx = rx;
    let hy = ry;
    let scale = 1;
    let targetScale = 1;
    let labelText = '';
    let lastInteractive: HTMLElement | null = null;
    let hue: 'ivory' | 'gold' = 'ivory';

    const ripples: Ripple[] = [];
    let lastSonar = performance.now();

    const spawnRipple = (size: number, ttl: number, h: 'ivory' | 'gold') => {
      const el = document.createElement('div');
      el.className =
        'pointer-events-none fixed top-0 left-0 rounded-full border will-change-transform';
      el.style.borderColor =
        h === 'gold' ? 'rgba(200,168,106,0.65)' : 'rgba(245,239,230,0.55)';
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%) scale(0)`;
      el.style.mixBlendMode = 'difference';
      ripplesRoot.appendChild(el);
      ripples.push({ el, born: performance.now(), ttl, size, hue: h });
    };

    const updateHover = (e: PointerEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const interactive = target.closest<HTMLElement>(
        'a, button, input, select, textarea, [data-cursor], [role="button"]'
      );
      if (interactive) {
        targetScale = 2.6;
        const labelAttr = interactive.getAttribute('data-cursor');
        labelText = labelAttr || '';
        document.documentElement.classList.add('cursor-hover');
        hue = labelAttr ? 'gold' : 'gold';
        if (interactive !== lastInteractive) {
          lastInteractive = interactive;
          spawnRipple(80, 700, 'gold');
        }
      } else {
        targetScale = 1;
        labelText = '';
        hue = 'ivory';
        if (lastInteractive) lastInteractive = null;
        document.documentElement.classList.remove('cursor-hover');
      }
    };

    const onPointerDown = () => {
      // triple ripple on click — sonar pulse
      spawnRipple(60, 900, hue);
      setTimeout(() => spawnRipple(80, 950, hue), 80);
      setTimeout(() => spawnRipple(110, 1000, hue), 160);
    };

    window.addEventListener('pointermove', updateHover, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });

    let raf = 0;
    const tick = () => {
      const now = performance.now();

      // ambient sonar pulse every ~3.4s — only when cursor is moving
      if (pointer.speed > 0.4 && now - lastSonar > 3400) {
        spawnRipple(50, 2600, 'ivory');
        lastSonar = now;
      }

      rx += (pointer.x - rx) * 0.24;
      ry += (pointer.y - ry) * 0.24;
      hx += (pointer.x - hx) * 0.08;
      hy += (pointer.y - hy) * 0.08;
      scale += (targetScale - scale) * 0.18;

      dot.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%) scale(${scale})`;
      ring.style.borderColor =
        hue === 'gold' ? 'rgba(200,168,106,0.85)' : 'rgba(245,239,230,0.70)';
      halo.style.transform = `translate3d(${hx}px, ${hy}px, 0) translate(-50%, -50%) scale(${0.7 + scale * 0.6})`;
      halo.style.opacity = `${0.18 + Math.min(0.32, pointer.speed * 0.02)}`;

      if (label.textContent !== labelText) label.textContent = labelText;
      label.style.transform = `translate3d(${pointer.x + 22}px, ${pointer.y + 22}px, 0)`;
      label.style.opacity = labelText ? '1' : '0';

      // ripples — advance and prune
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        const age = now - r.born;
        const t = age / r.ttl;
        if (t >= 1) {
          r.el.remove();
          ripples.splice(i, 1);
          continue;
        }
        const ease = 1 - Math.pow(1 - t, 3);
        const s = 0.05 + ease * 1.0;
        r.el.style.transform = `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%) scale(${s})`;
        r.el.style.opacity = `${(1 - t) * 0.85}`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', updateHover);
      window.removeEventListener('pointerdown', onPointerDown);
      ripples.forEach((r) => r.el.remove());
      ripples.length = 0;
      document.documentElement.classList.remove('has-custom-cursor');
      document.documentElement.classList.remove('cursor-hover');
    };
  }, []);

  return (
    <>
      {/* outermost: soft halo (mix-blend-screen for subtle glow) */}
      <div
        ref={haloRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[99] w-24 h-24 rounded-full mix-blend-screen will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(200,168,106,0.32) 0%, rgba(200,168,106,0) 70%)',
          opacity: 0,
        }}
      />
      {/* ring (mix-blend-difference for always-visible) */}
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[100] w-11 h-11 rounded-full border mix-blend-difference will-change-transform"
        style={{ borderColor: 'rgba(245,239,230,0.70)' }}
      />
      {/* inner pearl dot */}
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[101] w-[5px] h-[5px] rounded-full mix-blend-difference will-change-transform"
        style={{
          background:
            'radial-gradient(circle, rgba(255,247,232,1) 0%, rgba(200,168,106,1) 100%)',
        }}
      />
      {/* label */}
      <span
        ref={labelRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[101] text-[9px] uppercase tracking-[0.4em] text-ivory mix-blend-difference will-change-transform transition-opacity duration-300"
        style={{ opacity: 0 }}
      />
      {/* ripple container */}
      <div
        ref={ripplesRootRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[100]"
      />
    </>
  );
}
