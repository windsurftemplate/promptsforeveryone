'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

interface Category {
  id: string;
  name: string;
}

export default function FeatureCarousel() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categoriesRef = ref(db, 'categories');
      const snapshot = await get(categoriesRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          name: category.name,
        }));
        setCategories(categoriesArray);
      }
    };

    fetchCategories();
  }, []);

  // Duplicate categories to create a seamless loop
  const duplicatedCategories = [...categories, ...categories];

  return (
    <div className="w-full overflow-hidden py-8 bg-black/50">
      {/* First Row - Left to Right */}
      <div className="mb-8">
        <motion.div
          className="flex space-x-8"
          animate={{
            x: [0, -50 * categories.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 20,
              ease: "linear",
            },
          }}
        >
          {duplicatedCategories.map((category, index) => (
            <div
              key={`${category.id}-${index}`}
              className="flex-shrink-0 w-48 h-24 bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-4 flex items-center justify-center hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300"
            >
              <p className="text-[#00ffff] text-center font-medium">{category.name}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Second Row - Right to Left */}
      <div className="mb-8">
        <motion.div
          className="flex space-x-8"
          animate={{
            x: [-50 * categories.length, 0],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 15,
              ease: "linear",
            },
          }}
        >
          {duplicatedCategories.map((category, index) => (
            <div
              key={`${category.id}-${index}-reverse`}
              className="flex-shrink-0 w-48 h-24 bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-4 flex items-center justify-center hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300"
            >
              <p className="text-[#00ffff] text-center font-medium">{category.name}</p>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Third Row - Left to Right */}
      <div>
        <motion.div
          className="flex space-x-8"
          animate={{
            x: [0, -50 * categories.length],
          }}
          transition={{
            x: {
              repeat: Infinity,
              repeatType: "loop",
              duration: 25,
              ease: "linear",
            },
          }}
        >
          {duplicatedCategories.map((category, index) => (
            <div
              key={`${category.id}-${index}-third`}
              className="flex-shrink-0 w-48 h-24 bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg p-4 flex items-center justify-center hover:border-[#00ffff]/40 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300"
            >
              <p className="text-[#00ffff] text-center font-medium">{category.name}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
} 