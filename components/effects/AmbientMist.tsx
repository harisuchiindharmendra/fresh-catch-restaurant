'use client';

import { useEffect, useRef } from 'react';
import { getReducedMotion, isMobile } from '@/lib/scroll';

/**
 * Six (max) drifting motes of light. Slow upward drift, tiny radial
 * gradients, gold-warm. Strictly for "the air is moving" sense — not
 * for visual effect.
 *
 * Mobile: skip. Reduced-motion: skip. ~0.04ms per frame at 6 motes.
 */
export default function AmbientMist() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (getReducedMotion() || isMobile()) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    const COUNT = 6;
    type Mote = { x: number; y: number; r: number; vy: number; phase: number; opacity: number };
    const motes: Mote[] = [];

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const reset = () => {
      motes.length = 0;
      for (let i = 0; i < COUNT; i++) {
        motes.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 80 + Math.random() * 140,
          vy: -0.04 - Math.random() * 0.06,
          phase: Math.random() * Math.PI * 2,
          opacity: 0.04 + Math.random() * 0.07,
        });
      }
    };

    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, w, h);
      for (const m of motes) {
        m.phase += 0.002;
        m.y += m.vy;
        if (m.y < -m.r) {
          m.y = h + m.r;
          m.x = Math.random() * w;
        }
        const x = m.x + Math.sin(m.phase) * 22;
        const y = m.y + Math.cos(m.phase * 0.6) * 12;
        const g = ctx.createRadialGradient(x, y, 0, x, y, m.r);
        g.addColorStop(0, `rgba(200,168,106,${m.opacity})`);
        g.addColorStop(0.5, `rgba(200,168,106,${m.opacity * 0.3})`);
        g.addColorStop(1, 'rgba(200,168,106,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, y, m.r, 0, Math.PI * 2);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };

    resize();
    reset();
    tick();

    const onResize = () => {
      resize();
      reset();
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[5] w-screen h-screen"
    />
  );
}
