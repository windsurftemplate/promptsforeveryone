import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: [
        '/',
        '/blog',
        '/about',
        '/contact',
        '/explore',
        '/api/categories',
        '/api/prompts',
        '/api/prompts/count',
        '/api/og'
      ],
      disallow: [
        '/admin/',
        '/dashboard/',
        '/api/auth/',
        '/api/upload/',
        '/api/webhook/',
        '/api/stripe/',
        '/api/chat/',
        '/api/firebase-proxy/'
      ],
    },
    sitemap: 'https://promptsforeveryone.com/sitemap.xml',
  }
} 