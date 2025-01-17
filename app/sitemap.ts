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

interface Prompt {
  visibility: string;
  updatedAt?: string;
  createdAt: string;
  category: string;
  subcategory: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://promptsforeveryone.com'
  const currentDate = new Date().toISOString()

  // Start with static routes
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
  ]

  try {
    // Get all categories using our API endpoint
    const categoriesResponse = await axios.get(`${baseUrl}/api/categories`);
    const categories = categoriesResponse.data as Record<string, Category>;

    // Add category pages
    if (categories) {
      for (const [categoryId, category] of Object.entries(categories)) {
        // Add main category page
        routes.push({
          url: `${baseUrl}/categories/${categoryId}`,
          lastModified: currentDate,
          changeFrequency: 'daily',
          priority: 0.8,
        })

        // Add subcategory pages
        if (category.subcategories) {
          for (const [subcategoryId, subcategory] of Object.entries(category.subcategories)) {
            routes.push({
              url: `${baseUrl}/categories/${categoryId}/${subcategoryId}`,
              lastModified: currentDate,
              changeFrequency: 'daily',
              priority: 0.7,
            })
          }
        }
      }
    }

    // Get all prompts using our API endpoint
    const promptsResponse = await axios.get(`${baseUrl}/api/prompts`);
    const prompts = promptsResponse.data as Record<string, Prompt>;

    // Add prompt pages
    if (prompts) {
      for (const [promptId, prompt] of Object.entries(prompts)) {
        if (prompt.visibility === 'public') {
          routes.push({
            url: `${baseUrl}/categories/${prompt.category}/${prompt.subcategory}/prompts/${promptId}`,
            lastModified: prompt.updatedAt || prompt.createdAt || currentDate,
            changeFrequency: 'weekly',
            priority: 0.6,
          })
        }
      }
    }
  } catch (error) {
    console.error('Error fetching data for sitemap:', error);
    // Return static routes if API calls fail
    return routes;
  }

  return routes
} 