import { MetadataRoute } from 'next';

type ChangeFrequency = 'daily' | 'weekly' | 'always' | 'hourly' | 'monthly' | 'yearly' | 'never';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://promptsforeveryone.com';

  // Core pages with high priority
  const coreRoutes = [
    { route: '', priority: 1.0 },
    { route: '/dashboard', priority: 0.9 },
    { route: '/explore', priority: 0.9 },
    { route: '/submit', priority: 0.9 },
  ];

  // Main content pages
  const contentRoutes = [
    { route: '/blog', priority: 0.8 },
    { route: '/docs', priority: 0.8 },
    { route: '/guides', priority: 0.8 },
    { route: '/about', priority: 0.8 },
  ];

  // User-related pages
  const userRoutes = [
    { route: '/profile', priority: 0.7 },
    { route: '/favorites', priority: 0.7 },
    { route: '/chat', priority: 0.7 },
  ];

  // Support and info pages
  const supportRoutes = [
    { route: '/contact', priority: 0.6 },
    { route: '/price', priority: 0.6 },
    { route: '/careers', priority: 0.6 },
  ];

  // Legal and auxiliary pages
  const legalRoutes = [
    { route: '/terms', priority: 0.5 },
    { route: '/privacy', priority: 0.5 },
  ];

  // Combine all routes
  const allRoutes = [
    ...coreRoutes,
    ...contentRoutes,
    ...userRoutes,
    ...supportRoutes,
    ...legalRoutes,
  ].map((route) => ({
    url: `${baseUrl}${route.route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: (route.priority === 1.0 ? 'daily' : 'weekly') as ChangeFrequency,
    priority: route.priority,
  }));

  return allRoutes;
} 