'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import fs from 'fs/promises';
import path from 'path';

interface KeywordEntry {
  category: string;
  subcategory: string;
  keywords: string[];
}

export default function KeywordsManager() {
  const [keywords, setKeywords] = useState<KeywordEntry[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [newKeywords, setNewKeywords] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    fetchKeywords();
  }, []);

  const fetchKeywords = async () => {
    try {
      const response = await fetch('/api/keywords');
      const data = await response.json();
      setKeywords(data);
    } catch (error) {
      console.error('Error fetching keywords:', error);
      setMessage({ text: 'Failed to load keywords', type: 'error' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/keywords', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: newCategory.toLowerCase(),
          subcategory: newSubcategory.toLowerCase(),
          keywords: newKeywords.split(',').map(k => k.trim()),
        }),
      });

      if (response.ok) {
        setMessage({ text: 'Keywords added successfully', type: 'success' });
        fetchKeywords();
        setNewCategory('');
        setNewSubcategory('');
        setNewKeywords('');
      } else {
        setMessage({ text: 'Failed to add keywords', type: 'error' });
      }
    } catch (error) {
      console.error('Error adding keywords:', error);
      setMessage({ text: 'Failed to add keywords', type: 'error' });
    }
  };

  const handleDelete = async (category: string, subcategory: string) => {
    try {
      const response = await fetch('/api/keywords', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ category, subcategory }),
      });

      if (response.ok) {
        setMessage({ text: 'Keywords deleted successfully', type: 'success' });
        fetchKeywords();
      } else {
        setMessage({ text: 'Failed to delete keywords', type: 'error' });
      }
    } catch (error) {
      console.error('Error deleting keywords:', error);
      setMessage({ text: 'Failed to delete keywords', type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-[#8B5CF6] via-white to-[#8B5CF6] bg-clip-text text-transparent">
          SEO Keywords Manager
        </h1>

        {/* Add New Keywords Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/60 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-lg p-6 mb-8"
        >
          <h2 className="text-2xl font-semibold mb-4 text-[#8B5CF6]">Add New Keywords</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-black/40 border border-[#8B5CF6]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#8B5CF6]"
                  placeholder="e.g., writing"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subcategory</label>
                <input
                  type="text"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  className="w-full bg-black/40 border border-[#8B5CF6]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#8B5CF6]"
                  placeholder="e.g., blog-posts (or 'all' for category-wide)"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Keywords (comma-separated)</label>
              <textarea
                value={newKeywords}
                onChange={(e) => setNewKeywords(e.target.value)}
                className="w-full bg-black/40 border border-[#8B5CF6]/20 rounded-lg px-4 py-2 focus:outline-none focus:border-[#8B5CF6] h-24"
                placeholder="e.g., blog writing, content creation, article writing"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-[#8B5CF6]/10 text-[#8B5CF6] px-6 py-2 rounded-lg hover:bg-[#8B5CF6]/20 transition-colors"
            >
              Add Keywords
            </button>
          </form>
        </motion.div>

        {/* Message Display */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`p-4 rounded-lg mb-8 ${
              message.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Keywords List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-black/60 backdrop-blur-lg border border-[#8B5CF6]/20 rounded-lg p-6"
        >
          <h2 className="text-2xl font-semibold mb-4 text-[#8B5CF6]">Current Keywords</h2>
          <div className="space-y-6">
            {keywords.map((entry, index) => (
              <motion.div
                key={`${entry.category}-${entry.subcategory}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="border border-[#8B5CF6]/10 rounded-lg p-4"
              >
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-[#8B5CF6]">
                      {entry.category} / {entry.subcategory}
                    </h3>
                  </div>
                  <button
                    onClick={() => handleDelete(entry.category, entry.subcategory)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                  >
                    Delete
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {entry.keywords.map((keyword, i) => (
                    <span
                      key={i}
                      className="bg-[#8B5CF6]/10 text-[#8B5CF6] px-3 py-1 rounded-full text-sm"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
} 