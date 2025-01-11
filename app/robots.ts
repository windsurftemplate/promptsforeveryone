import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: ['/'],
      disallow: [
        '/api/',
        '/dashboard/',
        '/admin/',
        '/private/',      ],
    },
    sitemap: 'https://promptsforeveryone.com/sitemap.xml',
  }
} 