import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Add CSP headers
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self';
     script-src 'self' 'unsafe-eval' https://*.firebaseio.com https://*.firebase.com;
     connect-src 'self' wss://*.firebaseio.com https://*.firebase.com;
     frame-src 'self' https://*.firebaseapp.com;
     img-src 'self' data: https:;
     style-src 'self' 'unsafe-inline';
     font-src 'self';`
  );

  return response;
}

export const config = {
  matcher: '/:path*',
}; 