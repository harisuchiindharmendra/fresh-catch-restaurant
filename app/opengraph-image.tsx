import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Fresh Catch — Cinematic Seafood Dining';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background:
            'radial-gradient(60% 50% at 30% 30%, rgba(200,168,106,0.22), transparent 60%), radial-gradient(70% 60% at 80% 80%, rgba(35,84,138,0.32), transparent 65%), #040912',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 88px',
          color: '#f5efe6',
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div
            style={{
              width: 48,
              height: 1.5,
              background: '#c8a86a',
            }}
          />
          <div
            style={{
              fontSize: 16,
              letterSpacing: 8,
              textTransform: 'uppercase',
              color: '#c8a86a',
            }}
          >
            Fresh Catch · Est. 2014
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              fontWeight: 300,
              letterSpacing: -1,
              maxWidth: 1000,
            }}
          >
            Fresh From The Ocean.
          </div>
          <div
            style={{
              fontSize: 96,
              lineHeight: 1.02,
              fontWeight: 300,
              fontStyle: 'italic',
              color: 'rgba(200,168,106,0.95)',
              letterSpacing: -1,
              maxWidth: 1000,
            }}
          >
            Crafted Into Art.
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 18,
            color: 'rgba(245,239,230,0.6)',
            letterSpacing: 4,
            textTransform: 'uppercase',
          }}
        >
          <div>Cinematic Seafood Dining</div>
          <div>Tuesday — Sunday · 18:00</div>
        </div>
      </div>
    ),
    { ...size }
  );
}
