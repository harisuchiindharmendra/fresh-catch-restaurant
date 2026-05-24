'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { useSceneStore } from '@/store/scene-store';
import { pointer } from '@/lib/pointer';
import { getReducedMotion, isMobile } from '@/lib/scroll';

const paragraphs = [
  'Chef Marcus Aurelio started his career on a small fishing boat off the Galician coast — long before he ever set foot in a Michelin kitchen.',
  'The menu at Fresh Catch is not a statement. It is a quiet correspondence between season, supplier, and the room. We work with three fishermen. We never freeze.',
];

const quote =
  'You cannot improve what the ocean has already perfected. You can only listen, and step out of the way.';

const splitWords = (s: string) =>
  s.split(' ').map((w, i) => (
    <span key={i} className="word word-fade inline-block mr-[0.28em]">
      {w}
    </span>
  ));

export default function ChefStory() {
  const ref = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const lightRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      // portrait crop reveal + parallax
      gsap.fromTo(
        '.chef-frame-inner',
        { scale: 1.25, opacity: 0 },
        {
          scale: 1,
          opacity: 1,
          duration: 2.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        }
      );

      gsap.fromTo(
        '.chef-frame-mask',
        { clipPath: 'inset(100% 0 0 0)' },
        {
          clipPath: 'inset(0% 0 0 0)',
          duration: 2.4,
          ease: 'expo.out',
          scrollTrigger: { trigger: ref.current, start: 'top 75%' },
        }
      );

      gsap.to('.chef-frame-inner', {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      });

      // documentary subtitle slide-up
      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 1.4,
        ease: 'expo.out',
        scrollTrigger: { trigger: ref.current, start: 'top 60%' },
      });

      // chapter label sweep
      gsap.from('.chef-chapter > *', {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.chef-chapter', start: 'top 80%' },
      });

      gsap.fromTo(
        '.chef-headline span',
        { yPercent: 110 },
        {
          yPercent: 0,
          duration: 1.4,
          stagger: 0.15,
          ease: 'expo.out',
          scrollTrigger: { trigger: '.chef-headline', start: 'top 80%' },
        }
      );

      // word-by-word documentary reveal driven by scroll progress
      gsap.utils
        .toArray<HTMLElement>('.chef-narration .word-fade')
        .forEach((el, i, arr) => {
          gsap.fromTo(
            el,
            { opacity: 0.18, y: 12 },
            {
              opacity: 1,
              y: 0,
              ease: 'none',
              scrollTrigger: {
                trigger: '.chef-narration',
                start: 'top 75%',
                end: 'bottom 55%',
                scrub: 1.2,
              },
              delay: (i / arr.length) * 0.6,
            }
          );
        });

      // attribution
      gsap.from('.chef-attr > *', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        ease: 'expo.out',
        scrollTrigger: { trigger: '.chef-attr', start: 'top 88%' },
      });

      // light sweep across portrait driven by scroll
      gsap.fromTo(
        '.chef-light-sweep',
        { backgroundPosition: '-120% 0' },
        {
          backgroundPosition: '220% 0',
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
          },
        }
      );

      ScrollTrigger.create({
        trigger: ref.current,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => setActiveScene(2),
        onEnterBack: () => setActiveScene(2),
      });
    }, ref);
    return () => ctx.revert();
  }, [setActiveScene]);

  // cursor spotlight on portrait
  useEffect(() => {
    const el = lightRef.current;
    const portrait = portraitRef.current;
    if (!el || !portrait || getReducedMotion() || isMobile()) return;
    let raf = 0;
    let lx = 50;
    let ly = 50;
    const tick = () => {
      const rect = portrait.getBoundingClientRect();
      const tx = ((pointer.lerpX - rect.left) / rect.width) * 100;
      const ty = ((pointer.lerpY - rect.top) / rect.height) * 100;
      const inFrame = tx > -20 && tx < 120 && ty > -20 && ty < 120;
      const targetX = inFrame ? Math.max(0, Math.min(100, tx)) : 50;
      const targetY = inFrame ? Math.max(0, Math.min(100, ty)) : 50;
      lx += (targetX - lx) * 0.07;
      ly += (targetY - ly) * 0.07;
      el.style.background = `radial-gradient(circle at ${lx.toFixed(
        1
      )}% ${ly.toFixed(1)}%, rgba(200,168,106,0.22), transparent 55%)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <section
      id="chef"
      ref={ref}
      className="relative bg-navy-950 py-40 lg:py-56 overflow-hidden"
    >
      <div className="mx-auto max-w-[1500px] px-6 lg:px-12 grid grid-cols-12 gap-10 lg:gap-20 items-center">
        {/* Portrait */}
        <div className="col-span-12 lg:col-span-6">
          <div
            ref={portraitRef}
            className="chef-frame relative aspect-[4/5] overflow-hidden"
          >
            <div className="chef-frame-mask absolute inset-0 overflow-hidden">
              <div className="chef-frame-inner absolute inset-0 -top-10 -bottom-10 will-change-transform">
                <Image
                  src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=1400&q=85"
                  alt="Chef Marcus Aurelio at the pass"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/20 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-tr from-navy-950/60 via-transparent to-transparent" />

              {/* scrolling light sweep */}
              <div
                className="chef-light-sweep absolute inset-0 mix-blend-overlay opacity-60"
                style={{
                  background:
                    'linear-gradient(110deg, transparent 30%, rgba(255,232,180,0.35) 50%, transparent 70%)',
                  backgroundSize: '220% 100%',
                }}
              />

              {/* cursor spotlight */}
              <div
                ref={lightRef}
                className="absolute inset-0 mix-blend-screen pointer-events-none"
              />
            </div>

            {/* documentary subtitle */}
            <div
              ref={subtitleRef}
              className="absolute bottom-6 left-6 right-6 flex items-center gap-3"
            >
              <span className="h-px flex-1 bg-gold/40" />
              <span className="text-[10px] uppercase tracking-[0.4em] text-ivory/70">
                Service No. 4128 · 02:17
              </span>
            </div>
          </div>
        </div>

        {/* Story */}
        <div className="col-span-12 lg:col-span-6 space-y-12">
          <div className="chef-chapter flex items-center gap-4">
            <span className="block h-px w-12 bg-gold" />
            <p className="text-[10px] uppercase tracking-[0.5em] text-gold">
              03 — The Chef
            </p>
          </div>

          <h2 className="chef-headline font-serif text-[clamp(2.4rem,5vw,4.8rem)] leading-[0.98] text-ivory font-light">
            <span className="block overflow-hidden">
              <span className="block">Twenty years at the pass.</span>
            </span>
            <span className="block overflow-hidden italic text-ivory/55">
              <span className="block">Still curious.</span>
            </span>
          </h2>

          <div className="chef-narration space-y-8 text-ivory/75 text-base lg:text-lg leading-[1.9] max-w-lg font-light">
            {paragraphs.map((p, i) => (
              <p key={i}>{splitWords(p)}</p>
            ))}
            <p className="font-serif italic text-xl lg:text-2xl text-gold/90 leading-snug">
              {splitWords(`“${quote}”`)}
            </p>
          </div>

          <div className="chef-attr flex items-center gap-6 pt-6">
            <span className="h-px w-16 bg-gold" />
            <div>
              <p className="text-sm text-ivory font-medium">Marcus Aurelio</p>
              <p className="text-[10px] uppercase tracking-[0.3em] text-muted mt-1">
                Chef · Founder
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
