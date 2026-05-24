export default function Vignette() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[55]"
      style={{
        background:
          'radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(4,9,18,0.45) 85%, rgba(4,9,18,0.85) 100%)',
      }}
    />
  );
}
