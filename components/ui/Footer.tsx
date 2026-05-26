import { siteConfig } from '@/lib/config';
import Logo from './Logo';

export default function Footer() {
  const a = siteConfig.address;
  return (
    <footer className="relative bg-navy-950 px-8 lg:px-16 pt-40 pb-20">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid grid-cols-12 gap-y-16 gap-x-8 items-start">
          <div className="col-span-12 lg:col-span-5 space-y-5">
            <div className="flex items-center gap-4 text-ivory/85">
              <Logo size={24} />
              <h3 className="font-serif italic text-3xl">Fresh Catch</h3>
            </div>
            <p className="text-[15px] text-ivory/45 leading-[1.85] font-light max-w-xs">
              Served slowly. Remembered always.
            </p>
          </div>

          <div className="col-span-6 lg:col-span-3 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/35">
              Visit
            </p>
            <address className="not-italic text-sm text-ivory/70 leading-[1.85] font-light">
              {a.line1}
              <br />
              {a.line2}
              <br />
              {a.city}, {a.state} {a.postal}
            </address>
            <p className="pt-2">
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${a.line1}, ${a.line2}, ${a.city}, ${a.state} ${a.postal}`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.4em] text-ivory/45 hover:text-ivory transition-colors duration-700"
              >
                Directions →
              </a>
            </p>
          </div>

          <div className="col-span-6 lg:col-span-2 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/35">
              Hours
            </p>
            <p className="text-sm text-ivory/70 leading-[1.85] font-light">
              {siteConfig.hours.summary}
              <br />
              <span className="text-ivory/40 text-[13px]">All week</span>
            </p>
          </div>

          <div className="col-span-12 lg:col-span-2 lg:col-start-11 space-y-3 lg:text-right">
            <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/35">
              Contact
            </p>
            <p className="text-sm text-ivory/75 font-light">
              <a
                href={`tel:${siteConfig.phone.tel}`}
                className="hover:text-ivory transition-colors duration-700"
              >
                {siteConfig.phone.display}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-28 pt-8 border-t border-ivory/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/30">
            © {new Date().getFullYear()} {siteConfig.legalName}
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/25">
            All evenings, by reservation
          </p>
        </div>
      </div>
    </footer>
  );
}
