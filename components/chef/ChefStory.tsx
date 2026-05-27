'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { registerGSAP, gsap, ScrollTrigger } from '@/lib/gsap';
import { BLUR_NAVY } from '@/lib/imagePlaceholder';
import { useSceneStore } from '@/store/scene-store';

/**
 * v7 chef — pull-quote-led, not documentary-panel.
 *
 * A magazine spread: the quote dominates the page in display-italic at
 * editorial scale, then a small portrait sits below at a third of the
 * width, then the attribution. The story paragraphs are demoted to a
 * thin right column. The voice leads; the face follows.
 *
 * Reverses the usual chef-section hierarchy.
 */
export default function ChefStory() {
  const ref = useRef<HTMLElement>(null);
  const setActiveScene = useSceneStore((s) => s.setActiveScene);

  useEffect(() => {
    registerGSAP();
    const ctx = gsap.context(() => {
      gsap.from('.chef-quote-word', {
        y: 18,
        opacity: 0,
        duration: 1.6,
        stagger: 0.04,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.chef-quote', start: 'top 80%' },
      });

      gsap.from('.chef-side > *', {
        y: 20,
        opacity: 0,
        duration: 1.4,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.chef-side', start: 'top 82%' },
      });

      gsap.from('.chef-portrait', {
        opacity: 0,
        scale: 1.06,
        duration: 2,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.chef-portrait', start: 'top 88%' },
      });

      gsap.to('.chef-portrait-inner', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: '.chef-portrait',
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1.4,
        },
      });

      gsap.from('.chef-attr > *', {
        y: 16,
        opacity: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.chef-attr', start: 'top 90%' },
      });

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

  // pre-render quote with per-word spans for fade-in
  const quote =
    'You cannot improve what the ocean has already perfected. You can only listen, and step out of the way.';
  const quoteWords = quote.split(' ');

  return (
    <section
      id="chef"
      ref={ref}
      className="relative bg-navy-950 pt-44 lg:pt-60 pb-32 lg:pb-44 overflow-hidden"
    >
      <div className="mx-auto max-w-[1500px] px-8 lg:px-16">
        {/* Massive pull quote */}
        <div className="grid grid-cols-12 mb-32 lg:mb-44">
          <blockquote className="chef-quote col-span-12 lg:col-span-10 lg:col-start-2">
            <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/40 mb-12">
              In conversation with
            </p>
            <p className="font-serif italic font-light text-ivory/90 leading-[1.08] text-[clamp(2rem,5.8vw,5.4rem)]">
              {quoteWords.map((w, i) => (
                <span key={i} className="chef-quote-word inline-block mr-[0.32em]">
                  {w}
                </span>
              ))}
            </p>
          </blockquote>
        </div>

        {/* Small portrait + thin story column + attribution */}
        <div className="grid grid-cols-12 gap-10 lg:gap-16 items-start">
          <div className="chef-portrait relative col-span-12 sm:col-span-7 lg:col-span-4 lg:col-start-2 aspect-[4/5] overflow-hidden bg-navy-800/40">
            <div className="chef-portrait-inner absolute inset-0 -top-8 -bottom-8">
              <Image
                src="/images/chef.jpg"
                alt="Fresh Catch — at the pass"
                fill
                sizes="(max-width: 1024px) 70vw, 32vw"
                placeholder="blur"
                blurDataURL={BLUR_NAVY}
                quality={85}
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-transparent to-transparent" />
          </div>

          <div className="chef-side col-span-12 sm:col-span-5 lg:col-span-4 lg:col-start-7 space-y-7 text-ivory/55 text-[14px] lg:text-[15px] leading-[1.95] font-light max-w-sm">
            <p>
              Marcus Aurelio started on a small fishing boat off the
              Galician coast — long before he ever set foot in a Michelin
              kitchen.
            </p>
            <p>
              The menu is not a statement. It is a quiet correspondence
              between season, supplier, and the room. Three fishermen.
              Nothing frozen.
            </p>
            <p className="text-ivory/45 italic">
              When the sea is rough, the menu is short.
            </p>
          </div>

          <div className="chef-attr col-span-12 lg:col-span-2 lg:col-start-11 space-y-2 pt-2 lg:text-right">
            <p className="text-sm text-ivory/80 font-medium">Marcus Aurelio</p>
            <p className="text-[10px] uppercase tracking-[0.35em] text-ivory/35">
              Chef · Founder
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
