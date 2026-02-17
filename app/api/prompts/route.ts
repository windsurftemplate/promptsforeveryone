import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Firebase database URL
const FIREBASE_DB_URL = 'https://promptsforall-8068a-default-rtdb.firebaseio.com';
const ALLOWED_ORIGINS = [
  'https://promptsforeveryone.com',
  'https://www.promptsforeveryone.com',
  'http://localhost:3000'
];

function validateRequest(request: NextRequest) {
  if (request.method !== 'GET') {
    return NextResponse.json(
      { error: 'Method not allowed' },
      { status: 405 }
    );
  }

  if (process.env.NODE_ENV === 'production') {
    const origin = request.headers.get('origin');
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json(
        { error: 'Unauthorized origin' },
        { status: 403 }
      );
    }
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const validationError = validateRequest(request);
    if (validationError) {
      return validationError;
    }

    const url = new URL(request.url);
    const categoryId = url.searchParams.get('categoryId');
    const subcategoryId = url.searchParams.get('subcategoryId');
    const promptId = url.searchParams.get('promptId');

    const response = await axios.get(`${FIREBASE_DB_URL}/prompts.json`);

    if (!response.data) {
      return NextResponse.json({}, { status: 200 });
    }

    // If a specific prompt ID is requested
    if (promptId) {
      const prompt = response.data[promptId];
      if (!prompt) {
        return NextResponse.json({ error: 'Prompt not found' }, { status: 404 });
      }

      if (prompt.visibility && prompt.visibility !== 'public') {
        return NextResponse.json(
          { error: 'This prompt is private', visibility: prompt.visibility },
          { status: 403 }
        );
      }

      const voteCount = prompt.votes ? Object.keys(prompt.votes).length : 0;
      return NextResponse.json({
        [promptId]: {
          ...prompt,
          likes: voteCount,
          visibility: prompt.visibility || 'public'
        }
      });
    }

    // Only return public prompts — admin visibility requires server-side auth
    const prompts = Object.entries(response.data)
      .reduce((acc, [id, data]: [string, any]) => {
        const isPublic = !data.visibility || data.visibility === 'public';
        const categoryMatches = !categoryId || data.categoryId === categoryId;
        const subcategoryMatches = !subcategoryId || data.subcategoryId === subcategoryId;

        if (isPublic && categoryMatches && subcategoryMatches) {
          const voteCount = data.votes ? Object.keys(data.votes).length : 0;
          acc[id] = {
            ...data,
            likes: voteCount,
            visibility: data.visibility || 'public'
          };
        }
        return acc;
      }, {} as Record<string, any>);

    return NextResponse.json(prompts, {
      status: 200,
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
      },
    });
  } catch (error) {
    console.error('Prompts API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const runtime = 'edge';
export const dynamic = 'force-dynamic';
