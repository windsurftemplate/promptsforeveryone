'use client';

import React, { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PUBLIC_CATEGORIES = [
  {
    name: "Code Generation",
    description: "AI-powered code generation prompts for various programming languages and frameworks",
    icon: "💻"
  },
  {
    name: "Debugging",
    description: "Prompts to help identify and fix bugs in your code",
    icon: "🐛"
  },
  {
    name: "API Development",
    description: "Create and document APIs with helpful prompts",
    icon: "🔌"
  },
  {
    name: "Testing",
    description: "Generate test cases and improve code coverage",
    icon: "🧪"
  },
  {
    name: "Documentation",
    description: "Create clear and comprehensive documentation",
    icon: "📝"
  },
  {
    name: "Database",
    description: "Database design, queries, and optimization prompts",
    icon: "🗄️"
  },
  {
    name: "Security",
    description: "Security best practices and vulnerability detection",
    icon: "🔒"
  },
  {
    name: "Performance",
    description: "Optimize code and improve application performance",
    icon: "⚡"
  },
  {
    name: "UI/UX",
    description: "Design user interfaces and enhance user experience",
    icon: "🎨"
  },
  {
    name: "DevOps",
    description: "Streamline development and deployment processes",
    icon: "🚀"
  },
  {
    name: "Mobile Development",
    description: "Create mobile applications for iOS and Android",
    icon: "📱"
  },
  {
    name: "Web Development",
    description: "Build modern web applications and websites",
    icon: "🌐"
  },
  {
    name: "Machine Learning",
    description: "Develop AI and machine learning solutions",
    icon: "🤖"
  },
  {
    name: "Data Analysis",
    description: "Process and analyze data effectively",
    icon: "📊"
  },
  {
    name: "Cloud Computing",
    description: "Cloud infrastructure and services management",
    icon: "☁️"
  }
];

export default function ExplorePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<any[]>([]);

  useEffect(() => {
    const fetchPrompts = async () => {
      const promptsRef = ref(db, 'prompts');
      const snapshot = await get(promptsRef);
      if (snapshot.exists()) {
        const promptsData = Object.entries(snapshot.val())
          .map(([id, data]: [string, any]) => ({
            id,
            ...data,
            categories: data.categories || [],
          }))
          .filter(prompt => prompt.visibility !== 'private');
        setPrompts(promptsData);
      }
    };

    fetchPrompts();
  }, []);

  const filteredPrompts = selectedCategory
    ? prompts.filter(prompt => 
        prompt.categories?.some(category => 
          category.toLowerCase() === selectedCategory.toLowerCase()
        )
      )
    : [];

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-8">
          Explore Prompts
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {PUBLIC_CATEGORIES.map((category) => (
            <div
              key={category.name}
              onClick={() => setSelectedCategory(category.name)}
              className={`
                cursor-pointer p-6 rounded-lg border transition-all duration-300
                ${selectedCategory === category.name
                  ? 'bg-[#00ffff]/10 border-[#00ffff] shadow-[0_0_15px_rgba(0,255,255,0.3)]'
                  : 'bg-black/50 border-[#00ffff]/20 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)]'
                }
              `}
            >
              <div className="text-4xl mb-4">{category.icon}</div>
              <h3 className="text-xl font-semibold text-[#00ffff] mb-2">{category.name}</h3>
              <p className="text-white/60">{category.description}</p>
            </div>
          ))}
        </div>

        {selectedCategory && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-[#00ffff] mb-6">
              {selectedCategory} Prompts
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6 hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.1)] transition-all duration-300"
                >
                  <h3 className="text-xl font-semibold text-white mb-2">{prompt.title}</h3>
                  <p className="text-white/60 mb-4 line-clamp-2">{prompt.description}</p>
                  <Link
                    href={`/prompt/${prompt.id}`}
                    className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors"
                  >
                    View Details →
                  </Link>
                </div>
              ))}
              {filteredPrompts.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-white/60 mb-4">No prompts found in this category yet.</p>
                  <Link
                    href="/submit"
                    className="inline-block bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-6 py-2 rounded-lg transition-all duration-300 border border-[#00ffff]/30"
                  >
                    Submit the First Prompt
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
