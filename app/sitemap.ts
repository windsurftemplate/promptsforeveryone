import { MetadataRoute } from 'next';
import axios from 'axios';

interface Category {
  name: string;
  description?: string;
  subcategories?: {
    [key: string]: {
      name: string;
      description?: string;
    };
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.promptsforeveryone.com';
  const currentDate = new Date().toISOString();

  // 1. Define all your static pages
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/popular`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/submit`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/docs`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  try {
    // 2. Fetch the list of categories from your API
    const categoriesResponse = await axios.get(`${baseUrl}/api/categories`);
    const categories = categoriesResponse.data as Record<string, Category>;

    // 3. Use a Set to avoid adding duplicate URLs
    const uniqueUrls = new Set<string>();

    // 4. Loop through all categories
    if (categories) {
      for (const [categoryId, categoryData] of Object.entries(categories)) {
        // Category page: /categories/{categoryId}
        const categoryUrl = `${baseUrl}/categories/${categoryId}`;
        if (!uniqueUrls.has(categoryUrl)) {
          uniqueUrls.add(categoryUrl);
          routes.push({
            url: categoryUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.8,
          });
        }

        // 5. Add valid subcategory pages, if any
        if (categoryData.subcategories) {
          for (const [subcategoryId] of Object.entries(categoryData.subcategories)) {
            // Skip placeholder or prompt-like IDs
            if (subcategoryId === '-' || subcategoryId.startsWith('-OG')) {
              continue;
            }

            // Subcategory page: /categories/{categoryId}/{subcategoryId}
            const subcategoryUrl = `${baseUrl}/categories/${categoryId}/${subcategoryId}`;
            if (!uniqueUrls.has(subcategoryUrl)) {
              uniqueUrls.add(subcategoryUrl);
              routes.push({
                url: subcategoryUrl,
                lastModified: currentDate,
                changeFrequency: 'daily',
                priority: 0.7,
              });
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }

  // 6. Return the final list of routes
  return routes;
}