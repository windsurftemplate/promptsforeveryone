import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { validatePrivateEndpoint } from './middleware/privateEndpoint';
import { validatePublicEndpoint } from './middleware/publicEndpoint';
import { rateLimitMiddleware } from './middleware/rateLimit';

// List of private endpoints that require authentication
const PRIVATE_ENDPOINTS = [
  '/api/upload',
  '/api/chat',
  '/api/webhook',
  '/api/stripe',
  '/api/firebase-proxy',
  '/api/auth',
  '/api/admin'
];

// List of public endpoints
const PUBLIC_ENDPOINTS = [
  '/api/categories',
  '/api/prompts',
  '/api/og',
  '/api/contact',
  '/api/careers'
];

// List of endpoints that need rate limiting
const RATE_LIMITED_ENDPOINTS = [
  '/api/chat',
  '/api/upload',
  '/api/contact',
  '/api/careers'
];

export async function middleware(request: NextRequest) {
  // Create response
  const response = NextResponse.next();

  // Add security headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Add Content Security Policy
  response.headers.set('Content-Security-Policy', 
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
    "style-src 'self' 'unsafe-inline'; " +
    "img-src 'self' data: https:; " +
    "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com; " +
    "frame-ancestors 'none';"
  );

  const url = request.nextUrl.pathname;

  // Check if endpoint requires authentication
  if (PRIVATE_ENDPOINTS.some(endpoint => url.startsWith(endpoint))) {
    const authResult = await validatePrivateEndpoint(request);
    if (authResult instanceof NextResponse) {
      return authResult;
    }
  }

  // Validate public endpoints
  if (PUBLIC_ENDPOINTS.some(endpoint => url.startsWith(endpoint))) {
    const publicResult = await validatePublicEndpoint(request);
    if (publicResult instanceof NextResponse) {
      return publicResult;
    }
  }

  // Apply rate limiting to specific endpoints
  if (RATE_LIMITED_ENDPOINTS.some(endpoint => url.startsWith(endpoint))) {
    const rateLimitResult = await rateLimitMiddleware(request);
    if (rateLimitResult) {
      return rateLimitResult;
    }
  }

  // Add Cache-Control headers for public endpoints
  if (url.startsWith('/api/categories') || url.startsWith('/api/prompts')) {
    response.headers.set('Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
  }

  return response;
}

// Update matcher to include API routes
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
    '/api/:path*'
  ],
};