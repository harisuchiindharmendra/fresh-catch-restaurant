'use client';

import { useEffect, useMemo, useRef } from 'react';
import { pointer } from '@/lib/pointer';
import { scrollState } from '@/lib/scroll-state';
import { getReducedMotion, isMobile } from '@/lib/scroll';

interface Props {
  lineOne: string;
  lineTwo: string;
}

export default function HeroTitle({ lineOne, lineTwo }: Props) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const split = useMemo(() => {
    const splitLine = (text: string) => text.split(' ');
    return { one: splitLine(lineOne), two: splitLine(lineTwo) };
  }, [lineOne, lineTwo]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    if (getReducedMotion() || isMobile()) return;

    const chars = Array.from(
      container.querySelectorAll<HTMLSpanElement>('.char')
    );

    type CharData = { el: HTMLSpanElement; tx: number; ty: number; tr: number };
    const charData: CharData[] = chars.map((el) => ({ el, tx: 0, ty: 0, tr: 0 }));

    let raf = 0;
    const radius = 280;
    const tick = () => {
      for (const c of charData) {
        const rect = c.el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = pointer.lerpX - cx;
        const dy = pointer.lerpY - cy;
        const dist = Math.hypot(dx, dy);
        const falloff = Math.max(0, 1 - dist / radius);
        const power = falloff * falloff * 22;
        const dirX = dist > 0.001 ? dx / dist : 0;
        const dirY = dist > 0.001 ? dy / dist : 0;
        const targetX = -dirX * power;
        const targetY = -dirY * power - scrollState.lerpVelocity * 0.4;
        const targetR = falloff * (dirX > 0 ? -4 : 4);
        c.tx += (targetX - c.tx) * 0.16;
        c.ty += (targetY - c.ty) * 0.16;
        c.tr += (targetR - c.tr) * 0.16;
        c.el.style.transform = `translate3d(${c.tx.toFixed(2)}px, ${c.ty.toFixed(
          2
        )}px, 0) rotate(${c.tr.toFixed(2)}deg)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [lineOne, lineTwo]);

  return (
    <h1
      ref={containerRef}
      className="font-serif text-[clamp(2.6rem,7.5vw,7rem)] leading-[1.0] font-light text-ivory text-balance text-shadow-cinema"
    >
      <span className="block overflow-hidden">
        <span className="hero-line block">
          {split.one.map((word, i) => (
            <span key={`o-${i}`} className="word mr-[0.25em]">
              {word.split('').map((ch, j) => (
                <span key={j} className="char">
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </span>
      </span>
      <span className="block overflow-hidden italic text-gold/90">
        <span className="hero-line block">
          {split.two.map((word, i) => (
            <span key={`t-${i}`} className="word mr-[0.25em]">
              {word.split('').map((ch, j) => (
                <span key={j} className="char">
                  {ch}
                </span>
              ))}
            </span>
          ))}
        </span>
      </span>
    </h1>
  );
}
