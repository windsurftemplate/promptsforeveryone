'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Anton } from 'next/font/google';

const anton = Anton({ 
  weight: '400',
  subsets: ['latin'],
});

interface CategoryItem {
  name: string;
  description: string;
  icon: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  items: CategoryItem[];
}

interface Prompt {
  id: string;
  title: string;
  category: string;
  visibility: string;
}

export default function ExplorePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalPrompts, setTotalPrompts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesRef = ref(db, 'categories');
        const categoriesSnapshot = await get(categoriesRef);
        
        if (categoriesSnapshot.exists()) {
          const categoriesData = Object.entries(categoriesSnapshot.val()).map(([id, data]: [string, any]) => ({
            id,
            ...data
          })) as Category[];
          setCategories(categoriesData);
        } else {
          setCategories([]);
        }

        // Fetch total prompts
        const promptsRef = ref(db, 'prompts');
        const promptsSnapshot = await get(promptsRef);
        
        if (promptsSnapshot.exists()) {
          const prompts = Object.values(promptsSnapshot.val()) as Prompt[];
          const publicPrompts = prompts.filter(prompt => prompt.visibility === 'public');
          setTotalPrompts(publicPrompts.length);
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 flex justify-center items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#2563eb]"></div>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
          <p className="text-red-500">{error}</p>
        </Card>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card className="p-8 text-center bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20">
          <p className="text-white/70">No categories available yet.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/10">
          <h3 className="text-sm font-medium text-white/70">Total Categories</h3>
          <p className="text-2xl font-bold mt-2">{categories.length}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-white/10">
          <h3 className="text-sm font-medium text-white/70">Total Prompts</h3>
          <p className="text-2xl font-bold mt-2">{totalPrompts}</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-white/10">
          <h3 className="text-sm font-medium text-white/70">Active Users</h3>
          <p className="text-2xl font-bold mt-2">100+</p>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-pink-500/10 to-red-500/10 border border-white/10">
          <h3 className="text-sm font-medium text-white/70">Downloads</h3>
          <p className="text-2xl font-bold mt-2">1000+</p>
        </Card>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="mb-4">
              <Link href={`/category/${category.id}`} className="group inline-block">
                <h2 className={`${anton.className} text-2xl bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent group-hover:from-[#2563eb] group-hover:to-[#4f46e5] transition-all duration-300`}>
                  {category.name}
                </h2>
                <p className="text-sm text-white/70">{category.description}</p>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {category.items?.map((item) => (
                <Link
                  key={item.name}
                  href={`/category/${category.id}/${item.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <Card className="group h-full p-4 bg-[#0f172a]/80 backdrop-blur-lg border border-[#2563eb]/20 hover:bg-[#0f172a] hover:border-[#2563eb]/40 transition-all duration-300 hover:scale-105">
                    <div className="flex flex-col h-full">
                      <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                      <h3 className="text-sm font-semibold text-white mb-1">{item.name}</h3>
                      <p className="text-xs text-white/70 line-clamp-2">{item.description}</p>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Call to Action */}
      <Card className="mt-8 p-8 bg-gradient-to-br from-[#2563eb]/10 to-[#4f46e5]/10 border border-[#2563eb]/20 text-center">
        <h2 className={`${anton.className} text-2xl bg-gradient-to-r from-[#0ea5e9] to-[#2563eb] bg-clip-text text-transparent mb-4`}>
          CONTRIBUTE TO THE COMMUNITY
        </h2>
        <p className="text-white/70 mb-6 max-w-2xl mx-auto">
          Share your expertise and help others build better applications. Submit your own prompts to the community.
        </p>
        <Link href="/submit">
          <Button className="px-8 py-4 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition-all duration-300 hover:scale-105">
            Submit a Prompt
          </Button>
        </Link>
      </Card>
    </div>
  );
}
