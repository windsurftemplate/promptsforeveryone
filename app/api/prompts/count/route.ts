import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Firebase database URL
const FIREBASE_DB_URL = 'https://promptsforall-8068a-default-rtdb.firebaseio.com';

/**
 * Route handler for getting total public prompts count
 */
export async function GET(request: NextRequest) {
  try {
    // Fetch prompts from Firebase
    const response = await axios.get(`${FIREBASE_DB_URL}/prompts.json`);

    if (!response.data) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    // Count only public prompts
    const count = Object.values(response.data).filter((prompt: any) => 
      prompt.visibility === 'public'
    ).length;

    // Return successful response with CORS headers
    return new NextResponse(JSON.stringify({ count }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    // Log error for monitoring
    console.error('Prompts count API error:', error);

    // Return error response
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Handle OPTIONS requests for CORS
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

// Only allow GET requests
export const runtime = 'edge';
export const dynamic = 'force-dynamic'; 