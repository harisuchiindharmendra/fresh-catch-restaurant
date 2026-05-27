interface Props {
  size?: number;
  className?: string;
}

/**
 * Fresh Catch mark — refined.
 *
 * A luxury monochrome interpretation of the restaurant's real logo
 * (fish + rod-and-reel in a circle). Drawn with thin elegant linework,
 * 0.55–0.7 stroke weight, currentColor everywhere so the caller controls
 * hue via text-ivory / text-gold.
 *
 * Composition (viewbox 40×40):
 *   - outer ring (r=17)
 *   - graceful fish silhouette facing right, single continuous curve
 *   - split-tail fin opening right
 *   - eye: 0.5 dot
 *   - subtle rod arc curving from lower-left over the fish
 *   - small reel circle at the rod's base
 *
 * Aman-Resorts restraint — no shading, no thick outline, no clipart.
 * Reads as an emblem at 22px in the nav and 24–32px elsewhere.
 */
export default function Logo({ size = 24, className = '' }: Props) {
  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      stroke="currentColor"
      strokeWidth={0.55}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      {/* subtle rod arc — drawn first so the fish sits in front */}
      <path
        d="M7 32 C 11 6, 26 5, 33 13"
        opacity="0.45"
        strokeWidth={0.5}
      />
      {/* reel base */}
      <circle cx="7" cy="32" r="1.6" opacity="0.55" strokeWidth={0.5} />
      <circle cx="7" cy="32" r="0.5" fill="currentColor" stroke="none" opacity="0.7" />

      {/* outer ring */}
      <circle cx="20" cy="20" r="17" />

      {/* fish body — graceful tapered eye shape */}
      <path d="M10 20 C 13 14.5, 20 14, 24.5 20 C 20 26, 13 25.5, 10 20 Z" />

      {/* tail — split fin opening to the right */}
      <path d="M24.5 20 L 30 15.8" />
      <path d="M24.5 20 L 30 24.2" />
      <path d="M30 15.8 Q 31.2 20 30 24.2" />

      {/* gill — single short curve */}
      <path d="M14.5 17.8 Q 15.4 20 14.5 22.2" strokeWidth={0.45} opacity="0.7" />

      {/* eye */}
      <circle cx="12.8" cy="19.4" r="0.55" fill="currentColor" stroke="none" />
    </svg>
  );
}
