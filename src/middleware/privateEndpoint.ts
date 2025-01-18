import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/firebase-admin';

export async function validatePrivateEndpoint(request: NextRequest) {
  try {
    // 1. Check Authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Verify JWT token
    const token = authHeader.split('Bearer ')[1];
    try {
      const decodedToken = await auth.verifyIdToken(token);
      return { uid: decodedToken.uid, role: decodedToken.role };
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }

  } catch (error) {
    console.error('Authorization error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 