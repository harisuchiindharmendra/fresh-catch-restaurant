'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';
import { useSceneStore } from '@/store/scene-store';
import { getReducedMotion } from '@/lib/scroll';
import { scrollState, startVelocityDecay } from '@/lib/scroll-state';
import { startPointerTracking } from '@/lib/pointer';

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const setScrollProgress = useSceneStore((s) => s.setScrollProgress);
  const setVelocityBucket = useSceneStore((s) => s.setVelocityBucket);

  useEffect(() => {
    startPointerTracking();
    startVelocityDecay();

    if (getReducedMotion()) return;

    const lenis = new Lenis({
      duration: 1.6,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.8,
      lerp: 0.085,
    });

    let lastVelocityBucket = 0;
    lenis.on(
      'scroll',
      ({
        scroll,
        limit,
        velocity,
        direction,
      }: {
        scroll: number;
        limit: number;
        velocity: number;
        direction: number;
      }) => {
        const progress = limit > 0 ? scroll / limit : 0;
        scrollState.scroll = scroll;
        scrollState.progress = progress;
        scrollState.velocity = velocity;
        scrollState.direction = direction === 0 ? 0 : direction > 0 ? 1 : -1;
        setScrollProgress(progress);

        const bucket = Math.min(3, Math.floor(Math.abs(velocity) / 18));
        if (bucket !== lastVelocityBucket) {
          lastVelocityBucket = bucket;
          setVelocityBucket(bucket);
        }
      }
    );

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [setScrollProgress, setVelocityBucket]);

  return <>{children}</>;
}
