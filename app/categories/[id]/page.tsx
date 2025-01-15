'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue } from 'firebase/database';
import Link from 'next/link';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Script from 'next/script';
import { motion } from 'framer-motion';

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
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          {/* Animated background grid */}
          <div className="absolute inset-0 grid grid-cols-8 gap-1 opacity-20">
            {Array.from({ length: 64 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: Math.random() * 2,
                  ease: "linear"
                }}
                className="aspect-square bg-[#00ffff]"
              />
            ))}
          </div>

          {/* Hero content */}
          <div className="relative container mx-auto px-4 pt-32 pb-24">
            {/* Breadcrumb Navigation */}
            <div className="flex items-center gap-2 text-sm text-white/60 mb-4">
              <Link 
                href="/categories"
                className="hover:text-[#00ffff] transition-colors"
              >
                Categories
              </Link>
              <span>/</span>
              <span className="text-[#00ffff]">
                {category.name}
              </span>
            </div>

            <Link 
              href="/categories"
              className="inline-flex items-center text-[#00ffff] hover:text-[#00ffff]/80 mb-8 group"
            >
              <ArrowLeftIcon className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Categories
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl"
            >
              <h1 className="text-5xl font-bold bg-gradient-to-r from-[#00ffff] via-white to-[#00ffff] bg-clip-text text-transparent mb-6">
                {category.name}
              </h1>
              <p className="text-xl text-white/70 mb-12">
                {category.description || `Explore our collection of ${category.name.toLowerCase()} prompts`}
              </p>
            </motion.div>
          </div>

          {/* Decorative elements */}
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />
          <div className="absolute top-0 left-0 w-1/3 h-full bg-[#00ffff] opacity-[0.02] blur-3xl" />
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#00ffff] opacity-[0.02] blur-3xl" />
        </div>

        {/* Subcategories Grid */}
        <div className="container mx-auto px-4 py-24">
          {category.subcategories && Object.keys(category.subcategories).length > 0 && (
            <div>
              <h2 className="text-2xl font-bold text-[#00ffff] mb-6">Subcategories</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Object.entries(category.subcategories).map(([id, subcategory], index) => (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Link 
                      href={`/categories/${categoryId}/${encodeURIComponent(subcategory.name.toLowerCase().replace(/\s+/g, '-'))}`}
                      className="group block h-full"
                    >
                      <div 
                        className="bg-black/60 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 group-hover:border-[#00ffff]/40 transition-all duration-300 h-full"
                      >
                        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#00ffff] transition-colors">{subcategory.name}</h3>
                        <p className="text-white/60">
                          {subcategory.description || `Explore ${subcategory.name.toLowerCase()} prompts in the ${category.name.toLowerCase()} category`}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 