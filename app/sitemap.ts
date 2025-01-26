import { MetadataRoute } from 'next';
import axios from 'axios';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, get } from 'firebase/database';

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

interface BlogPost {
  slug: string;
  date: string;
}

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const db = getDatabase(app);

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
    // 2. Fetch blog posts from Firebase
    const blogRef = ref(db, 'blog');
    const blogSnapshot = await get(blogRef);
    
    if (blogSnapshot.exists()) {
      const blogData = blogSnapshot.val();
      const blogPosts = Object.values(blogData) as BlogPost[];
      
      // Add each blog post to the sitemap
      blogPosts.forEach((post) => {
        if (post.slug) {
          routes.push({
            url: `${baseUrl}/blog/${post.slug}`,
            lastModified: post.date || currentDate,
            changeFrequency: 'monthly',
            priority: 0.6,
          });
        }
      });
    }

    // 3. Fetch the list of categories from your API
    const categoriesResponse = await axios.get(`${baseUrl}/api/categories`);
    const categories = categoriesResponse.data as Record<string, Category>;

    // 4. Use a Set to avoid adding duplicate URLs
    const uniqueUrls = new Set<string>();

    // 5. Loop through all categories
    if (categories) {
      for (const [categoryId, categoryData] of Object.entries(categories)) {
        // Category page: /categories/{categoryId}
        const encodedCategoryId = encodeURIComponent(categoryId);
        const categoryUrl = `${baseUrl}/categories/${encodedCategoryId}`;
        if (!uniqueUrls.has(categoryUrl)) {
          uniqueUrls.add(categoryUrl);
          routes.push({
            url: categoryUrl,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.8,
          });
        }

        // 6. Add subcategory pages with normalized names
        if (categoryData.subcategories) {
          for (const [_, subcategory] of Object.entries(categoryData.subcategories)) {
            // Skip if no name is provided
            if (!subcategory.name) continue;

            // First normalize spaces and case
            const normalizedName = subcategory.name
              .toLowerCase()
              .replace(/\s+/g, '-');
            
            // Then encode the name, which will preserve special characters like & as %26
            const encodedSubcategoryName = encodeURIComponent(normalizedName);
            
            // Subcategory page: /categories/{categoryId}/{normalized-subcategory-name}
            const subcategoryUrl = `${baseUrl}/categories/${encodedCategoryId}/${encodedSubcategoryName}`;
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
    console.error('Error generating sitemap:', error);
  }

  // 7. Return the final list of routes
  return routes;
}