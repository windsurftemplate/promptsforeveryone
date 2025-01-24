import { Metadata } from 'next';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getKeywords } from '../../utils/keywords';
import { generateDynamicMetadata } from '../metadata';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
}

// Initialize Firebase and cache the database instance
const app = initializeApp(firebaseConfig, 'metadata');
const db = getDatabase(app);

// Cache for category data to prevent redundant fetches
const categoryCache = new Map<string, any>();

async function getCategoryData(categoryId: string) {
  // Check cache first
  if (categoryCache.has(categoryId)) {
    return categoryCache.get(categoryId);
  }

  // If not in cache, fetch from Firebase
  const categoryRef = ref(db, `categories/${categoryId}`);
  const snapshot = await get(categoryRef);
  const data = snapshot.val();

  // Store in cache
  if (data) {
    categoryCache.set(categoryId, data);
  }

  return data;
}

export async function generateCategoryMetadata(id: string): Promise<Metadata> {
  const category = await getCategoryData(id);

  if (!category) {
    return generateDynamicMetadata({
      title: 'Category Not Found',
      description: 'The requested category could not be found.',
      path: `/categories/${id}`,
      type: 'article'
    });
  }

  // Get keywords for this category
  const keywords = getKeywords(id.toLowerCase());

  return generateDynamicMetadata({
    title: `${category.name} Prompts & Templates`,
    description: category.description || `Explore our collection of ${category.name.toLowerCase()} prompts. Find and use the best AI prompts for ${category.name.toLowerCase()}.`,
    path: `/categories/${id}`,
    type: 'article',
    keywords,
    image: category.image || '/og-image.png'
  });
}

export async function generateSubcategoryMetadata(categoryId: string, subcategoryId: string): Promise<Metadata> {
  const category = await getCategoryData(categoryId);

  if (!category || !category.subcategories?.[subcategoryId]) {
    return generateDynamicMetadata({
      title: 'Subcategory Not Found',
      description: 'The requested subcategory could not be found.',
      path: `/categories/${categoryId}/${subcategoryId}`,
      type: 'article'
    });
  }

  const subcategory = category.subcategories[subcategoryId];
  
  // Get keywords for this subcategory
  const keywords = getKeywords(categoryId.toLowerCase(), subcategoryId.toLowerCase());

  return generateDynamicMetadata({
    title: `${subcategory.name} Prompts - ${category.name}`,
    description: subcategory.description || `Explore our collection of ${subcategory.name.toLowerCase()} prompts in the ${category.name} category. Find and use the best AI prompts for ${subcategory.name.toLowerCase()}.`,
    path: `/categories/${categoryId}/${subcategoryId}`,
    type: 'article',
    keywords,
    image: subcategory.image || category.image || '/og-image.png'
  });
} 