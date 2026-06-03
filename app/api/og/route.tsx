import { ImageResponse } from 'next/og';

// Next 16 cacheComponents disallows the `runtime = 'edge'` segment config.
// next/og works in the default Node runtime; Vercel still serves it from the
// edge network. https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config

// Palette mirrors styles/globals.css. Inlined here because next/og runs in an
// isolated runtime that can't read our CSS variables.
const PALETTE = {
  ink: '#181b20',
  paper: '#f4f6f8',
  signal: '#2796df',
  neutral400: '#8d949d',
  neutral300: '#b2b8bf',
} as const;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const title = searchParams.get('title') ?? 'Auraplex';
  const subtitle = searchParams.get('subtitle') ?? 'Engineered in Malaysia.';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: PALETTE.ink,
          color: PALETTE.paper,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: 80,
          fontFamily: 'serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 12, height: 12, background: PALETTE.signal }} />
          <div style={{ fontSize: 24, letterSpacing: 4, textTransform: 'uppercase', color: PALETTE.neutral300 }}>
            AURAPLEX
          </div>
        </div>
        <div>
          <div style={{ fontSize: 84, lineHeight: 1.05, letterSpacing: -2, maxWidth: 1000 }}>{title}</div>
          <div style={{ fontSize: 28, color: PALETTE.neutral300, marginTop: 24, maxWidth: 900 }}>{subtitle}</div>
        </div>
        <div style={{ fontSize: 20, color: PALETTE.neutral400, letterSpacing: 2, textTransform: 'uppercase' }}>
          Made in Malaysia · auraplex.my
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
