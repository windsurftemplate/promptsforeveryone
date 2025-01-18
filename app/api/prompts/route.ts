import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Firebase database URL
const FIREBASE_DB_URL = 'https://promptsforall-8068a-default-rtdb.firebaseio.com';
const ALLOWED_ORIGINS = [
  'https://promptsforeveryone.com',
  'https://www.promptsforeveryone.com',
  'http://localhost:3000'
];

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
    console.log('Request origin:', origin);
    
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      console.error('Unauthorized origin:', origin);
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

    console.log('Fetching prompts for:', { 
      categoryId, 
      subcategoryId 
    });

    // Fetch prompts from Firebase
    console.log('Fetching from Firebase URL:', `${FIREBASE_DB_URL}/prompts.json`);
    const response = await axios.get(`${FIREBASE_DB_URL}/prompts.json`);

    if (!response.data) {
      console.log('No prompts found in database');
      return NextResponse.json({}, { status: 200 });
    }

    // Log the first few prompts from Firebase to see their structure
    const samplePrompts = Object.entries(response.data).slice(0, 3);
    console.log('Sample prompts from Firebase:', 
      samplePrompts.map(([id, data]: [string, any]) => ({
        id,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        visibility: data.visibility,
        title: data.title
      }))
    );

    console.log('Firebase response:', {
      status: response.status,
      hasData: !!response.data,
      promptCount: Object.keys(response.data).length,
      categories: Array.from(new Set(Object.values(response.data).map((p: any) => p.categoryId))),
      subcategories: Array.from(new Set(Object.values(response.data).map((p: any) => p.subcategoryId)))
    });

    // Log what we're looking for
    const matchingPrompts = Object.entries(response.data)
      .filter(([_, data]: [string, any]) => 
        data.categoryId === categoryId && 
        data.subcategoryId === subcategoryId &&
        data.visibility === 'public'
      );

    console.log('Looking for prompts with:', {
      categoryId,
      subcategoryId,
      totalPrompts: Object.keys(response.data).length,
      publicPrompts: Object.values(response.data).filter((p: any) => p.visibility === 'public').length,
      categoryMatches: Object.values(response.data).filter((p: any) => p.categoryId === categoryId).length,
      subcategoryMatches: Object.values(response.data).filter((p: any) => p.subcategoryId === subcategoryId).length,
      fullMatches: matchingPrompts.length,
      matchingPrompts: matchingPrompts.map(([id, data]: [string, any]) => ({
        id,
        title: data.title,
        categoryId: data.categoryId,
        subcategoryId: data.subcategoryId,
        visibility: data.visibility
      }))
    });

    // Filter prompts
    const prompts = Object.entries(response.data)
      .reduce((acc, [id, data]: [string, any]) => {
        console.log('Processing prompt:', { 
          id, 
          visibility: data.visibility, 
          categoryId: data.categoryId, 
          subcategoryId: data.subcategoryId,
          matches: {
            isPublic: data.visibility === 'public',
            categoryMatches: !categoryId || data.categoryId === categoryId,
            subcategoryMatches: !subcategoryId || data.subcategoryId === subcategoryId
          }
        });
        
        // Only include public prompts
        if (data.visibility === 'public') {
          // Only filter by category and subcategory if they are provided
          if (categoryId && subcategoryId) {
            if (data.categoryId !== categoryId) {
              console.log('Skipping - category mismatch:', { expected: categoryId, got: data.categoryId });
              return acc;
            }
            if (data.subcategoryId !== subcategoryId) {
              console.log('Skipping - subcategory mismatch:', { 
                expected: subcategoryId, 
                got: data.subcategoryId,
                prompt: {
                  id,
                  title: data.title,
                  categoryId: data.categoryId
                }
              });
              return acc;
            }
          }

          console.log('Including prompt:', {
            id,
            title: data.title,
            categoryId: data.categoryId,
            subcategoryId: data.subcategoryId,
            reason: categoryId && subcategoryId ? 'matches category and subcategory' : 'public prompt'
          });

          // Calculate vote count from votes object
          const voteCount = data.votes ? Object.keys(data.votes).length : 0;
          
          acc[id] = {
            ...data,
            likes: voteCount // Update likes field with actual vote count
          };
        }
        return acc;
      }, {} as Record<string, any>);

    console.log('Final prompts:', {
      count: Object.keys(prompts).length,
      prompts: Object.keys(prompts).map(id => ({
        id,
        categoryId: prompts[id].categoryId,
        subcategoryId: prompts[id].subcategoryId
      }))
    });

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