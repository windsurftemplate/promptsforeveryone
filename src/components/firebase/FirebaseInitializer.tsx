'use client';

import { useEffect } from 'react';
import { initializeCategories } from '@/lib/firebase/categories';

export default function FirebaseInitializer() {
  useEffect(() => {
    // Initialize categories when the app starts (client-side only)
    initializeCategories().catch(console.error);
  }, []);

  return null;
} 