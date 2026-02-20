import { NextRequest, NextResponse } from 'next/server';
import { ImageResponse } from '@vercel/og';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get('title');
    const description = searchParams.get('description');
    const category = searchParams.get('category');

    // Dynamic prompt card if params provided
    if (title) {
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
              backgroundColor: '#0A0A0F',
              padding: '60px',
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.15), transparent 50%)',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
              {category && (
                <div
                  style={{
                    fontSize: 24,
                    color: '#A78BFA',
                    marginBottom: '20px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    fontWeight: 600,
                  }}
                >
                  {category}
                </div>
              )}
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 'bold',
                  color: '#FFFFFF',
                  marginBottom: '24px',
                  lineHeight: 1.2,
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {title}
              </div>
              {description && (
                <div
                  style={{
                    fontSize: 28,
                    color: 'rgba(255, 255, 255, 0.6)',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {description.slice(0, 200)}
                </div>
              )}
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                marginTop: '40px',
              }}
            >
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 'bold',
                  color: '#8B5CF6',
                }}
              >
                Prompts For Everyone
              </div>
              <div
                style={{
                  fontSize: 24,
                  color: 'rgba(255, 255, 255, 0.4)',
                }}
              >
                promptsforeveryone.com
              </div>
            </div>
          </div>
        ),
        {
          width: 1200,
          height: 630,
        }
      );
    }

    // Default branded card
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
                color: '#8B5CF6',
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