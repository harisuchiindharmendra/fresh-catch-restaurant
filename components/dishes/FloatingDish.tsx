'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { pointer } from '@/lib/pointer';
import { getReducedMotion, isMobile } from '@/lib/scroll';

interface Props {
  index: number;
  name: string;
  description: string;
  image: string;
  pairing: string;
  offsetX: number;
  parallax: number;
  rotate: number;
  width: string;
  align: 'left' | 'right';
  numeral: string;
}

export default function FloatingDish({
  index,
  name,
  description,
  image,
  pairing,
  offsetX,
  parallax,
  rotate,
  width,
  align,
  numeral,
}: Props) {
  const wrapRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const numeralRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const tilt = tiltRef.current;
    const img = imgRef.current;
    const num = numeralRef.current;
    if (!wrap || !tilt || !img) return;

    const reduced = getReducedMotion();
    const mobile = isMobile();
    let raf = 0;

    let rx = 0;
    let ry = 0;
    let scale = 1;
    let py = 0;
    let numY = 0;

    const tick = () => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      const vh = window.innerHeight;
      const distFromCenter = (cy - vh / 2) / vh;
      const targetPY = -distFromCenter * parallax;
      py += (targetPY - py) * 0.12;

      const targetNumY = -distFromCenter * (parallax * 1.6);
      numY += (targetNumY - numY) * 0.1;

      let targetRX = 0;
      let targetRY = 0;
      let targetScale = 1;
      if (!reduced && !mobile) {
        const dx = (pointer.lerpX - cx) / (window.innerWidth / 2);
        const dy = (pointer.lerpY - cy) / vh;
        targetRX = -dy * 7;
        targetRY = dx * 9;
        const hover = wrap.matches(':hover, :focus-within');
        if (hover) targetScale = 1.04;
      }
      rx += (targetRX - rx) * 0.08;
      ry += (targetRY - ry) * 0.08;
      scale += (targetScale - scale) * 0.08;

      wrap.style.transform = `translate3d(0, ${py.toFixed(2)}px, 0)`;
      tilt.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(
        2
      )}deg) translateZ(0) scale(${scale.toFixed(3)})`;
      img.style.transform = `translate3d(${(-ry * 1.6).toFixed(2)}px, ${(
        rx * 1.6
      ).toFixed(2)}px, 0) scale(1.08)`;
      if (num) num.style.transform = `translate3d(0, ${numY.toFixed(2)}px, 0)`;

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [parallax]);

  const numeralAlign =
    align === 'left'
      ? 'right-[-2vw] lg:right-[-6vw] text-right'
      : 'left-[-2vw] lg:left-[-6vw] text-left';

  return (
    <article
      ref={wrapRef}
      className={`floating-dish group relative ${width} will-change-transform`}
      style={{
        marginLeft: align === 'left' ? `${offsetX}vw` : 'auto',
        marginRight: align === 'right' ? `${offsetX}vw` : 'auto',
      }}
    >
      {/* monumental Roman numeral backdrop */}
      <span
        ref={numeralRef}
        aria-hidden
        className={`pointer-events-none absolute top-[-8%] ${numeralAlign} font-serif italic editorial-numeral text-[clamp(8rem,22vw,22rem)] leading-none text-stroke-gold select-none whitespace-nowrap will-change-transform`}
        style={{ zIndex: 0 }}
      >
        {numeral}
      </span>

      <div className="relative" style={{ perspective: '1300px' }}>
        <div
          ref={tiltRef}
          className="relative will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotate(${rotate}deg)`,
          }}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-navy-800/40">
            <div ref={imgRef} className="absolute inset-0 will-change-transform">
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-[filter] duration-[1200ms] ease-out group-hover:brightness-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/60 via-transparent to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-ivory/5" />

            <div className="absolute top-6 left-6 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.4em] text-ivory/85">
                Plate · {numeral}
              </span>
              <span className="block h-px w-10 bg-gold/60 transition-all duration-700 group-hover:w-16 group-hover:bg-gold" />
            </div>

            <span className="pointer-events-none absolute top-4 right-4 w-8 h-8 border-t border-r border-gold/0 group-hover:border-gold/70 transition-all duration-700" />
            <span className="pointer-events-none absolute bottom-4 left-4 w-8 h-8 border-b border-l border-gold/0 group-hover:border-gold/70 transition-all duration-700" />
          </div>

          {/* floating editorial caption */}
          <div
            className="absolute -bottom-6 left-0 right-0 translate-y-full pt-10 max-w-md"
            style={{ transform: 'translate3d(0, 100%, 24px)' }}
          >
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
                Signature
              </span>
              <span className="h-px flex-1 bg-ivory/10" />
            </div>
            <h3 className="font-serif text-3xl lg:text-5xl text-ivory font-light leading-[1.05]">
              {name}
            </h3>
            <p className="mt-5 text-ivory/60 text-sm lg:text-base leading-[1.85] max-w-sm">
              {description}
            </p>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold/70">
                Pairing
              </span>
              <span className="text-sm text-ivory/70 italic font-serif">
                {pairing}
              </span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
