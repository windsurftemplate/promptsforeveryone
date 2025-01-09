'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Script from 'next/script';

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

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function CategoryPage({ params }: Props) {
  const { id: categoryId } = React.use(params);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoryRef = ref(db, `categories/${categoryId}`);
    const unsubscribe = onValue(categoryRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setCategory({
          id: categoryId,
          ...data
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Category not found</div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description || `Collection of ${category.name.toLowerCase()} prompts`,
    url: `https://promptsforeveryone.com/categories/${categoryId}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: category.subcategories ? 
        Object.entries(category.subcategories).map(([id, sub], index) => ({
          '@type': 'ListItem',
          position: index + 1,
          item: {
            '@type': 'Thing',
            name: sub.name,
            description: sub.description || `${sub.name} prompts and templates`,
            url: `https://promptsforeveryone.com/categories/${categoryId}/${id}`
          }
        })) : []
    },
    breadcrumb: {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Categories',
          item: 'https://promptsforeveryone.com/categories'
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: category.name,
          item: `https://promptsforeveryone.com/categories/${categoryId}`
        }
      ]
    }
  };

  return (
    <>
      <Script id="category-structured-data" type="application/ld+json">
        {JSON.stringify(structuredData)}
      </Script>
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-12">
          <Link 
            href="/categories"
            className="inline-flex items-center text-[#00ffff] hover:text-[#00ffff]/80 mb-8 group"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Categories
          </Link>

          <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-8 mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">{category.name}</h1>
            <p className="text-white/60 text-lg">
              {category.description || `Explore our collection of ${category.name.toLowerCase()} prompts`}
            </p>
          </div>

          {category.subcategories && Object.keys(category.subcategories).length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#00ffff] mb-6">Subcategories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(category.subcategories).map(([id, subcategory]) => (
                  <Link 
                    key={id}
                    href={`/categories/${categoryId}/${id}`}
                    className="group"
                  >
                    <div 
                      className="bg-black/60 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 group-hover:border-[#00ffff]/40 transition-all duration-300"
                    >
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#00ffff] transition-colors">{subcategory.name}</h3>
                      <p className="text-white/60">
                        {subcategory.description || `Explore ${subcategory.name.toLowerCase()} prompts in the ${category.name.toLowerCase()} category`}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 