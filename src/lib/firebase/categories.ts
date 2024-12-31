import { db } from '../firebase';
import { ref, get, set } from 'firebase/database';
import { promptCategories, PromptCategory } from '../categories';

export async function initializeCategories() {
  try {
    const categoriesRef = ref(db, 'categories');
    
    // Check if categories already exist
    const snapshot = await get(categoriesRef);
    if (snapshot.exists()) {
      console.log('Categories already initialized');
      return;
    }

    // Add all categories in parallel
    const promises = promptCategories.map(async (category) => {
      const categoryRef = ref(db, `categories/${category.id}`);
      await set(categoryRef, {
        ...category,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    });

    await Promise.all(promises);
    console.log('Successfully initialized categories');
  } catch (error) {
    console.error('Error initializing categories:', error);
    throw error;
  }
}

export async function getCategories(): Promise<PromptCategory[]> {
  try {
    const categoriesRef = ref(db, 'categories');
    const snapshot = await get(categoriesRef);
    
    if (!snapshot.exists()) {
      return [];
    }

    const categoriesData = snapshot.val();
    return Object.values(categoriesData) as PromptCategory[];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
} 