import { Metadata } from 'next';
import { getDatabase, ref, get } from 'firebase/database';
import { initializeApp } from 'firebase/app';
import { getKeywords } from '../../utils/keywords';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
}

// Initialize Firebase
const app = initializeApp(firebaseConfig, 'metadata')
const db = getDatabase(app)

export async function generateCategoryMetadata(id: string): Promise<Metadata> {
  const categoryRef = ref(db, `categories/${id}`);
  const snapshot = await get(categoryRef);
  const category = snapshot.val();

  if (!category) {
    return {
      title: 'Category Not Found',
      description: 'The requested category could not be found.'
    };
  }

  // Get keywords for this category
  const keywords = getKeywords(id.toLowerCase());

  return {
    title: `${category.name} Prompts & Templates`,
    description: category.description || `Explore our collection of ${category.name.toLowerCase()} prompts. Find and use the best AI prompts for ${category.name.toLowerCase()}.`,
    keywords,
    openGraph: {
      title: `${category.name} Prompts & Templates`,
      description: category.description || `Explore our collection of ${category.name.toLowerCase()} prompts. Find and use the best AI prompts for ${category.name.toLowerCase()}.`,
    }
  };
}

export async function generateSubcategoryMetadata(categoryId: string, subcategoryId: string): Promise<Metadata> {
  const categoryRef = ref(db, `categories/${categoryId}`);
  const snapshot = await get(categoryRef);
  const category = snapshot.val();

  if (!category || !category.subcategories?.[subcategoryId]) {
    return {
      title: 'Subcategory Not Found',
      description: 'The requested subcategory could not be found.'
    };
  }

  const subcategory = category.subcategories[subcategoryId];
  
  // Get keywords for this subcategory
  const keywords = getKeywords(categoryId.toLowerCase(), subcategoryId.toLowerCase());

  return {
    title: `${subcategory.name} Prompts - ${category.name}`,
    description: subcategory.description || `Explore our collection of ${subcategory.name.toLowerCase()} prompts in the ${category.name} category. Find and use the best AI prompts for ${subcategory.name.toLowerCase()}.`,
    keywords,
    openGraph: {
      title: `${subcategory.name} Prompts - ${category.name}`,
      description: subcategory.description || `Explore our collection of ${subcategory.name.toLowerCase()} prompts in the ${category.name} category.`,
    }
  };
} 