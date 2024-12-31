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

type CategoryParams = {
  slug: string;
};

interface Props {
  params: CategoryParams;
  searchParams?: { [key: string]: string | string[] | undefined };
}

type AdSpaceProps = {
  position: 'top' | 'sidebar' | 'bottom';
};

const AdSpace: React.FC<AdSpaceProps> = ({ position }) => {
  const adStyles = {
    top: 'w-full h-[100px] mb-8',
    sidebar: 'w-full h-[600px]',
    bottom: 'w-full h-[100px] mt-8'
  };

  return (
    <div
      className={`bg-black/30 border border-[#00ffff]/10 rounded-lg flex items-center justify-center ${adStyles[position]}`}
    >
      <span className="text-[#00ffff]/40">Ad Space - {position}</span>
    </div>
  );
};

export default function Page({ params }: Props): React.JSX.Element {
  const router = useRouter();
  const { slug } = params;
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  const categoryName = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  useEffect(() => {
    async function fetchPrompts() {
      try {
        const promptsRef: DatabaseReference = ref(db, 'prompts');
        const snapshot: DataSnapshot = await get(promptsRef);

        if (snapshot.exists() && snapshot.val()) {
          const promptsData = Object.entries(snapshot.val() || {})
            .map(([id, data]: [string, any]): Prompt => ({
              id,
              ...data,
            }))
            .filter((prompt: Prompt) =>
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

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <AdSpace position="top" />

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{CATEGORY_ICONS[slug] || '🔍'}</span>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent">
                  {categoryName} Prompts
                </h1>
              </div>
              <p className="text-white/60">
                {CATEGORY_DESCRIPTIONS[slug] || 'Explore our collection of prompts in this category'}
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
                {prompts.map(prompt => (
                  <div
                    key={prompt.id}
                    className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300"
                  >
                    <h2 className="text-xl font-semibold text-white mb-2">{prompt.title}</h2>
                    <p className="text-white/60 mb-4">{prompt.description}</p>
                    <Link
                      href={`/prompt/${prompt.id}`}
                      className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors"
                    >
                      View Details →
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-white/60 mb-4">No prompts found in this category yet.</p>
                <Link
                  href="/submit"
                  className="inline-block bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-6 py-2 rounded-lg border border-[#00ffff]/30"
                >
                  Submit the First Prompt
                </Link>
              </div>
            )}
          </div>

          <div className="lg:w-[300px] space-y-6">
            <AdSpace position="sidebar" />
          </div>
        </div>

        <AdSpace position="bottom" />
      </div>
    </div>
  );
}
