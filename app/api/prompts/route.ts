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
 * Route handler for prompts data
 */
export async function GET(request: NextRequest) {
  try {
    // Validate request
    const validationError = validateRequest(request);
    if (validationError) {
      return validationError;
    }

    // Get category ID from URL if present
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    const subcategoryId = url.searchParams.get('subcategoryId');

    // Fetch prompts from Firebase
    const response = await axios.get(`${FIREBASE_DB_URL}/prompts.json`);

    if (!response.data) {
      return NextResponse.json({}, { status: 200 });
    }

    // Filter prompts
    const prompts = Object.entries(response.data)
      .reduce((acc, [id, data]: [string, any]) => {
        // Only include public prompts
        if (data.visibility === 'public') {
          // Filter by category and subcategory if provided
          if (categoryId && data.categoryId !== categoryId) {
            return acc;
          }
          if (subcategoryId && data.subcategoryId !== subcategoryId) {
            return acc;
          }

          // Calculate vote count from votes object
          const voteCount = data.votes ? Object.keys(data.votes).length : 0;
          
          acc[id] = {
            ...data,
            likes: voteCount // Update likes field with actual vote count
          };
        }
        return acc;
      }, {} as Record<string, any>);

    // Return successful response
    return NextResponse.json(prompts, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    // Log error for monitoring
    console.error('Prompts API error:', error);

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