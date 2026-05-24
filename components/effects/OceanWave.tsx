'use client';

import { useEffect, useRef } from 'react';

interface Props {
  className?: string;
  height?: number;
}

export default function OceanWave({ className = '', height = 80 }: Props) {
  const ref = useRef<SVGPathElement>(null);
  const ref2 = useRef<SVGPathElement>(null);

  useEffect(() => {
    const a = ref.current;
    const b = ref2.current;
    if (!a || !b) return;
    let raf = 0;
    let t = 0;
    const w = 1440;
    const tick = () => {
      t += 0.012;
      const points: string[] = [];
      const points2: string[] = [];
      const step = 60;
      for (let x = 0; x <= w; x += step) {
        const y1 = height / 2 + Math.sin(x * 0.008 + t) * (height * 0.32) + Math.sin(x * 0.02 - t * 1.4) * 4;
        const y2 = height / 2 + Math.cos(x * 0.006 - t * 0.8) * (height * 0.28) + Math.sin(x * 0.018 + t) * 5;
        points.push(`${x},${y1.toFixed(2)}`);
        points2.push(`${x},${y2.toFixed(2)}`);
      }
      a.setAttribute('d', `M0,${height} L${points.join(' L')} L${w},${height} Z`);
      b.setAttribute('d', `M0,${height} L${points2.join(' L')} L${w},${height} Z`);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [height]);

  return (
    <svg
      aria-hidden
      className={className}
      viewBox={`0 0 1440 ${height}`}
      preserveAspectRatio="none"
    >
      <path ref={ref} fill="rgba(200,168,106,0.10)" />
      <path ref={ref2} fill="rgba(35,84,138,0.18)" />
    </svg>
  );
}
