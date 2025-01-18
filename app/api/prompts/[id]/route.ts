import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Firebase database URL
const FIREBASE_DB_URL = 'https://promptsforall-8068a-default-rtdb.firebaseio.com';
const ALLOWED_ORIGINS = ['https://promptsforeveryone.com', 'https://www.promptsforeveryone.com'];

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
    if (!origin || !ALLOWED_ORIGINS.includes(origin)) {
      console.log('Unauthorized origin:', origin);
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      );
    }
  }

  return null;
}

/**
 * Route handler for individual prompt data
 */
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Validate request
    const validationError = validateRequest(request);
    if (validationError) {
      return validationError;
    }

    // Await the dynamic params
    const { id } = await context.params;

    // Fetch prompt from Firebase
    const response = await axios.get(`${FIREBASE_DB_URL}/prompts/${id}.json`);
    
    // Check if prompt exists and is public
    if (!response.data) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    if (response.data.visibility !== 'public') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    // Return successful response
    return NextResponse.json(response.data, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    // Log error for monitoring
    console.error('Prompt API error:', error);

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