interface Props {
  size?: number;
  className?: string;
}

/**
 * Minimal fish-in-circle mark. Thin elegant linework, monochrome, retina-
 * crisp at any size. Drawn entirely in SVG — no raster asset.
 *
 * Geometry:
 *   - 32 × 32 viewbox
 *   - Outer ring at r=13, stroke 0.6
 *   - Fish body: eye-shape via two opposing bezier arcs
 *   - Tail: split-fin opening to the right at 30° apart
 *   - Eye: 0.4 dot
 *
 * Aman/Four-Seasons restraint — no shading, no thick outline, no clipart.
 * Currentcolor everywhere — caller controls hue via text-ivory / text-gold.
 */
export default function Logo({ size = 22, className = '' }: Props) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* outer ring */}
      <circle cx="16" cy="16" r="13" />
      {/* fish body — two arcs forming an eye-shape pointing left */}
      <path d="M9 16 Q14 11.5 19 16" />
      <path d="M9 16 Q14 20.5 19 16" />
      {/* tail */}
      <path d="M19 16 L22.5 13.4" />
      <path d="M19 16 L22.5 18.6" />
      <path d="M22.5 13.4 L22.5 18.6" />
      {/* eye — single dot */}
      <circle cx="11.8" cy="15.4" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}
