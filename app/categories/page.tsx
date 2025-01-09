'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';

interface Category {
  id: string;
  name: string;
  description?: string;
  subcategories?: {
    [key: string]: {
      name: string;
      description?: string;
    };
  };
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoriesRef = ref(db, 'categories');
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          ...category
        }));
        setCategories(categoriesArray);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-8">
          Categories
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              key={category.id} 
              href={`/categories/${category.id}`}
              className="group"
            >
              <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 transition-all duration-300">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white group-hover:text-[#00ffff] transition-colors">
                    {category.name}
                  </h2>
                  <ChevronRightIcon className="h-5 w-5 text-[#00ffff] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-white/60 mb-4">
                  {category.description || `Explore our collection of ${category.name.toLowerCase()} prompts`}
                </p>
                {category.subcategories && Object.keys(category.subcategories).length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(category.subcategories).slice(0, 3).map(([id, subcategory]) => (
                      <span 
                        key={id}
                        className="px-3 py-1 bg-[#00ffff]/10 text-[#00ffff] text-sm rounded-full"
                      >
                        {subcategory.name}
                      </span>
                    ))}
                    {Object.keys(category.subcategories).length > 3 && (
                      <span className="px-3 py-1 bg-[#00ffff]/10 text-[#00ffff] text-sm rounded-full">
                        +{Object.keys(category.subcategories).length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
} 