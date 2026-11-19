import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';
import { hero } from '@/lib/content';

export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          background: '#1e2024',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            right: -120,
            top: -120,
            width: 520,
            height: 520,
            borderRadius: 9999,
            background: '#16a34a',
            filter: 'blur(90px)',
            opacity: 0.55,
          }}
        />
        {/* Brand: SHAPE mark + wordmark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <div style={{ display: 'flex', position: 'relative', width: 56, height: 56 }}>
            <div style={{ position: 'absolute', left: 0, top: 0, width: 32, height: 34, borderRadius: 9, background: '#ffffff' }} />
            <div style={{ position: 'absolute', left: 20, top: 20, width: 32, height: 34, borderRadius: 9, background: '#16a34a' }} />
          </div>
          <div style={{ display: 'flex', fontSize: 40, letterSpacing: 4, color: '#ffffff' }}>{siteConfig.shortName}</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 44, color: '#e9ecf2' }}>{hero.kicker}</div>
          <div style={{ fontSize: 110, lineHeight: 1.05, letterSpacing: -2 }}>{hero.title}</div>
        </div>
        <div style={{ display: 'flex', fontSize: 26, color: '#16a34a' }}>{siteConfig.role} · React · Next.js</div>
      </div>
    ),
    size,
  );
}
