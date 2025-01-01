'use client';

import { useState } from 'react';
import { promptCategories } from '@/lib/categories';
import Link from 'next/link';
import Card from '@/components/ui/Card';

// Group categories by their group
const groupedCategories = promptCategories.reduce((acc, category) => {
  if (!acc[category.group]) {
    acc[category.group] = [];
  }
  acc[category.group].push(category);
  return acc;
}, {} as Record<string, typeof promptCategories>);

export default function ExplorePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);

  // Filter categories based on search term and selected group
  const filteredCategories = promptCategories.filter(category => {
    const matchesSearch = 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = !selectedGroup || category.group === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const groups = Object.keys(groupedCategories);

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00ffff] to-[#0099ff] text-transparent bg-clip-text">
            Explore Categories
          </h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Discover a wide range of prompt categories for every development need. From code generation to emerging technologies.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-center">
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] w-full sm:w-80"
          />
          <select
            value={selectedGroup || ''}
            onChange={(e) => setSelectedGroup(e.target.value || null)}
            className="px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
          >
            <option value="">All Groups</option>
            {groups.map(group => (
              <option key={group} value={group}>{group}</option>
            ))}
          </select>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((category) => (
            <Card 
              key={category.id}
              className="p-6 hover:border-[#00ffff]/50 transition-all duration-300 group cursor-pointer"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-gradient-to-br from-[#00ffff]/10 to-[#0099ff]/10 border border-[#00ffff]/20">
                  <span className="text-lg font-mono text-[#00ffff]">{category.icon}</span>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-[#00ffff] transition-colors">
                    {category.name}
                  </h3>
                  <span className="text-sm text-white/50">{category.group}</span>
                </div>
              </div>
              <p className="text-white/70 text-sm mb-4">
                {category.description}
              </p>
              <div className="flex justify-end">
                <Link 
                  href={`/category/${category.id}`}
                  className="text-[#00ffff] text-sm hover:text-[#0099ff] transition-colors"
                >
                  View Prompts →
                </Link>
              </div>
            </Card>
          ))}
        </div>

        {/* No Results */}
        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <p className="text-white/50">No categories found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
}
