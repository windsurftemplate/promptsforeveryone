import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Firebase database URL
const FIREBASE_DB_URL = 'https://promptsforall-8068a-default-rtdb.firebaseio.com';
const ALLOWED_ORIGINS = ['https://promptsforeveryone.com', 'https://www.promptsforeveryone.com'];

/**
 * Route handler for categories data
 */
export async function GET(request: NextRequest) {
  try {
    // Only allow GET requests
    if (request.method !== 'GET') {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
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

    let responseData;
    if (!categoryId) {
      responseData = response.data;
    } else {
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
        responseData = {
          ...category,
          subcategories: { [subcategoryId]: subcategory }
        };
      } else {
        responseData = category;
      }
    }

    // Return successful response with CORS headers
    return new NextResponse(JSON.stringify(responseData), {
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
    console.error('Categories API error:', error);

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