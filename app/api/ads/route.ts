import { NextResponse } from 'next/server';
import { ads } from '@/config/ads';

export async function GET() {
  return NextResponse.json(ads, {
    status: 200,
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}

// Handle OPTIONS for CORS
export async function OPTIONS() {
  return NextResponse.json({}, {
    status: 200,
    headers: {
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 