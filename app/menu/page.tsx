import type { Metadata } from 'next';
import Link from 'next/link';
import { fullMenu, siteConfig } from '@/lib/config';

export const metadata: Metadata = {
  title: 'The Menu',
  description:
    'Coastal Indian seafood — tandoor, curries, banana-leaf preparations, dry roasts and catch of the day.',
};

/**
 * /menu — dedicated editorial menu route.
 *
 * Not a delivery menu. A reading. Categories lead, intros set the
 * tone, dishes follow as a typographic list. No prices online —
 * luxury restraint. Bottom returns to the reservation CTA.
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

        {/* Menu sections */}
        <div className="grid grid-cols-12 gap-y-32 lg:gap-y-44">
          {fullMenu.map((section) => (
            <section
              key={section.section}
              className="col-span-12 lg:col-span-10 lg:col-start-2 grid grid-cols-12 gap-x-8 gap-y-10"
            >
              <div className="col-span-12 lg:col-span-4 space-y-6 lg:sticky lg:top-32 lg:self-start">
                <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/40">
                  {section.section}
                </p>
                <p className="text-[14px] text-ivory/50 leading-[1.95] font-light max-w-xs">
                  {section.intro}
                </p>
              </div>
              <ul className="col-span-12 lg:col-span-7 lg:col-start-6 space-y-10">
                {section.items.map((item) => (
                  <li key={item.name} className="space-y-3">
                    <h2 className="font-serif text-2xl lg:text-3xl text-ivory/90 font-light leading-tight">
                      {item.name}
                    </h2>
                    <p className="text-[14px] text-ivory/55 leading-[1.85] font-light max-w-md">
                      {item.description}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        {/* Tail */}
        <div className="grid grid-cols-12 mt-40 lg:mt-56 pt-12 border-t border-ivory/8">
          <div className="col-span-12 lg:col-span-8 lg:col-start-2 grid grid-cols-1 lg:grid-cols-3 gap-y-10 gap-x-10">
            <div className="space-y-3">
              <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/40">
                Open
              </p>
              <p className="text-sm text-ivory/65 font-light leading-[1.85]">
                {siteConfig.hours.summaryFull}
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
