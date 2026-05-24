'use client';

import { useEffect, useRef } from 'react';
import { pointer } from '@/lib/pointer';
import { scrollState } from '@/lib/scroll-state';

export default function LightRays() {
  const ref = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.0025;
      const px = (pointer.lerpNX - 0.5) * 30;
      const py = (pointer.lerpNY - 0.5) * 20;
      const drift = scrollState.progress * 60;
      el.style.transform = `translate3d(${px.toFixed(2)}px, ${(py - drift).toFixed(
        2
      )}px, 0) rotate(${(Math.sin(t) * 1.4).toFixed(3)}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <svg
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed -top-[20%] -left-[10%] w-[140%] h-[140%] z-[6] mix-blend-screen opacity-40 will-change-transform"
      viewBox="0 0 1200 1200"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <linearGradient id="ray-grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(255,233,180,0.0)" />
          <stop offset="20%" stopColor="rgba(255,233,180,0.45)" />
          <stop offset="60%" stopColor="rgba(255,233,180,0.18)" />
          <stop offset="100%" stopColor="rgba(255,233,180,0.0)" />
        </linearGradient>
        <filter id="ray-blur">
          <feGaussianBlur stdDeviation="14" />
        </filter>
      </defs>
      <g
        transform="rotate(-18 600 600)"
        style={{ mixBlendMode: 'screen' }}
        filter="url(#ray-blur)"
      >
        <rect x="120" y="-200" width="60" height="1600" fill="url(#ray-grad)" />
        <rect x="320" y="-200" width="30" height="1600" fill="url(#ray-grad)" opacity="0.7" />
        <rect x="540" y="-200" width="80" height="1600" fill="url(#ray-grad)" opacity="0.5" />
        <rect x="780" y="-200" width="40" height="1600" fill="url(#ray-grad)" opacity="0.8" />
        <rect x="920" y="-200" width="22" height="1600" fill="url(#ray-grad)" opacity="0.6" />
      </g>
    </svg>
  );
}
