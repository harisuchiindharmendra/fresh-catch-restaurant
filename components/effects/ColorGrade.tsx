/**
 * Film-grade tint applied across the entire page via mix-blend-soft-light.
 * Pulls warm into highlights, cool into shadows — the colorist's trick
 * that makes everything feel "graded" instead of raw.
 *
 * Static, pure CSS, no JS. ~0 cost.
 */
export default function ColorGrade() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[59] mix-blend-soft-light"
      style={{
        background:
          'linear-gradient(180deg, rgba(200,168,106,0.10) 0%, rgba(35,84,138,0.10) 100%)',
      }}
    />
  );
}
