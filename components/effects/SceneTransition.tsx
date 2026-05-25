'use client';

import { useEffect, useRef } from 'react';
import { scrollState } from '@/lib/scroll-state';
import { pointer } from '@/lib/pointer';

/**
 * Scroll-driven scrim that morphs between scene atmospheres. Sits above
 * Aurora but below all content. Renders nothing visible in CSS — only its
 * inline gradient is updated each frame from scroll progress + cursor.
 *
 * The "world tone" shifts from cool surface-water to warm gold deep-water
 * as you fall through the page, giving the entire scroll the feel of
 * descending into a deeper room.
 */
type Stop = { p: number; tone: [number, number, number] };

// world tones — each stop is the dominant ambient color at that progress
const STOPS: Stop[] = [
  { p: 0.0, tone: [35, 84, 138] },   // hero — ocean blue
  { p: 0.18, tone: [22, 60, 112] },  // dishes — deeper blue
  { p: 0.38, tone: [44, 36, 70] },   // chef — warm aubergine
  { p: 0.58, tone: [110, 88, 56] },  // dining — bronze
  { p: 0.78, tone: [22, 50, 92] },   // gallery — back to deep blue
  { p: 1.0, tone: [200, 168, 106] }, // reserve — gold
];

function tone(progress: number): [number, number, number] {
  if (progress <= STOPS[0].p) return STOPS[0].tone;
  if (progress >= STOPS[STOPS.length - 1].p) return STOPS[STOPS.length - 1].tone;
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (progress >= a.p && progress <= b.p) {
      const t = (progress - a.p) / (b.p - a.p);
      const ease = t * t * (3 - 2 * t);
      return [
        Math.round(a.tone[0] + (b.tone[0] - a.tone[0]) * ease),
        Math.round(a.tone[1] + (b.tone[1] - a.tone[1]) * ease),
        Math.round(a.tone[2] + (b.tone[2] - a.tone[2]) * ease),
      ];
    }
  }
  return STOPS[0].tone;
}

export default function SceneTransition() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    let lerpP = 0;
    const tick = () => {
      lerpP += (scrollState.progress - lerpP) * 0.06;
      const [r, g, b] = tone(lerpP);
      const px = pointer.lerpNX * 100;
      const py = pointer.lerpNY * 100;
      el.style.background = `
        radial-gradient(60% 50% at ${px.toFixed(1)}% ${py.toFixed(1)}%, rgba(${r},${g},${b},0.18), transparent 60%),
        radial-gradient(80% 60% at 50% ${100 - lerpP * 60}%, rgba(${r},${g},${b},0.08), transparent 70%)
      `;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[6] mix-blend-screen"
    />
  );
}
