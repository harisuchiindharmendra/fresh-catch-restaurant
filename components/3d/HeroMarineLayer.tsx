'use client';

import { useEffect, useRef } from 'react';
import { getReducedMotion, isMobile } from '@/lib/scroll';
import { pointer } from '@/lib/pointer';
import { scrollState } from '@/lib/scroll-state';

/**
 * Canvas2D marine layer — elegant drifting silhouettes (jellyfish bells,
 * bubble clusters, soft pearl halos) that frame the hero video without
 * covering it. Pure 2D, zero hydration risk.
 *
 * A prior R3F-based implementation triggered a hydration cascade inside the
 * nested SmoothScroll → Hero subtree; that version lives in
 * components/3d/MarineFloaters.tsx (still importable if you ever want the
 * full WebGL scene), but this Canvas2D layer is what's actually mounted.
 */
type Tone = 'gold' | 'pearl' | 'cyan' | 'ivory';

type Jelly = {
  x: number;
  y: number;
  r: number;
  vy: number;
  phase: number;
  tone: Tone;
};

type Bubble = {
  x: number;
  y: number;
  r: number;
  vy: number;
  phase: number;
  hue: number;
};

const TONE: Record<Tone, [string, string]> = {
  gold: ['rgba(200,168,106,0.25)', 'rgba(200,168,106,0)'],
  pearl: ['rgba(232,224,208,0.22)', 'rgba(232,224,208,0)'],
  cyan: ['rgba(120,178,220,0.20)', 'rgba(120,178,220,0)'],
  ivory: ['rgba(245,239,230,0.16)', 'rgba(245,239,230,0)'],
};

export default function HeroMarineLayer() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (getReducedMotion()) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const jellies: Jelly[] = [];
    const bubbles: Bubble[] = [];

    const reset = () => {
      jellies.length = 0;
      bubbles.length = 0;
      const tonePalette: Tone[] = ['gold', 'pearl', 'cyan', 'ivory', 'gold', 'pearl'];
      const jellyCount = isMobile() ? 3 : 7;
      for (let i = 0; i < jellyCount; i++) {
        // bias toward edges (left/right thirds) so video center isn't blocked
        const edgeBias = Math.random() < 0.5 ? Math.random() * 0.33 : 0.67 + Math.random() * 0.33;
        jellies.push({
          x: edgeBias * w,
          y: Math.random() * h * 1.4 - h * 0.2,
          r: 70 + Math.random() * 110,
          vy: -0.12 - Math.random() * 0.18,
          phase: Math.random() * Math.PI * 2,
          tone: tonePalette[i % tonePalette.length],
        });
      }
      const bubbleCount = isMobile() ? 12 : 28;
      for (let i = 0; i < bubbleCount; i++) {
        bubbles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 4 + Math.random() * 14,
          vy: -0.25 - Math.random() * 0.45,
          phase: Math.random() * Math.PI * 2,
          hue: Math.random() < 0.6 ? 0 : 1, // 0=ivory, 1=gold
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const drift = scrollState.lerpVelocity;
      const cursorActive = pointer.active;

      // jellies — large soft bells
      for (const j of jellies) {
        j.phase += 0.0035;
        j.y += j.vy + drift * 0.04;
        const wob = Math.sin(j.phase) * 18;
        const x = j.x + wob;
        const y = j.y;

        // cursor gentle repulsion (foreground)
        let dx = 0;
        let dy = 0;
        if (cursorActive) {
          const cx = pointer.x - x;
          const cy = pointer.y - y;
          const d2 = cx * cx + cy * cy;
          if (d2 < 90000) {
            const f = (1 - d2 / 90000) * 30;
            const d = Math.sqrt(d2) || 1;
            dx = -(cx / d) * f;
            dy = -(cy / d) * f;
          }
        }

        if (j.y < -j.r * 1.4) {
          j.y = h + j.r * 1.4;
          j.x = Math.random() * w;
        }

        const [c0, c1] = TONE[j.tone];

        // body — soft elliptical bell
        const grad = ctx.createRadialGradient(x + dx, y + dy - j.r * 0.2, 0, x + dx, y + dy, j.r);
        grad.addColorStop(0, c0);
        grad.addColorStop(0.6, c0.replace(/[\d.]+\)$/, '0.06)'));
        grad.addColorStop(1, c1);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.ellipse(x + dx, y + dy, j.r, j.r * 0.78, 0, 0, Math.PI * 2);
        ctx.fill();

        // wispy "tendrils" — sine curves trailing below
        ctx.strokeStyle = c0.replace(/[\d.]+\)$/, '0.18)');
        ctx.lineWidth = 0.8;
        const tendrils = 3;
        for (let t = 0; t < tendrils; t++) {
          ctx.beginPath();
          const baseX = x + dx + (t - 1) * j.r * 0.32;
          const baseY = y + dy + j.r * 0.6;
          ctx.moveTo(baseX, baseY);
          const len = j.r * 1.4;
          const steps = 14;
          for (let s = 0; s <= steps; s++) {
            const px = baseX + Math.sin(s * 0.4 + j.phase * 4) * 5;
            const py = baseY + (s / steps) * len;
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      }

      // bubbles — small drifting orbs
      for (const b of bubbles) {
        b.phase += 0.02;
        b.y += b.vy;
        const x = b.x + Math.sin(b.phase) * 6;
        if (b.y < -10) {
          b.y = h + 10;
          b.x = Math.random() * w;
        }
        const col = b.hue === 1 ? 'rgba(200,168,106,' : 'rgba(245,239,230,';
        const g = ctx.createRadialGradient(x, b.y, 0, x, b.y, b.r);
        g.addColorStop(0, col + '0.55)');
        g.addColorStop(0.6, col + '0.12)');
        g.addColorStop(1, col + '0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();

        // tiny specular highlight
        ctx.fillStyle = col + '0.65)';
        ctx.beginPath();
        ctx.arc(x - b.r * 0.32, b.y - b.r * 0.32, b.r * 0.18, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };

    resize();
    reset();
    draw();

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
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full z-[7] mix-blend-screen opacity-90"
    />
  );
}
