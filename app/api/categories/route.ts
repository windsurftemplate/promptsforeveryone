import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Firebase database URL
const FIREBASE_DB_URL = 'https://promptsforall-8068a-default-rtdb.firebaseio.com';

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

    // Fetch all categories and prompts in parallel
    const [categoriesResponse, promptsResponse] = await Promise.all([
      axios.get(`${FIREBASE_DB_URL}/categories.json`),
      axios.get(`${FIREBASE_DB_URL}/prompts.json`)
    ]);

    if (!categoriesResponse.data) {
      return NextResponse.json(
        { error: 'Categories not found' },
        { status: 404 }
      );
    }

    // Get category ID from URL if present
    const url = new URL(request.url);
    const categoryId = url.searchParams.get('id');
    const subcategoryId = url.searchParams.get('subId');

    // Calculate prompt counts for each category
    const prompts = promptsResponse.data || {};
    const promptCounts = Object.values(prompts)
      .filter((prompt: any) => prompt.visibility === 'public')
      .reduce((acc: Record<string, number>, prompt: any) => {
        if (prompt.categoryId) {
          acc[prompt.categoryId] = (acc[prompt.categoryId] || 0) + 1;
        }
        return acc;
      }, {});

    let responseData;
    if (!categoryId) {
      // Add prompt counts to each category
      responseData = Object.entries(categoriesResponse.data).reduce((acc, [id, category]: [string, any]) => {
        acc[id] = {
          ...category,
          promptCount: promptCounts[id] || 0
        };
        return acc;
      }, {} as Record<string, any>);
    } else {
      // Get specific category
      const category = categoriesResponse.data[categoryId];
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
          promptCount: promptCounts[categoryId] || 0,
          subcategories: { [subcategoryId]: subcategory }
        };
      } else {
        responseData = {
          ...category,
          promptCount: promptCounts[categoryId] || 0
        };
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