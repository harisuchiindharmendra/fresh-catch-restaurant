'use client';

import { useEffect, useRef } from 'react';
import { pointer } from '@/lib/pointer';

interface Props {
  href?: string;
  variant?: 'solid' | 'ghost';
  cursorLabel?: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  strength?: number;
}

export default function MagneticButton({
  href,
  variant = 'solid',
  cursorLabel,
  children,
  className = '',
  onClick,
  strength = 0.35,
}: Props) {
  const ref = useRef<HTMLAnchorElement | HTMLButtonElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const inner = innerRef.current;
    if (!el || !inner) return;

    let raf = 0;
    let near = false;
    let tx = 0;
    let ty = 0;
    let itx = 0;
    let ity = 0;

    const tick = () => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const radius = Math.max(rect.width, rect.height) * 0.9;
      const dx = pointer.x - cx;
      const dy = pointer.y - cy;
      const dist = Math.hypot(dx, dy);
      near = dist < radius;
      const targetX = near ? dx * strength : 0;
      const targetY = near ? dy * strength : 0;
      tx += (targetX - tx) * 0.18;
      ty += (targetY - ty) * 0.18;
      itx += (targetX * 0.4 - itx) * 0.18;
      ity += (targetY * 0.4 - ity) * 0.18;
      el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      inner.style.transform = `translate3d(${itx}px, ${ity}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [strength]);

  const baseClasses =
    'group relative inline-flex items-center gap-3 px-8 py-4 text-[11px] uppercase tracking-[0.3em] font-medium will-change-transform overflow-hidden';

  const styleClasses =
    variant === 'solid'
      ? 'bg-ivory text-navy-900 hover:bg-gold transition-colors duration-700'
      : 'border border-ivory/20 text-ivory hover:text-gold hover:border-gold/60 transition-colors duration-700';

  const content = (
    <span ref={innerRef} className="relative z-10 inline-flex items-center gap-3 will-change-transform">
      {children}
    </span>
  );

  if (href) {
    return (
      <a
        ref={ref as React.RefObject<HTMLAnchorElement>}
        href={href}
        data-cursor={cursorLabel}
        className={`${baseClasses} ${styleClasses} ${className}`}
      >
        {content}
      </a>
    );
  }
  return (
    <button
      ref={ref as React.RefObject<HTMLButtonElement>}
      onClick={onClick}
      data-cursor={cursorLabel}
      className={`${baseClasses} ${styleClasses} ${className}`}
    >
      {content}
    </button>
  );
}
