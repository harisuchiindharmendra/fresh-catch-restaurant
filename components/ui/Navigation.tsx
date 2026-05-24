'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const links = [
  { label: 'Menu', href: '#dishes' },
  { label: 'Chef', href: '#chef' },
  { label: 'Room', href: '#dining' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Reserve', href: '#reserve' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
        scrolled
          ? 'py-4 backdrop-blur-md bg-navy-900/60 border-b border-ivory/5'
          : 'py-8 bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-[1400px] px-6 lg:px-12 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <span className="font-serif text-2xl tracking-wide text-ivory">
            Fresh Catch
          </span>
          <span className="hidden sm:inline-block h-px w-8 bg-gold/50 group-hover:w-12 transition-all duration-500" />
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.4em] text-muted">
            Est. 2014
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-10">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative text-[11px] uppercase tracking-[0.3em] text-ivory/70 hover:text-ivory transition-colors duration-500"
              >
                {l.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-gold transition-all duration-700 group-hover:w-full" />
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#reserve"
          className="hidden md:inline-flex items-center gap-2 border border-ivory/15 hover:border-gold/60 px-5 py-2.5 text-[11px] uppercase tracking-[0.3em] text-ivory hover:text-gold transition-all duration-500"
        >
          Reserve
          <span aria-hidden>→</span>
        </a>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            className={`block w-6 h-px bg-ivory transition-transform duration-300 ${
              open ? 'translate-y-1.5 rotate-45' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-ivory transition-transform duration-300 ${
              open ? '-translate-y-1 -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {open && (
        <div className="md:hidden mt-6 px-6 pb-6 border-t border-ivory/5">
          <ul className="flex flex-col gap-5 pt-6">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-sm uppercase tracking-[0.3em] text-ivory/80 hover:text-gold transition-colors"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
