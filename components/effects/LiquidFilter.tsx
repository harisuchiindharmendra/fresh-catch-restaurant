/**
 * Shared SVG filter container — referenced by other components via filter: url(#liquid)
 * Sits inert in the DOM; renders nothing visible itself.
 */
export default function LiquidFilter() {
  return (
    <svg
      aria-hidden
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0 }}
    >
      <defs>
        <filter id="liquid" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.014 0.022"
            numOctaves="2"
            seed="3"
            result="noise"
          >
            <animate
              attributeName="seed"
              from="0"
              to="200"
              dur="32s"
              repeatCount="indefinite"
            />
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" />
        </filter>

        <filter id="ocean-blur" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>
    </svg>
  );
}
