import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://promptsforeveryone.com';

  // Define your static routes
  const routes = [
    '',
    '/explore',
    '/dashboard',
    '/submit',
    '/about',
    '/blog',
    '/careers',
    '/category',
    '/chat',
    '/deployment-guide',
    '/discord',
    '/docs',
    '/favorites',
    '/features',
    '/guides',
    '/jobs',
    '/price',
    '/privacy',
    '/profile',
    '/prompt',
    '/terms',
    '/test',
    '/tutorial',
    '/login',
    '/register'
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  return routes;
} 