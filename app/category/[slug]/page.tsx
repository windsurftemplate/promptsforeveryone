'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ref, get, DatabaseReference, DataSnapshot } from 'firebase/database';
import { db } from '@/lib/firebase';
import { CATEGORY_ICONS, CATEGORY_DESCRIPTIONS } from '@/lib/constants';

interface Prompt {
  id: string;
  title: string;
  description: string;
  category: string;
  categories?: string[];
  visibility: 'public' | 'private';
}

interface CategoryParams {
  slug?: string; // Make slug optional to handle undefined cases
}

interface Props {
  params: CategoryParams;
}

type AdSpaceProps = {
  position: 'top' | 'sidebar' | 'bottom';
};

type CategorySlug = keyof typeof CATEGORY_ICONS;

const AdSpace: React.FC<AdSpaceProps> = ({ position }) => {
  const adStyles = {
    top: 'w-full h-[100px] mb-8',
    sidebar: 'w-full h-[600px]',
    bottom: 'w-full h-[100px] mt-8',
  };

  return (
    <div
      className={`bg-black/30 border border-[#00ffff]/10 rounded-lg flex items-center justify-center ${adStyles[position]}`}
    >
      <span className="text-[#00ffff]/40">Ad Space - {position}</span>
    </div>
  );
};

export default function CategoryPage({ params }: Props) {
  const router = useRouter();
  const { slug } = params;
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  if (!slug) {
    // Redirect to a 404 page if slug is missing
    router.push('/404');
    return null;
  }

  const categoryName = slug
    .split('-')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const promptsRef: DatabaseReference = ref(db, 'prompts');
        const snapshot: DataSnapshot = await get(promptsRef);

        if (snapshot.exists()) {
          const promptsData = Object.entries(snapshot.val() || {})
            .map(([id, data]: [string, any]): Prompt => ({
              id,
              ...data,
            }))
            .filter(
              (prompt: Prompt) =>
                prompt.visibility !== 'private' &&
                (prompt.category === categoryName ||
                  prompt.categories?.includes(categoryName))
            );

          setPrompts(promptsData);
        } else {
          setPrompts([]);
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPrompts();
  }, [slug, categoryName]);

  // Safely retrieve the icon or fallback to a default
  const IconComponent = CATEGORY_ICONS[slug as CategorySlug] || (() => <span>🔍</span>);

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <AdSpace position="top" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">
                  <IconComponent className="w-12 h-12 text-[#00ffff]" />
                </span>
                <h1 className="text-3xl font-bold text-[#00ffff]">
                  {categoryName} Prompts
                </h1>
              </div>
              <p className="text-white/60">
                {CATEGORY_DESCRIPTIONS[slug as CategorySlug] || 'Explore our collection of prompts'}
              </p>
            </div>

            {loading ? (
              <div className="grid gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-black/50 border border-[#00ffff]/10 rounded-lg p-6 animate-pulse"
                  >
                    <div className="h-6 bg-[#00ffff]/20 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-[#00ffff]/10 rounded w-full mb-2"></div>
                    <div className="h-4 bg-[#00ffff]/10 rounded w-5/6"></div>
                  </div>
                ))}
              </div>
            ) : prompts.length > 0 ? (
              <div className="grid gap-6">
                {prompts.map((prompt) => (
                  <div key={prompt.id} className="bg-black/50 border p-6">
                    <h2 className="text-xl text-white">{prompt.title}</h2>
                    <p className="text-white/60">{prompt.description}</p>
                    <Link href={`/prompt/${prompt.id}`} className="text-[#00ffff]">
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-white/60">No prompts found.</p>
            )}
          </div>

          <div className="lg:w-[300px]">
            <AdSpace position="sidebar" />
          </div>
        </div>

        <AdSpace position="bottom" />
      </div>
    </div>
  );
}
