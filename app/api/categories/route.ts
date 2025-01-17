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
      // Allow same-origin requests (no origin header)
      if (!origin && request.url.startsWith('https://promptsforeveryone.com')) {
        return null;
      }
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      );
    }
  }

  return null;
}

/**
 * Route handler for categories data
 */
export async function GET(request: NextRequest) {
  try {
    // Validate request
    const validationError = validateRequest(request);
    if (validationError) {
      return validationError;
    }

    // Fetch all categories first
    const response = await axios.get(`${FIREBASE_DB_URL}/categories.json`);

    if (!response.data) {
      return NextResponse.json(
        { error: 'Categories not found' },
        { status: 404 }
      );
    }

    // If no category ID is provided, return all categories
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('id');
    const subcategoryId = url.searchParams.get('subId');

    if (!categoryId) {
      return NextResponse.json(response.data, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      });
    }

    // Get specific category
    const category = response.data[categoryId];
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // If subcategory ID is provided, return only that subcategory
    if (subcategoryId) {
      const subcategory = category.subcategories?.[subcategoryId];
      if (!subcategory) {
        return NextResponse.json(
          { error: 'Subcategory not found' },
          { status: 404 }
        );
      }
      return NextResponse.json({
        ...category,
        subcategories: { [subcategoryId]: subcategory }
      }, {
        status: 200,
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      });
    }

    // Return the category with all its subcategories
    return NextResponse.json(category, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    // Log error for monitoring
    console.error('Categories API error:', error);

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