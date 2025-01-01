import { NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';

export async function GET() {
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0f172a',
            padding: '40px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid rgba(0, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '40px',
              background: 'rgba(0, 0, 0, 0.8)',
              width: '100%',
              height: '100%',
            }}
          >
            <div
              style={{
                fontSize: 60,
                fontWeight: 'bold',
                color: '#00ffff',
                marginBottom: '20px',
                textAlign: 'center',
                width: '100%',
              }}
            >
              Prompts For Everyone
            </div>
            <div
              style={{
                fontSize: 30,
                color: 'rgba(255, 255, 255, 0.6)',
                textAlign: 'center',
                marginTop: '10px',
                width: '100%',
              }}
            >
              Your AI Prompt Management Platform
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e) {
    console.error(e);
    return new NextResponse('Failed to generate image', { status: 500 });
  }
} 