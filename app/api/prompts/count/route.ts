import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Firebase database URL
const FIREBASE_DB_URL = 'https://promptsforall-8068a-default-rtdb.firebaseio.com';
const ALLOWED_ORIGIN = 'https://promptsforeveryone.com';

/**
 * Middleware to check request method and origin
 */
function validateRequest(request: NextRequest) {
  // Only allow GET requests
  if (request.method !== 'GET') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  // Check origin in production
  if (process.env.NODE_ENV === 'production') {
    const origin = request.headers.get('origin');
    if (origin !== ALLOWED_ORIGIN) {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      );
    }
  }

  return null;
}

/**
 * Route handler for getting total prompts count
 */
export async function GET(request: NextRequest) {
  try {
    // Validate request
    const validationError = validateRequest(request);
    if (validationError) {
      return validationError;
    }

    // Fetch prompts data from Firebase
    const response = await axios.get(`${FIREBASE_DB_URL}/prompts.json?shallow=true`);
    
    // Calculate total count
    const count = response.data ? Object.keys(response.data).length : 0;

    // Return successful response
    return NextResponse.json(
      { count },
      {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      }
    );
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

// Only allow GET requests
export const runtime = 'edge';
export const dynamic = 'force-dynamic'; 