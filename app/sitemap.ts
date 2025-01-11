import { MetadataRoute } from 'next';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
}

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
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig)
  const db = getDatabase(app)

  // Get all categories
  const categoriesRef = ref(db, 'categories')
  const categoriesSnapshot = await get(categoriesRef)
  const categories = categoriesSnapshot.val() as Record<string, Category>

  // Get all public prompts
  const promptsRef = ref(db, 'prompts')
  const promptsSnapshot = await get(promptsRef)
  const prompts = promptsSnapshot.val() as Record<string, Prompt>

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
      url: `${baseUrl}/explore`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
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
  ]

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
          const subcategorySlug = subcategory.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')
          routes.push({
            url: `${baseUrl}/categories/${categoryId}/${subcategorySlug}`,
            lastModified: currentDate,
            changeFrequency: 'daily',
            priority: 0.7,
          })
        }
      }
    }
  }

  // Add prompt pages
  if (prompts) {
    for (const [promptId, prompt] of Object.entries(prompts)) {
      if (prompt.visibility === 'public') {
        routes.push({
          url: `${baseUrl}/prompt/${promptId}`,
          lastModified: prompt.updatedAt || prompt.createdAt || currentDate,
          changeFrequency: 'weekly',
          priority: 0.6,
        })
      }
    }
  }

  return routes
} 