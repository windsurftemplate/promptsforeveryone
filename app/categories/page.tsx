'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import AdDisplay from '@/components/AdDisplay';
import { ads } from '@/config/ads';

interface Category {
  id: string;
  name: string;
  description?: string;
  promptCount: number;
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
  const [localAds] = useState(ads);

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

        // Calculate total prompts from all categories
        const total = categoriesArray.reduce((sum, category) => sum + (category.promptCount || 0), 0);
        setTotalPrompts(total);
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
      <div className="min-h-screen bg-background-base flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-violet-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-base">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Banner ad for non-pro users */}
        {!user?.isPro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="relative z-10 container mx-auto px-4 pt-8"
          >
            <AdDisplay ad={localAds.find(ad => ad.type === 'banner') ?? localAds[0]} />
          </motion.div>
        )}

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
              className="aspect-square bg-violet"
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
            <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-300 via-white to-violet-400 bg-clip-text text-transparent mb-6">
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
                <div className="text-4xl font-bold text-violet-400 mb-2">{categories.length}</div>
                <div className="text-white/60">Categories</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-violet-400 mb-2">
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
                <div className="text-4xl font-bold text-violet-400 mb-2">
                  {totalPrompts}
                </div>
                <div className="text-white/60">Total Prompts</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-black to-transparent" />
        <div className="absolute top-0 left-0 w-1/3 h-full bg-violet opacity-[0.04] blur-3xl" />
        <div className="absolute top-0 right-0 w-1/3 h-full bg-violet opacity-[0.04] blur-3xl" />
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <React.Fragment key={category.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="h-full"
              >
                <Link href={`/categories/${category.id}`} className="group h-full">
                  <div className="feature-card p-6 hover:border-violet/25 transition-all duration-300 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-2xl font-semibold text-white group-hover:text-violet-400 transition-colors">
                        {category.name}
                      </h2>
                      <ChevronRightIcon className="h-5 w-5 text-violet-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                    </div>
                    <p className="text-white/60 mb-6 flex-grow">
                      {category.description || `Explore our collection of ${category.name.toLowerCase()} prompts`}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="text-violet-400/60">
                        {category.promptCount} {category.promptCount === 1 ? 'prompt' : 'prompts'}
                      </div>
                      {category.subcategories && Object.keys(category.subcategories).length > 0 && (
                        <div className="text-white/40">
                          {Object.keys(category.subcategories).length} {Object.keys(category.subcategories).length === 1 ? 'subcategory' : 'subcategories'}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
              {/* Insert inline ad after every 5th category for non-pro users */}
              {!user?.isPro && (index + 1) % 5 === 0 && index < categories.length - 1 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                  className="h-[180px] bg-black/30 border border-white/8 rounded-lg p-4"
                >
                  <AdDisplay ad={localAds.find(ad => ad.type === 'inline') ?? localAds[0]} />
                </motion.div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
} 