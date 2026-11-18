import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = "Hang's Portfolio - 全栈开发 · AI应用 · 大健康";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          padding: '72px 80px',
          background: '#02030a',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-80px',
            right: '-40px',
            width: '520px',
            height: '520px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(101,216,255,0.22) 0%, rgba(101,216,255,0.06) 40%, transparent 70%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-120px',
            left: '80px',
            width: '480px',
            height: '480px',
            borderRadius: '50%',
            background:
              'radial-gradient(circle, rgba(101,216,255,0.12) 0%, transparent 65%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '48px',
            left: '80px',
            right: '80px',
            height: '1px',
            background:
              'linear-gradient(90deg, rgba(101,216,255,0.55), rgba(101,216,255,0.08), transparent)',
          }}
        />
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '28px',
            color: '#65d8ff',
            fontSize: 22,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: '#65d8ff',
              boxShadow: '0 0 16px rgba(101,216,255,0.8)',
            }}
          />
          COSMIC ASTROLABE
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
            maxWidth: '920px',
          }}
        >
          <div
            style={{
              fontSize: 72,
              fontWeight: 700,
              color: '#e8f2ff',
              letterSpacing: '-0.02em',
              lineHeight: 1.05,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {"Hang's Portfolio"}
          </div>
          <div
            style={{
              fontSize: 30,
              color: 'rgba(232,242,255,0.78)',
              lineHeight: 1.45,
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            全栈开发 · AI应用 · 大健康 — 探索项目宇宙
          </div>
        </div>
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            left: '80px',
            width: '180px',
            height: '3px',
            background: '#65d8ff',
            boxShadow: '0 0 18px rgba(101,216,255,0.55)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '48px',
            right: '80px',
            color: 'rgba(101,216,255,0.7)',
            fontSize: 18,
            letterSpacing: '0.18em',
            fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
          }}
        >
          hang-show.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
