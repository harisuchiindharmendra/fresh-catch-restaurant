import { siteConfig } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="relative border-t border-ivory/5 bg-navy-950 px-6 lg:px-12 py-16">
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="space-y-4">
          <h3 className="font-serif text-2xl text-ivory">Fresh Catch</h3>
          <p className="text-sm text-muted leading-relaxed max-w-xs">
            Cinematic seafood. Served slowly. Remembered always.
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Visit
          </h4>
          <p className="text-sm text-ivory/80 leading-relaxed">
            {siteConfig.address}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Hours
          </h4>
          <p className="text-sm text-ivory/80 leading-relaxed">
            {siteConfig.hours}
          </p>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-[0.4em] text-gold">
            Contact
          </h4>
          <p className="text-sm text-ivory/80 leading-relaxed">
            {siteConfig.phone}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] mt-16 pt-8 border-t border-ivory/5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted">
          © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </p>
        <p className="text-[10px] uppercase tracking-[0.4em] text-muted">
          Crafted with care
        </p>
      </div>
    </footer>
  );
}
