import { db } from '@/lib/firebase';
import { ref, get, set } from 'firebase/database';

// Rate limit configurations
const RATE_LIMITS = {
  'Googlebot': { maxRequests: 1000, windowMs: 60 * 1000 }, // 1000 requests per minute
  'Bingbot': { maxRequests: 1000, windowMs: 60 * 1000 }, // 1000 requests per minute
  'DuckDuckBot': { maxRequests: 1000, windowMs: 60 * 1000 }, // 1000 requests per minute
  'default': { maxRequests: 1000, windowMs: 15 * 60 * 1000 } // 1000 requests per 15 minutes
} as const;

type CrawlerType = keyof typeof RATE_LIMITS;

interface RateLimitEntry {
  timestamp: number;
  count: number;
}

// Function to identify crawler from user agent
function identifyCrawler(userAgent: string | null): CrawlerType {
  if (!userAgent) return 'default';
  
  const ua = userAgent.toLowerCase();
  if (ua.includes('googlebot')) return 'Googlebot';
  if (ua.includes('bingbot')) return 'Bingbot';
  if (ua.includes('duckduckbot')) return 'DuckDuckBot';
  return 'default';
}

export async function rateLimitMiddleware(req: Request, maxRequestsOverride?: number) {
  try {
    // Get IP and User Agent
    const forwardedFor = req.headers.get('x-forwarded-for');
    const cfConnectingIp = req.headers.get('cf-connecting-ip');
    const clientIp = cfConnectingIp || forwardedFor?.split(',')[0].trim() || 'unknown';
    const userAgent = req.headers.get('user-agent');
    
    // Identify crawler and get config
    const crawlerType = identifyCrawler(userAgent);
    const config = RATE_LIMITS[crawlerType];
    
    // Use provided maxRequests or crawler config
    const maxRequests = maxRequestsOverride || config.maxRequests;
    const windowMs = config.windowMs;
    const now = Date.now();

    // Create a safe key for Firebase (replace invalid characters)
    const safeIp = clientIp.replace(/[.#$/\[\]]/g, '_');
    const storeKey = `ratelimits/${crawlerType}/${safeIp}`;
    
    // Get current entries from Firebase
    const rateRef = ref(db, storeKey);
    const snapshot = await get(rateRef);
    const entries: RateLimitEntry[] = snapshot.val() || [];

    // Filter out old entries
    const validEntries = entries.filter(entry => now - entry.timestamp < windowMs);

    // Check if rate limit is exceeded
    if (validEntries.length >= maxRequests) {
      const oldestTime = Math.min(...validEntries.map(entry => entry.timestamp));
      const resetTime = new Date(oldestTime + windowMs);

      return {
        error: 'Too many requests',
        headers: {
          'Retry-After': Math.ceil((resetTime.getTime() - now) / 1000).toString(),
          'X-RateLimit-Limit': maxRequests.toString(),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset': Math.ceil(resetTime.getTime() / 1000).toString(),
          'X-Crawler-Type': crawlerType
        }
      };
    }

    // Add new entry
    validEntries.push({
      timestamp: now,
      count: validEntries.length + 1
    });

    // Update Firebase
    await set(rateRef, validEntries);

    // Calculate remaining requests
    const remaining = maxRequests - validEntries.length;

    // Return rate limit headers
    return {
      error: null,
      headers: {
        'X-RateLimit-Limit': maxRequests.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': Math.ceil((now + windowMs) / 1000).toString(),
        'X-Crawler-Type': crawlerType
      }
    };
  } catch (error) {
    console.error('Rate limit error:', error);
    // On error, allow the request but don't track it
    return {
      error: null,
      headers: {}
    };
  }
} 