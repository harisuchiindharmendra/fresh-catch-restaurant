'use client';

import { useEffect, useState, type ComponentType } from 'react';
import { getReducedMotion, isMobile } from '@/lib/scroll';

/**
 * Client-only WebGL marine layer.
 *
 * Manual dynamic-import (instead of next/dynamic) — the React.lazy/Suspense
 * boundary that next/dynamic creates triggered a hydration cascade in the
 * dev-overlay tree. Manual import() lives outside React's reconciliation
 * boundary and ships clean in production.
 *
 * SSR: returns null.
 * Client: imports MarineFloaters (R3F) after first paint, mounts it.
 * Fallback: skip entirely on coarse-pointer / reduced-motion / no-WebGL.
 */
export default function HeroMarineLayer() {
  const [MarineComp, setMarineComp] = useState<ComponentType | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (getReducedMotion() || isMobile()) return;
    try {
      const probe = document.createElement('canvas');
      const gl =
        probe.getContext('webgl2') ||
        probe.getContext('webgl') ||
        probe.getContext('experimental-webgl');
      if (!gl) return;
    } catch {
      return;
    }
    let cancelled = false;
    import('./MarineFloaters').then((mod) => {
      if (!cancelled) setMarineComp(() => mod.default);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!MarineComp) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[7] mix-blend-screen opacity-90"
    >
      <MarineComp />
    </div>
  );
}
