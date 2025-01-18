import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function validatePublicEndpoint(request: NextRequest) {
  try {
    // 1. Validate request method
    const allowedMethods = ['GET', 'POST', 'OPTIONS'];
    if (!allowedMethods.includes(request.method)) {
      return NextResponse.json(
        { error: 'Method not allowed' },
        { status: 405 }
      );
    }

    // 2. Validate Content-Type for POST requests
    if (request.method === 'POST') {
      const contentType = request.headers.get('content-type');
      if (!contentType?.includes('application/json') && 
          !contentType?.includes('multipart/form-data')) {
        return NextResponse.json(
          { error: 'Unsupported Media Type' },
          { status: 415 }
        );
      }
    }

    // 3. Validate request size (10MB limit)
    const contentLength = parseInt(request.headers.get('content-length') || '0');
    if (contentLength > 10 * 1024 * 1024) { // 10MB
      return NextResponse.json(
        { error: 'Request entity too large' },
        { status: 413 }
      );
    }

    return null;
  } catch (error) {
    console.error('Public endpoint validation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 