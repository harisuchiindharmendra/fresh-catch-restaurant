'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { useSceneStore } from '@/store/scene-store';
import { pointer } from '@/lib/pointer';
import { getReducedMotion, isMobile } from '@/lib/scroll';

export default function DiningExperience() {
  const ref = useRef<HTMLElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      // dolly zoom — image scales as we scroll past
      gsap.fromTo(
        bgRef.current,
        { scale: 1.05, yPercent: -6 },
        {
          scale: 1.18,
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.4,
          },
        }
      );

      // headline mask reveal
      gsap.fromTo(
        '.dining-headline span',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.6,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.dining-card', start: 'top 80%' },
        }
      );

      gsap.from('.dining-card .stagger', {
        y: 40,
        opacity: 0,
        duration: 1.2,
        stagger: 0.12,
        ease: 'expo.out',
        delay: 0.3,
        scrollTrigger: { trigger: '.dining-card', start: 'top 80%' },
      });

      // big numbers counter
      const counters = gsap.utils.toArray<HTMLElement>('.dining-counter');
      counters.forEach((el) => {
        const end = Number(el.dataset.end || '0');
        const obj = { v: 0 };
        gsap.to(obj, {
          v: end,
          duration: 2,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.dining-card', start: 'top 75%' },
          onUpdate: () => {
            el.textContent = Math.round(obj.v).toString();
          },
        });
      });

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveScene(3),
        onEnterBack: () => setActiveScene(3),
      });
    }, ref);
    return () => ctx.revert();
  }, [setActiveScene]);

  // magnetic glass card — drifts subtly with cursor
  useEffect(() => {
    const el = cardRef.current;
    if (!el || getReducedMotion() || isMobile()) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let rx = 0;
    let ry = 0;
    const tick = () => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (pointer.lerpX - cx) / window.innerWidth;
      const dy = (pointer.lerpY - cy) / window.innerHeight;
      const targetX = dx * 18;
      const targetY = dy * 14;
      const targetRX = -dy * 4;
      const targetRY = dx * 5;
      tx += (targetX - tx) * 0.08;
      ty += (targetY - ty) * 0.08;
      rx += (targetRX - rx) * 0.08;
      ry += (targetRY - ry) * 0.08;
      el.style.transform = `translate3d(${tx.toFixed(2)}px, ${ty.toFixed(
        2
      )}px, 0) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="dining"
      ref={ref}
      className="relative h-[130vh] lg:h-[150vh] overflow-hidden bg-navy-950"
    >
      <div
        ref={bgRef}
        className="absolute inset-0 -inset-y-[12%] will-change-transform"
      >
        <Image
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=85"
          alt="Restaurant interior"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/75 via-navy-900/45 to-navy-950/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/70 via-transparent to-transparent" />
        {/* drifting light layer */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-70 breath"
          style={{
            background:
              'radial-gradient(60% 50% at 30% 30%, rgba(200,168,106,0.18), transparent 60%), radial-gradient(70% 60% at 80% 80%, rgba(35,84,138,0.22), transparent 65%)',
          }}
        />
      </div>

      <div className="relative z-10 h-full mx-auto max-w-[1500px] px-6 lg:px-12 flex items-center" style={{ perspective: '1400px' }}>
        <div
          ref={cardRef}
          className="dining-card glass-strong max-w-xl p-10 lg:p-14 space-y-8 will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <div className="stagger flex items-center gap-4">
            <span className="block h-px w-12 bg-gold" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold">
              04 — The Room
            </p>
          </div>

          <h2 className="dining-headline font-serif text-[clamp(2rem,4.5vw,4rem)] leading-[0.98] text-ivory font-light">
            <span className="block overflow-hidden">
              <span className="block">Forty seats.</span>
            </span>
            <span className="block overflow-hidden italic text-ivory/55">
              <span className="block">One open kitchen.</span>
            </span>
          </h2>

          <p className="stagger text-ivory/70 text-base leading-[1.85] font-light">
            Low light. Heavy linen. The hum of conversation kept just below
            the sound of the pass. The room was designed by Studio Lascelles
            to disappear — so the food, and the night, could be remembered.
          </p>

          <div className="stagger grid grid-cols-2 gap-8 pt-8 border-t border-ivory/10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-3">
                Seating
              </p>
              <p className="font-serif text-4xl text-ivory">
                <span className="dining-counter" data-end="40">0</span>
                <span className="text-ivory/40 text-2xl ml-1">guests</span>
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-[0.3em] text-gold mb-3">
                Service
              </p>
              <p className="font-serif text-4xl text-ivory">Tue—Sun</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
