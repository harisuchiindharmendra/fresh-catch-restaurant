import { siteConfig } from '@/lib/config';

export default function Footer() {
  return (
    <footer className="relative bg-navy-950 px-8 lg:px-16 pt-40 pb-20">
      <div className="mx-auto max-w-[1500px]">
        <div className="grid grid-cols-12 gap-y-16 gap-x-8 items-end">
          <div className="col-span-12 lg:col-span-5 space-y-5">
            <h3 className="font-serif italic text-3xl text-ivory/90">
              Fresh Catch
            </h3>
            <p className="text-[15px] text-ivory/45 leading-[1.85] font-light max-w-xs">
              Served slowly. Remembered always.
            </p>
          </div>

          <div className="col-span-6 lg:col-span-2 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/35">
              Visit
            </p>
            <p className="text-sm text-ivory/70 leading-[1.8] font-light">
              {siteConfig.address}
            </p>
          </div>

          <div className="col-span-6 lg:col-span-2 space-y-3">
            <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/35">
              Hours
            </p>
            <p className="text-sm text-ivory/70 leading-[1.8] font-light">
              {siteConfig.hours}
            </p>
          </div>

          <div className="col-span-12 lg:col-span-3 space-y-3 lg:text-right">
            <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/35">
              Contact
            </p>
            <p className="text-sm text-ivory/70 font-light">
              <a
                href="tel:+15552473474"
                className="hover:text-ivory transition-colors duration-700"
              >
                {siteConfig.phone}
              </a>
            </p>
          </div>
        </div>

        <div className="mt-28 pt-8 border-t border-ivory/8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/30">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
          <p className="text-[10px] uppercase tracking-[0.4em] text-ivory/25">
            All evenings, by reservation
          </p>
        </div>
      </div>
    </footer>
  );
}
