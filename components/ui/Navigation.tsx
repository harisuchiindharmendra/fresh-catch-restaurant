'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

const links = [
  { label: 'Menu', href: '#dishes' },
  { label: 'Chef', href: '#chef' },
  { label: 'Room', href: '#dining' },
  { label: 'Memory', href: '#gallery' },
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
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-[900ms] ease-out ${
        scrolled
          ? 'py-5 backdrop-blur-md bg-navy-950/50'
          : 'py-10 bg-transparent'
      }`}
    >
      <nav className="mx-auto max-w-[1500px] px-8 lg:px-16 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-4">
          <span className="font-serif italic text-2xl tracking-wide text-ivory/90 group-hover:text-ivory transition-colors duration-700">
            Fresh Catch
          </span>
          <span className="hidden sm:inline-block h-px w-6 bg-ivory/20 group-hover:w-10 group-hover:bg-ivory/45 transition-all duration-700" />
        </Link>

        <ul className="hidden md:flex items-center gap-12">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="group relative text-[10px] uppercase tracking-[0.4em] text-ivory/45 hover:text-ivory transition-colors duration-700"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="tel:+15552473474"
          className="hidden md:inline-block text-[10px] uppercase tracking-[0.4em] text-ivory/45 hover:text-ivory transition-colors duration-700"
        >
          +1 555 247 FISH
        </a>

        <button
          aria-label="Toggle menu"
          onClick={() => setOpen((o) => !o)}
          className="md:hidden flex flex-col gap-1.5 p-2"
        >
          <span
            className={`block w-6 h-px bg-ivory/80 transition-transform duration-500 ${
              open ? 'translate-y-1.5 rotate-45' : ''
            }`}
          />
          <span
            className={`block w-6 h-px bg-ivory/80 transition-transform duration-500 ${
              open ? '-translate-y-1 -rotate-45' : ''
            }`}
          />
        </button>
      </nav>

      {open && (
        <div className="md:hidden mt-8 px-8 pb-8 border-t border-ivory/5">
          <ul className="flex flex-col gap-6 pt-8">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-xs uppercase tracking-[0.4em] text-ivory/70 hover:text-ivory transition-colors"
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
