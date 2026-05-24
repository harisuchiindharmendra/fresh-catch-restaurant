'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { pointer } from '@/lib/pointer';
import { scrollState } from '@/lib/scroll-state';
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
}: Props) {
  const wrapRef = useRef<HTMLElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const tilt = tiltRef.current;
    const img = imgRef.current;
    if (!wrap || !tilt || !img) return;

    const reduced = getReducedMotion();
    const mobile = isMobile();
    let raf = 0;

    let rx = 0;
    let ry = 0;
    let scale = 1;
    let py = 0;

    const tick = () => {
      const rect = wrap.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;

      // parallax Y based on element's distance from viewport center
      const vh = window.innerHeight;
      const distFromCenter = (cy - vh / 2) / vh;
      const targetPY = -distFromCenter * parallax;
      py += (targetPY - py) * 0.12;

      // cursor tilt — only when in viewport-ish
      let targetRX = 0;
      let targetRY = 0;
      let targetScale = 1;
      if (!reduced && !mobile) {
        const dx = (pointer.lerpX - cx) / (window.innerWidth / 2);
        const dy = (pointer.lerpY - cy) / vh;
        targetRX = -dy * 6;
        targetRY = dx * 7;
        // hover proximity scale
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
      // tiny image counter-shift for depth feel
      img.style.transform = `translate3d(${(-ry * 1.4).toFixed(2)}px, ${(
        rx * 1.4
      ).toFixed(2)}px, 0) scale(1.06)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [parallax]);

  return (
    <article
      ref={wrapRef}
      className={`floating-dish group relative ${width} will-change-transform`}
      style={{
        marginLeft: align === 'left' ? `${offsetX}vw` : 'auto',
        marginRight: align === 'right' ? `${offsetX}vw` : 'auto',
      }}
    >
      <div className="relative" style={{ perspective: '1200px' }}>
        <div
          ref={tiltRef}
          className="relative will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotate(${rotate}deg)`,
          }}
        >
          <div className="relative aspect-[4/5] overflow-hidden bg-navy-800/40">
            <div
              ref={imgRef}
              className="absolute inset-0 will-change-transform"
            >
              <Image
                src={image}
                alt={name}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-[filter,opacity] duration-[1200ms] ease-out group-hover:brightness-110"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/60 via-transparent to-transparent" />
            <div className="absolute inset-0 ring-1 ring-inset ring-ivory/5" />

            {/* floating index */}
            <div className="absolute top-6 left-6 flex items-center gap-3">
              <span className="text-[10px] uppercase tracking-[0.4em] text-ivory/85">
                0{index + 1}
              </span>
              <span className="block h-px w-10 bg-gold/60 transition-all duration-700 group-hover:w-16 group-hover:bg-gold" />
            </div>

            {/* hover gold corner */}
            <span className="pointer-events-none absolute top-4 right-4 w-8 h-8 border-t border-r border-gold/0 group-hover:border-gold/70 transition-all duration-700" />
            <span className="pointer-events-none absolute bottom-4 left-4 w-8 h-8 border-b border-l border-gold/0 group-hover:border-gold/70 transition-all duration-700" />
          </div>

          {/* floating caption that sits at depth */}
          <div
            ref={textRef}
            className="absolute -bottom-6 left-0 right-0 translate-y-full pt-8 max-w-md"
            style={{ transform: 'translate3d(0, 100%, 24px)' }}
          >
            <div className="flex items-baseline gap-4 mb-4">
              <span className="text-[10px] uppercase tracking-[0.4em] text-gold">
                Signature
              </span>
              <span className="h-px flex-1 bg-ivory/10" />
            </div>
            <h3 className="font-serif text-3xl lg:text-4xl text-ivory font-light leading-tight">
              {name}
            </h3>
            <p className="mt-4 text-ivory/60 text-sm leading-relaxed max-w-sm">
              {description}
            </p>
            <p className="mt-4 text-[10px] uppercase tracking-[0.4em] text-gold/70">
              Pairing
            </p>
            <p className="mt-1 text-sm text-ivory/70 italic font-serif">
              {pairing}
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
