import { ImageResponse } from 'next/og';
import { OWNER_PROFILE } from '@/lib/constants';

export const runtime = 'edge';

export const alt = 'Manoj K.C. | Python and Django Backend Developer';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#0A0A0B',
          padding: '80px',
          fontFamily: 'sans-serif',
          border: '12px solid #1F1F23',
        }}
      >
        {/* Top badge & domain */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#111113',
              border: '1px solid #1F1F23',
              borderRadius: '9999px',
              padding: '10px 24px',
              color: '#3FB950',
              fontSize: 22,
              fontWeight: 600,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: '#3FB950',
                marginRight: 12,
              }}
            />
            {OWNER_PROFILE.subHeadline}
          </div>
          <div
            style={{
              color: '#8A8F98',
              fontSize: 24,
              letterSpacing: '0.05em',
            }}
          >
            manojkc1.com.np
          </div>
        </div>

        {/* Center content */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: '#EDEDEF',
              letterSpacing: '-0.03em',
              lineHeight: 1.1,
            }}
          >
            {OWNER_PROFILE.name}
          </div>
          <div
            style={{
              fontSize: 34,
              fontWeight: 600,
              color: '#7C5CFF',
              letterSpacing: '-0.01em',
            }}
          >
            {OWNER_PROFILE.title}
          </div>
          <div
            style={{
              fontSize: 22,
              color: '#8A8F98',
              maxWidth: '900px',
              lineHeight: 1.4,
              marginTop: '8px',
            }}
          >
            Kathmandu, Nepal • Django REST Framework • PostgreSQL • Scalable Architecture
          </div>
        </div>

        {/* Bottom tags */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            width: '100%',
          }}
        >
          {['Python', 'Django', 'DRF', 'PostgreSQL', 'JWT Auth', 'REST APIs'].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  backgroundColor: '#111113',
                  border: '1px solid #1F1F23',
                  borderRadius: '8px',
                  padding: '8px 18px',
                  color: '#EDEDEF',
                  fontSize: 20,
                  fontWeight: 500,
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
