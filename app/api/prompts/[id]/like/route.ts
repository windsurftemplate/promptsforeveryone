import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { ref, get, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { rateLimitMiddleware } from '@/middleware/rateLimit';

const ALLOWED_ORIGIN = 'https://promptsforeveryone.com';

/**
 * Middleware to validate request
 */
async function validateRequest(req: NextRequest): Promise<{ error: string; status: number; headers?: Record<string, string> } | null> {
  // Check rate limit first (20 likes per 15 minutes)
  const rateLimitResult = await rateLimitMiddleware(req, 20);
  if (rateLimitResult.error) {
    return {
      error: rateLimitResult.error,
      status: 429,
      headers: rateLimitResult.headers,
    };
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return {
      error: 'Method not allowed',
      status: 405,
    };
  }

  // Check origin in production
  if (process.env.NODE_ENV === 'production') {
    const origin = req.headers.get('origin');
    if (origin !== ALLOWED_ORIGIN) {
      return {
        error: 'Unauthorized origin',
        status: 403,
      };
    }
  }

  // Verify Firebase auth token
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return {
      error: 'Missing or invalid authorization header',
      status: 401,
    };
  }

  try {
    const token = authHeader.split('Bearer ')[1];
    await getAuth().currentUser?.getIdToken(true);
  } catch (error) {
    return {
      error: 'Invalid authentication token',
      status: 401,
    };
  }

  return null;
}

/**
 * Route handler for liking/unliking a prompt
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  try {
    // Validate request
    const errorResponse = await validateRequest(request);
    if (errorResponse) {
      const { status, error, headers = {} } = errorResponse;
      return NextResponse.json({ error }, { status, headers });
    }

    const { id } = await params;
    const authHeader = request.headers.get('authorization');
    const token = authHeader!.split('Bearer ')[1];
    const user = getAuth().currentUser;
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not authenticated' },
        { status: 401 }
      );
    }

    const userId = user.uid;

    // Get current prompt data
    const promptRef = ref(db, `prompts/${id}`);
    const promptSnapshot = await get(promptRef);
    
    if (!promptSnapshot.exists()) {
      return NextResponse.json(
        { error: 'Prompt not found' },
        { status: 404 }
      );
    }

    const promptData = promptSnapshot.val();

    // Check if prompt is public
    if (promptData.visibility !== 'public') {
      return NextResponse.json(
        { error: 'Cannot like private prompts' },
        { status: 403 }
      );
    }

    // Get current votes
    const votes = promptData.votes || {};
    const isCurrentlyLiked = votes[userId];

    if (isCurrentlyLiked) {
      // Unlike: Remove user's vote
      delete votes[userId];
    } else {
      // Like: Add user's vote
      votes[userId] = true;
    }

    // Update votes in Firebase
    await update(promptRef, { votes });

    // Return updated like count and status
    return NextResponse.json({
      likes: Object.keys(votes).length,
      isLiked: !isCurrentlyLiked
    });

  } catch (error) {
    console.error('Like API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';