import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { menuExtended, siteConfig } from '@/lib/config';
import { BLUR_NAVY } from '@/lib/imagePlaceholder';

export const metadata: Metadata = {
  title: 'The Menu',
  description:
    'Coastal Indian seafood — tandoor, curries, banana-leaf preparations, dry roasts and catch of the day.',
};

/**
 * /menu — dedicated editorial menu route.
 *
 * A reading, not a delivery list. Each course leads with a sticky
 * title; each dish gets a cinematic image at editorial scale plus
 * restrained typography. Alternating sides on desktop creates visual
 * rhythm. No prices online — luxury restraint.
 */
export default function MenuPage() {
  return (
    <main className="relative min-h-screen bg-navy-950">
      <div className="mx-auto max-w-[1500px] px-8 lg:px-16 pt-40 pb-32 lg:pt-52 lg:pb-44">
        {/* Header */}
        <header className="grid grid-cols-12 gap-8 mb-32 lg:mb-44">
          <div className="col-span-12 lg:col-span-8 lg:col-start-2 space-y-10">
            <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/45">
              The Menu
            </p>
            <h1 className="font-serif text-[clamp(2.8rem,7vw,6.4rem)] leading-[0.98] text-ivory font-light">
              A reading of
              <br />
              <span className="italic text-ivory/55">the coast.</span>
            </h1>
            <p className="max-w-md text-[15px] text-ivory/55 leading-[1.95] font-light">
              What follows is what the kitchen has been making this season.
              The list changes with the tide. Some plates leave when the sea
              is rough; others arrive without notice. Prices on request.
            </p>
            <Link
              href="/#reserve"
              className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-ivory/70 hover:text-ivory transition-colors duration-700"
            >
              Reserve a table
              <span
                aria-hidden
                className="inline-block w-10 h-px bg-current transition-all duration-700 group-hover:w-16"
              />
            </Link>
          </div>
        </header>

        {/* Courses */}
        <div className="space-y-32 lg:space-y-48">
          {menuExtended.map((course, courseIdx) => (
            <section
              key={course.course}
              className="grid grid-cols-12 gap-x-8 gap-y-12"
            >
              {/* Sticky course title */}
              <div className="col-span-12 lg:col-span-3 lg:col-start-2 space-y-5 lg:sticky lg:top-32 lg:self-start">
                <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/40">
                  Course · 0{courseIdx + 1}
                </p>
                <h2 className="font-serif text-3xl lg:text-4xl text-ivory font-light leading-[1.1]">
                  {course.course}
                </h2>
                <p className="text-[13px] text-ivory/45 leading-[1.95] font-light italic max-w-[260px]">
                  {course.caption}
                </p>
              </div>

              {/* Dish spreads */}
              <div className="col-span-12 lg:col-span-7 lg:col-start-6 space-y-20 lg:space-y-28">
                {course.items.map((item, idx) => {
                  const altRow = idx % 2 === 1;
                  return (
                    <article
                      key={item.name}
                      className={`grid grid-cols-12 gap-x-6 gap-y-6 items-end ${
                        altRow ? 'lg:grid-flow-dense' : ''
                      }`}
                    >
                      {item.image && (
                        <div
                          className={`col-span-12 sm:col-span-7 ${
                            altRow ? 'lg:col-start-6 lg:col-span-7' : 'lg:col-span-7'
                          } flex justify-center`}
                        >
                          <div className="relative aspect-[4/5] overflow-hidden bg-navy-800/40 w-full max-w-[460px]">
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 1024px) 90vw, 460px"
                              placeholder="blur"
                              blurDataURL={BLUR_NAVY}
                              quality={90}
                              priority={courseIdx === 0 && idx === 0}
                              className="object-cover enhance-img"
                            />
                            <div
                              aria-hidden
                              className="absolute inset-0 pointer-events-none"
                              style={{
                                background:
                                  'radial-gradient(120% 90% at 50% 50%, transparent 60%, rgba(4,9,18,0.22) 100%)',
                              }}
                            />
                          </div>
                        </div>
                      )}
                      <div
                        className={`col-span-12 sm:col-span-5 ${
                          altRow ? 'lg:col-start-1 lg:col-span-5 lg:row-start-1' : 'lg:col-span-5'
                        } pb-3 space-y-4`}
                      >
                        <h3 className="font-serif text-2xl lg:text-[28px] text-ivory/95 font-light leading-[1.15]">
                          {item.name}
                        </h3>
                        <p className="text-[14px] text-ivory/55 leading-[1.95] font-light max-w-sm">
                          {item.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Tail */}
        <div className="grid grid-cols-12 mt-40 lg:mt-56 pt-12 border-t border-ivory/8">
          <div className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-1 lg:grid-cols-3 gap-y-10 gap-x-10">
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/40">
                Open
              </p>
              <p className="text-sm text-ivory/65 font-light leading-[1.85]">
                {siteConfig.hours.detail}
              </p>
            </div>
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/40">
                Reservations
              </p>
              <p className="text-sm font-light leading-[1.85]">
                <a
                  href={`tel:${siteConfig.phone.tel}`}
                  className="text-ivory/65 hover:text-ivory transition-colors duration-700"
                >
                  {siteConfig.phone.display}
                </a>
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/"
                className="group inline-flex items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-ivory/55 hover:text-ivory transition-colors duration-700"
              >
                Return
                <span
                  aria-hidden
                  className="inline-block w-8 h-px bg-current transition-all duration-700 group-hover:w-12"
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
