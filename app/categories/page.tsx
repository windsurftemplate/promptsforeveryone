'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

interface Category {
  id: string;
  name: string;
  description?: string;
  count?: number;
  subcategories?: {
    [key: string]: {
      name: string;
      description?: string;
    };
  };
}

export default function CategoriesPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalPrompts, setTotalPrompts] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories from our API
        const categoriesResponse = await fetch('/api/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        
        // Transform the data to match our interface
        const categoriesArray = Object.entries(categoriesData).map(([id, category]: [string, any]) => ({
          id,
          ...category
        }));
        setCategories(categoriesArray);

        // Fetch total prompts count
        const promptsResponse = await fetch('/api/prompts/count');
        if (promptsResponse.ok) {
          const { count } = await promptsResponse.json();
          setTotalPrompts(count);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-5xl font-bold bg-gradient-to-r from-[#00ffff] via-white to-[#00ffff] bg-clip-text text-transparent mb-6">
              Explore Our Prompt Categories
        </h1>
            <p className="text-xl text-white/70 mb-12">
              Discover a world of prompts organized by categories. Find the perfect prompt for your next project.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-[#00ffff] mb-2">{categories.length}</div>
                <div className="text-white/60">Categories</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-[#00ffff] mb-2">
                  {categories.reduce((total, category) => 
                    total + (category.subcategories ? Object.keys(category.subcategories).length : 0), 
                  0)}
                </div>
                <div className="text-white/60">Subcategories</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-[#00ffff] mb-2">
                  {totalPrompts}
                </div>
                <div className="text-white/60">Total Prompts</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute top-0 left-0 w-1/3 h-full bg-[#00ffff] opacity-[0.02] blur-3xl" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#00ffff] opacity-[0.02] blur-3xl" />
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={category.id} 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="h-full"
            >
              <Link href={`/categories/${category.id}`} className="group h-full">
                <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-semibold text-white group-hover:text-[#00ffff] transition-colors">
                    {category.name}
                  </h2>
                    <ChevronRightIcon className="h-5 w-5 text-[#00ffff] opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                </div>
                  <p className="text-white/60 mb-6 flex-grow">
                  {category.description || `Explore our collection of ${category.name.toLowerCase()} prompts`}
                </p>
                {category.subcategories && Object.keys(category.subcategories).length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-auto">
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
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
} 