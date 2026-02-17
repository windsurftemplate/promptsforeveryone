'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { ref, push, get } from 'firebase/database';
import { useRouter } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  subcategories?: {
    [key: string]: {
      name: string;
    };
  };
  isPrivate?: boolean;
}

export default function SubmitPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [privateCategories, setPrivateCategories] = useState<Category[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'public' | 'private'>('public');

  useEffect(() => {
    // Check if user is paid and fetch categories
    const checkUserAndFetchData = async () => {
      if (!user) {
        router.push('/login');
        return;
      }

      try {
        // Check if user has access to private features
        const userRef = ref(db, `users/${user.uid}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.exists() ? userSnapshot.val() : null;
        const hasPrivateAccess = userData?.role === 'admin' || userData?.plan === 'paid' || userData?.stripeSubscriptionStatus === 'active';
        console.log('User data:', userData); // Add debug logging
        console.log('Has private access:', hasPrivateAccess); // Add debug logging
        setIsPrivate(hasPrivateAccess);

        // Fetch public categories
        const categoriesRef = ref(db, 'categories');
        const categoriesSnapshot = await get(categoriesRef);
        if (categoriesSnapshot.exists()) {
          const data = categoriesSnapshot.val();
          const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
            id,
            name: category.name,
            subcategories: category.subcategories || {}
          }));
          setCategories(categoriesArray);
        }

        // Fetch private categories if user has access
        if (hasPrivateAccess) {
          const privateRef = ref(db, `users/${user.uid}/categories`);
          const privateSnapshot = await get(privateRef);
          if (privateSnapshot.exists()) {
            const data = privateSnapshot.val();
            const privateCategoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
              id,
              name: category.name,
              subcategories: category.subcategories || {},
              isPrivate: true
            }));
            setPrivateCategories(privateCategoriesArray);
          }
        }
      } catch (error) {
        console.error('Error checking user access:', error);
        setError('Failed to verify user access');
      }
    };

    checkUserAndFetchData();
  }, [user, router, activeTab]);

  const validateFields = () => {
    if (title.length < 3 || title.length > 100) {
      setError('Title must be between 3 and 100 characters');
      return false;
    }
    if (content.length < 10 || content.length > 5000) {
      setError('Prompt must be between 10 and 5000 characters');
      return false;
    }
    if (!selectedCategory) {
      setError('Please select a category');
      return false;
    }

    // Get the current category
    const currentCategories = activeTab === 'private' ? privateCategories : categories;
    const currentCategory = currentCategories.find(cat => cat.id === selectedCategory);
    
    // Check if category has subcategories and one isn't selected
    if (currentCategory?.subcategories && 
        Object.keys(currentCategory.subcategories).length > 0 && 
        !selectedSubcategory) {
      setError('Please select a subcategory');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('You must be logged in to submit a prompt');
      return;
    }

    try {
      setIsSubmitting(true);
      setError('');

      if (!validateFields()) {
        setIsSubmitting(false);
        return;
      }

      // Check if category exists in the appropriate location
      const isPrivateCategory = privateCategories.some(cat => cat.id === selectedCategory);
      const categoryRef = isPrivateCategory 
        ? ref(db, `users/${user.uid}/categories/${selectedCategory}`)
        : ref(db, `categories/${selectedCategory}`);
      
      const categorySnapshot = await get(categoryRef);
      if (!categorySnapshot.exists()) {
        setError('Selected category does not exist');
        setIsSubmitting(false);
        return;
      }

      const promptData = {
        title,
        content,
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory || null,
        visibility: isPrivateCategory ? 'private' : 'public', // Set visibility based on category type
        userId: user.uid,
        userName: user.displayName || user.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Save to the appropriate location based on category type
      try {
        const promptsRef = isPrivateCategory
          ? ref(db, `users/${user.uid}/prompts`)
          : ref(db, 'prompts');
        
        await push(promptsRef, promptData);
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Firebase error:', error);
        if (error.code === 'PERMISSION_DENIED') {
          setError('Permission denied. Please check if you have the necessary access rights.');
        } else {
          setError(`Failed to save prompt: ${error.message}`);
        }
        setIsSubmitting(false);
        return;
      }
    } catch (error: any) {
      console.error('Error submitting prompt:', error);
      setError(`Failed to submit prompt: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-white mb-8">Create New Prompt</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg flex items-center space-x-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Category Tabs */}
          <div className="flex space-x-4 border-b border-[#8B5CF6]/20">
            <button
              type="button"
              onClick={() => {
                setActiveTab('public');
                setSelectedCategory('');
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'public'
                  ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              Public Categories
            </button>
            {isPrivate && (
              <button
                type="button"
                onClick={() => {
                  setActiveTab('private');
                  setSelectedCategory('');
                }}
                className={`px-4 py-2 text-sm font-medium transition-colors ${
                  activeTab === 'private'
                    ? 'text-[#8B5CF6] border-b-2 border-[#8B5CF6]'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Private Categories
              </button>
            )}
          </div>
          
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="category" className="block text-sm font-medium text-white">
                Category
              </label>
              {activeTab === 'private' && isPrivate && (
                <button
                  type="button"
                  onClick={() => {
                    const categoryName = prompt('Enter category name:');
                    if (!user) {
                      setError('You must be logged in to create a category');
                      return;
                    }
                    if (categoryName && categoryName.length >= 3 && categoryName.length <= 50) {
                      const newCategoryRef = ref(db, `users/${user.uid}/categories`);
                      push(newCategoryRef, {
                        name: categoryName,
                        createdAt: new Date().toISOString()
                      }).then(() => {
                        // Refresh private categories
                        const privateRef = ref(db, `users/${user.uid}/categories`);
                        get(privateRef).then((snapshot) => {
                          if (snapshot.exists()) {
                            const data = snapshot.val();
                            const privateCategoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
                              id,
                              name: category.name,
                              isPrivate: true
                            }));
                            setPrivateCategories(privateCategoriesArray);
                          }
                        });
                      }).catch((error) => {
                        console.error('Error creating category:', error);
                        setError('Failed to create category. Please try again.');
                      });
                    } else if (categoryName) {
                      setError('Category name must be between 3 and 50 characters');
                    }
                  }}
                  className="text-sm text-[#8B5CF6] hover:text-[#8B5CF6]/80 transition-colors"
                >
                  + Add New Category
                </button>
              )}
            </div>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setSelectedSubcategory(''); // Reset subcategory when category changes
              }}
              className="w-full bg-black/50 text-white border border-[#8B5CF6]/20 rounded-lg p-2 focus:border-[#8B5CF6]/40 focus:outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-no-repeat bg-right-1 bg-[length:16px] bg-[right_12px_center] pr-10 hover:border-[#8B5CF6]/40 transition-colors"
            >
              <option value="" className="bg-black text-white">Select a category</option>
              {(activeTab === 'private' ? privateCategories : categories).map((category) => (
                <option key={category.id} value={category.id} className="bg-black text-white">
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Selection - Only show if selected category has subcategories */}
          {selectedCategory && (() => {
            const currentCategories = activeTab === 'private' ? privateCategories : categories;
            const currentCategory = currentCategories.find(cat => cat.id === selectedCategory);
            
            if (currentCategory?.subcategories && Object.keys(currentCategory.subcategories).length > 0) {
              return (
                <div>
                  <label htmlFor="subcategory" className="block text-sm font-medium text-white mb-2">
                    Subcategory <span className="text-[#8B5CF6]">*</span>
                  </label>
                  <select
                    id="subcategory"
                    value={selectedSubcategory}
                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                    className="w-full bg-black/50 text-white border border-[#8B5CF6]/20 rounded-lg p-2 focus:border-[#8B5CF6]/40 focus:outline-none appearance-none cursor-pointer bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNNCA2TDggMTBMMTIgNiIgc3Ryb2tlPSIjMDBmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==')] bg-no-repeat bg-right-1 bg-[length:16px] bg-[right_12px_center] pr-10 hover:border-[#8B5CF6]/40 transition-colors"
                    required
                  >
                    <option value="" className="bg-black text-white">Select a subcategory</option>
                    {Object.entries(currentCategory.subcategories).map(([id, subcategory]) => (
                      <option key={id} value={id} className="bg-black text-white">
                        {subcategory.name}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            return null;
          })()}

          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-black/50 text-white border border-[#8B5CF6]/20 rounded-lg p-3 focus:border-[#8B5CF6]/40 focus:outline-none"
              placeholder="Enter prompt title"
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-white mb-2">
              Prompt
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              className="w-full bg-black/50 text-white border border-[#8B5CF6]/20 rounded-lg p-3 focus:border-[#8B5CF6]/40 focus:outline-none"
              placeholder="Enter your prompt"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#8B5CF6] hover:bg-[#8B5CF6]/80 text-black font-bold py-2 px-4 rounded-lg disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Prompt'}
          </button>
        </form>
      </div>
    </div>
  );
} 