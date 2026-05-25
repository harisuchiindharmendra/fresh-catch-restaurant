'use client';

import { useEffect, useRef } from 'react';
import { getReducedMotion, isMobile } from '@/lib/scroll';
import { pointer } from '@/lib/pointer';
import { scrollState } from '@/lib/scroll-state';

export default function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (getReducedMotion()) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let raf = 0;
    let w = 0;
    let h = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    type Particle = {
      x: number;
      y: number;
      z: number;
      r: number;
      vx: number;
      vy: number;
      a: number;
      ta: number;
      tone: 'gold' | 'ivory' | 'cyan';
    };

    const density = isMobile() ? 40000 : 14000;
    const count = Math.min(130, Math.floor((window.innerWidth * window.innerHeight) / density));
    const orbCount = isMobile() ? 0 : 8;
    const particles: Particle[] = [];
    type Orb = { x: number; y: number; r: number; vy: number; phase: number; tone: 'gold' | 'cyan' | 'ivory' };
    const orbs: Orb[] = [];

    const reset = () => {
      particles.length = 0;
      for (let i = 0; i < count; i++) {
        const z = Math.random();
        const r = Math.random() * 1.4 + 0.3 + z * 1.6;
        const tone = Math.random() < 0.6 ? 'gold' : Math.random() < 0.5 ? 'ivory' : 'cyan';
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          z,
          r,
          vx: (Math.random() - 0.5) * 0.18,
          vy: -Math.random() * 0.3 - 0.05,
          a: Math.random() * 0.4 + 0.1,
          ta: Math.random() * 0.5 + 0.2,
          tone,
        });
      }
      orbs.length = 0;
      for (let i = 0; i < orbCount; i++) {
        const tonePick = Math.random();
        const tone: Orb['tone'] = tonePick < 0.55 ? 'gold' : tonePick < 0.85 ? 'cyan' : 'ivory';
        orbs.push({
          x: Math.random() * w,
          y: Math.random() * h * 0.9 + h * 0.05,
          r: 110 + Math.random() * 180,
          vy: -0.05 - Math.random() * 0.08,
          phase: Math.random() * Math.PI * 2,
          tone,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const cursorActive = pointer.active;

      // ambient orbs — large soft halos drifting up, no inner detail (depth feel)
      for (const o of orbs) {
        o.phase += 0.0035;
        o.y += o.vy;
        if (o.y < -o.r) {
          o.y = h + o.r;
          o.x = Math.random() * w;
        }
        const driftX = o.x + Math.sin(o.phase) * 30;
        const driftY = o.y + Math.cos(o.phase * 0.7) * 18;
        const g = ctx.createRadialGradient(driftX, driftY, 0, driftX, driftY, o.r);
        if (o.tone === 'gold') {
          g.addColorStop(0, 'rgba(200,168,106,0.18)');
          g.addColorStop(0.5, 'rgba(200,168,106,0.04)');
          g.addColorStop(1, 'rgba(200,168,106,0)');
        } else if (o.tone === 'cyan') {
          g.addColorStop(0, 'rgba(120,178,220,0.14)');
          g.addColorStop(0.5, 'rgba(120,178,220,0.04)');
          g.addColorStop(1, 'rgba(120,178,220,0)');
        } else {
          g.addColorStop(0, 'rgba(245,239,230,0.10)');
          g.addColorStop(0.5, 'rgba(245,239,230,0.03)');
          g.addColorStop(1, 'rgba(245,239,230,0)');
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(driftX, driftY, o.r, 0, Math.PI * 2);
        ctx.fill();
      }

      for (const p of particles) {
        // base drift
        p.x += p.vx + scrollState.lerpVelocity * 0.04 * (1 - p.z);
        p.y += p.vy - scrollState.lerpVelocity * 0.06;

        // cursor repulsion (foreground particles feel cursor more)
        if (cursorActive) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const dist2 = dx * dx + dy * dy;
          if (dist2 < 22000) {
            const f = (1 - dist2 / 22000) * (0.4 + p.z * 1.2);
            const d = Math.sqrt(dist2) || 1;
            p.x += (dx / d) * f;
            p.y += (dy / d) * f;
          }
        }

        if (p.y < -10) {
          p.y = h + 10;
          p.x = Math.random() * w;
        }
        if (p.y > h + 20) {
          p.y = -10;
          p.x = Math.random() * w;
        }
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;

        p.a += (p.ta - p.a) * 0.02;
        if (Math.random() < 0.004) p.ta = Math.random() * 0.55 + 0.1;

        const radius = p.r * (6 + p.z * 6);
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius);
        const alpha = p.a * (0.4 + p.z * 0.6);
        if (p.tone === 'gold') {
          g.addColorStop(0, `rgba(200, 168, 106, ${alpha})`);
          g.addColorStop(1, 'rgba(200, 168, 106, 0)');
        } else if (p.tone === 'ivory') {
          g.addColorStop(0, `rgba(245, 239, 230, ${alpha * 0.85})`);
          g.addColorStop(1, 'rgba(245, 239, 230, 0)');
        } else {
          g.addColorStop(0, `rgba(120, 178, 220, ${alpha * 0.6})`);
          g.addColorStop(1, 'rgba(120, 178, 220, 0)');
        }
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
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
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 w-full h-full"
    />
  );
}
