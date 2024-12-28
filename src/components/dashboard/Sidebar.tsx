'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { ref, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { redirectToCheckout } from '@/lib/stripe';
import Link from 'next/link';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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
  isPro?: boolean;
  isPrivate?: boolean;
}

interface SidebarProps {
  onFilterChange: (category: string) => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

export default function Sidebar({ onFilterChange, isCollapsed, onToggle }: SidebarProps) {
  const { user, loading, signOut } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [publicCategories, setPublicCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user's pro status
  useEffect(() => {
    if (user?.uid) {
      const userRef = ref(db, `users/${user.uid}`);
      get(userRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setIsPro(userData.isPro === true || userData.stripeSubscriptionStatus === 'active');
        }
      }).catch((error) => {
        console.error('Error fetching pro status:', error);
      });
    }
  }, [user]);

  // Fetch private categories
  useEffect(() => {
    if (user?.uid) {
      const userCategoriesRef = ref(db, `users/${user.uid}/categories`);
      get(userCategoriesRef).then((snapshot) => {
        if (snapshot.exists()) {
          const categoriesData = snapshot.val();
          const categoriesArray = Object.keys(categoriesData).map(key => ({
            id: key,
            ...categoriesData[key],
            isPrivate: true
          }));
          setCategories(categoriesArray);
        }
      });
    }
  }, [user]);

  // Fetch public categories
  useEffect(() => {
    const publicCategoriesRef = ref(db, 'categories');
    get(publicCategoriesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const categoriesData = snapshot.val();
        const categoriesArray = Object.keys(categoriesData).map(key => ({
          id: key,
          ...categoriesData[key],
          isPrivate: false
        }));
        setPublicCategories(categoriesArray);
      }
    });
  }, []);

  // Save private categories when updated
  useEffect(() => {
    if (user?.uid && categories.length > 0) {
      const userCategoriesRef = ref(db, `users/${user.uid}/categories`);
      const categoriesObject = categories.reduce((acc, cat) => ({
        ...acc,
        [cat.id]: {
          name: cat.name || '',
          description: cat.description || '',
          items: cat.items?.map(item => ({
            name: item.name || '',
            description: item.description || '',
            icon: item.icon || '🔹'
          })) || [],
          isPro: cat.isPro || false
        }
      }), {});
      set(userCategoriesRef, categoriesObject);
    }
  }, [categories, user]);

  const handleAddCategory = () => {
    if (newCategory && !categories.find(cat => cat.name === newCategory)) {
      const newCat: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCategory,
        description: '',
        items: [],
        isPro: true,
        isPrivate: true
      };
      setCategories([...categories, newCat]);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const updatedCategories = categories.filter(cat => cat.id !== categoryId);
    setCategories(updatedCategories);
  };

  const handleUpgradeClick = async () => {
    try {
      if (!user?.uid) {
        console.log('No authenticated user found');
        alert('Please sign in to upgrade to Pro.');
        return;
      }

      const priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID;
      if (!priceId) {
        console.error('Stripe price ID is not configured');
        alert('Sorry, there was an error initiating the checkout. Please try again later.');
        return;
      }
      
      await redirectToCheckout(priceId, user.uid);
    } catch (error) {
      console.error('Error during checkout:', error);
      alert('Sorry, there was an error initiating the checkout. Please try again later.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleAddSubcategory = (categoryName: string) => {
    if (!newSubcategory) return;
    
    const updatedCategories = categories.map(cat => {
      if (cat.name === categoryName) {
        return {
          ...cat,
          items: [...(cat.items || []), {
            name: newSubcategory,
            description: '',
            icon: '🔹'
          }]
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    setNewSubcategory('');
  };

  const handleDeleteSubcategory = (categoryName: string, subcategoryName: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.name === categoryName) {
        return {
          ...cat,
          items: cat.items.filter(item => item.name !== subcategoryName)
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
  };

  const renderCategoryList = (categoryList: Category[], isPublic: boolean = false) => (
    <div className="space-y-2">
      {categoryList.map((category) => (
        <div key={category.id} className="space-y-1">
          <div className="relative group">
            <div 
              className={`flex items-center justify-between cursor-pointer p-3 rounded-lg transition-all duration-300 ${
                editingCategory === category.id
                  ? 'bg-[#00ffff]/20 border border-[#00ffff]/40'
                  : 'hover:bg-[#00ffff]/10 border border-transparent'
              }`}
              onClick={() => {
                if (isEditing && !isPublic) {
                  setEditingCategory(editingCategory === category.id ? null : category.id);
                } else {
                  onFilterChange(category.name);
                  setEditingCategory(editingCategory === category.id ? null : category.id);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <span className="text-white hover:text-[#00ffff] transition-colors">{category.name}</span>
                {category.isPro && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#00ffff]/20 text-[#00ffff] rounded">
                    PRO
                  </span>
                )}
              </div>
              {category.items?.length > 0 && (
                <svg
                  className={`w-4 h-4 text-[#00ffff] transition-transform ${editingCategory === category.id ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </div>
            {!isPublic && isEditing && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCategory(category.id);
                }}
                className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
          {editingCategory === category.id && (
            <div className="ml-4 space-y-1">
              {!isPublic && isEditing && (
                <div className="flex flex-col gap-2 mb-2">
                  <input
                    type="text"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="Add subcategory"
                    className="w-full bg-[#00ffff]/5 border border-[#00ffff]/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50"
                  />
                  <Button 
                    onClick={() => handleAddSubcategory(category.name)}
                    className="w-full bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold px-4 py-2 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                  >
                    Add Subcategory
                  </Button>
                </div>
              )}
              {category.items?.map((item) => (
                <div key={item.name} className="relative group">
                  <div 
                    className="flex items-center p-3 rounded-lg bg-[#00ffff]/5 hover:bg-[#00ffff]/10 transition-all duration-300 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterChange(item.name);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-white hover:text-[#00ffff] transition-colors">{item.name}</span>
                    </div>
                  </div>
                  {!isPublic && isEditing && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSubcategory(category.name, item.name);
                      }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="h-screen sticky top-0 bg-black/80 backdrop-blur-lg border-r border-[#00ffff]/20 p-4 relative flex flex-col w-[280px]">
      {/* User Tier Badge */}
      <div className="mb-4">
        <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
          isPro ? 'bg-[#00ffff]/20 text-[#00ffff]' : 'bg-white/10 text-white/70'
        }`}>
          {isPro ? 'Pro' : 'Free'}
        </span>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-4 p-1.5 bg-black/80 hover:bg-[#00ffff]/10 rounded-full border border-[#00ffff]/20 transition-colors text-[#00ffff]"
      >
        {isCollapsed ? (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
          </svg>
        )}
      </button>

      {/* Categories Section */}
      <div className="flex-grow overflow-y-auto">
        {isPro && (
          <>
            {/* Edit Categories Button */}
            <Button 
              onClick={() => setIsEditing(!isEditing)}
              className="w-full bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-4 py-2 rounded-lg transition-all duration-300 border border-[#00ffff]/30 mb-4"
            >
              {isEditing ? 'Done Editing' : 'Edit Categories'}
            </Button>

            {/* Add Category Input */}
            {isEditing && (
              <div className="flex flex-col gap-2 mb-4">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add new category"
                  className="w-full bg-[#00ffff]/5 border border-[#00ffff]/20 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50"
                />
                <Button
                  onClick={handleAddCategory}
                  className="w-full bg-[#00ffff] hover:bg-[#00ffff]/80 text-black font-bold px-4 py-2 rounded-lg transition-all duration-300 shadow-[0_0_15px_rgba(0,255,255,0.5)]"
                >
                  Add Category
                </Button>
              </div>
            )}

            {/* Private Categories */}
            <div className="space-y-4">
              <div 
                className="p-3 rounded-lg bg-[#00ffff]/10 hover:bg-[#00ffff]/20 transition-all duration-300 cursor-pointer text-[#00ffff]"
                onClick={() => onFilterChange('')}
              >
                All Prompts
              </div>
              {renderCategoryList(categories)}
            </div>
          </>
        )}

        {/* Public Categories */}
        <div className="mt-8">
          <Button 
            className="w-full bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] px-4 py-2 rounded-lg transition-all duration-300 border border-[#00ffff]/30 mb-4"
          >
            Public Categories
          </Button>
          {renderCategoryList(publicCategories, true)}
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 mt-4 border-t border-[#00ffff]/20 space-y-2">
        <Link href="/settings" className="block">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-[#00ffff] hover:bg-[#00ffff]/10 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-[#00ffff] hover:bg-[#00ffff]/10 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </div>
    </div>
  );
} 