import Link from 'next/link';

export const metadata = {
  title: 'Off the menu',
};

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-navy-950 flex items-center">
      <div className="mx-auto max-w-[1500px] px-8 lg:px-16 grid grid-cols-12 w-full">
        <div className="col-span-12 lg:col-span-6 lg:col-start-2 space-y-10">
          <p className="text-[10px] uppercase tracking-[0.5em] text-ivory/40">
            404 · Off the menu
          </p>

          <h1 className="font-serif text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[1.0] text-ivory font-light">
            That table
            <br />
            <span className="italic text-ivory/55">isn&rsquo;t set.</span>
          </h1>

          <p className="max-w-md text-[15px] text-ivory/50 leading-[1.95] font-light">
            The page you&rsquo;re looking for hasn&rsquo;t arrived from the
            kitchen.
          </p>

          <Link
            href="/"
            className="group inline-flex items-center gap-3 text-[11px] uppercase tracking-[0.4em] text-ivory hover:text-gold transition-colors duration-700"
          >
            Return to the room
            <span
              aria-hidden
              className="inline-block w-10 h-px bg-current transition-all duration-700 group-hover:w-16"
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
