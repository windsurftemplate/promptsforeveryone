'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { ref, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { redirectToCheckout } from '@/lib/stripe';
import Link from 'next/link';

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

  // Check Pro status
  useEffect(() => {
    const checkProStatus = async () => {
      if (!user?.uid) return;
      
      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        setIsPro(userData?.plan === 'pro');
      } catch (error) {
        console.error('Error checking pro status:', error);
        setIsPro(false);
      }
    };

    checkProStatus();
  }, [user?.uid]);

  // Load private categories from Firebase
  useEffect(() => {
    const loadCategories = async () => {
      if (!user?.uid) return;
      
      try {
        const userCategoriesRef = ref(db, `users/${user.uid}/categories`);
        const snapshot = await get(userCategoriesRef);
        
        if (snapshot.exists()) {
          const categoriesData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
            id,
            ...data
          }));
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error loading private categories:', error);
      }
    };

    loadCategories();
  }, [user?.uid]);

  // Load public categories from Firebase
  useEffect(() => {
    const loadPublicCategories = async () => {
      try {
        const categoriesRef = ref(db, 'categories');
        const snapshot = await get(categoriesRef);
        
        if (snapshot.exists()) {
          const categoriesData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
            id,
            ...data
          }));
          setPublicCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error loading public categories:', error);
      }
    };

    loadPublicCategories();
  }, []);

  const handleAddCategory = () => {
    if (newCategory && !categories.find(cat => cat.name === newCategory)) {
      const newCat: Category = {
        id: Math.random().toString(36).substr(2, 9),
        name: newCategory,
        description: '',
        items: [],
        isPro: true
      };
      const updatedCategories = [...categories, newCat];
      setCategories(updatedCategories);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    const updatedCategories = categories.filter(cat => cat.name !== categoryName);
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
            icon: '🔹' // Default icon
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
    <div className="space-y-2 mx-1">
      {categoryList.map((category) => (
        <div key={category.id} className="space-y-1">
          <div className="relative group">
            <div 
              className={`h-10 flex items-center justify-between cursor-pointer p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/70 hover:text-white`}
              onClick={() => {
                setEditingCategory(editingCategory === category.name ? null : category.name);
                if (!isEditing || isPublic) {
                  onFilterChange(category.name);
                }
              }}
            >
              <div className="flex items-center gap-2">
                <span>{category.name}</span>
                {category.isPro && (
                  <span className="px-1.5 py-0.5 text-[10px] font-medium bg-[#2563eb]/20 text-[#2563eb] rounded">
                    PRO
                  </span>
                )}
              </div>
              {category.items?.length > 0 && (
                <svg
                  className={`w-4 h-4 transition-transform ${editingCategory === category.name ? 'rotate-180' : ''}`}
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
                  handleDeleteCategory(category.name);
                }}
                className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center"
              >
                ×
              </button>
            )}
          </div>
          {editingCategory === category.name && (
            <div className="ml-4 space-y-1">
              {!isPublic && isEditing && (
                <div className="flex flex-col gap-2 mb-2">
                  <input
                    type="text"
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="Add subcategory"
                    className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button 
                    onClick={() => handleAddSubcategory(category.name)}
                    className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 rounded-lg transition-colors text-sm"
                  >
                    Add Subcategory
                  </Button>
                </div>
              )}
              {category.items?.map((item) => (
                <div key={item.name} className="relative group">
                  <div 
                    className="h-10 flex items-center cursor-pointer p-3 rounded-lg bg-white/5 hover:bg-white/10 text-sm text-white/70 transition-colors cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      onFilterChange(item.name);
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.name}</span>
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
    <div className="h-screen sticky top-0 bg-surface p-5 relative flex flex-col w-[280px]">
      {/* User Tier Badge */}
      <div className="mb-4 mx-1">
        <span className={`px-3 py-2 rounded-lg text-sm font-medium ${
          isPro ? 'bg-[#2563eb]/20 text-[#2563eb]' : 'bg-white/10 text-white/70'
        }`}>
          {isPro ? 'Pro' : 'Free'}
        </span>
      </div>

      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-4 p-1.5 bg-surface hover:bg-surface-hover rounded-full border border-white/10 transition-colors"
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
        {isPro ? (
          <>
            {/* Pro User Content */}
            <div className="mx-1">
              <Button
                onClick={() => setIsEditing(!isEditing)}
                className="mb-4 w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 rounded-lg transition-colors text-sm"
              >
                {isEditing ? 'Done Editing' : 'Edit Categories'}
              </Button>
            </div>

            {/* Private Categories */}
            <div className="space-y-4 mx-1">
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Add new category"
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Button 
                  onClick={handleAddCategory}
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 rounded-lg transition-colors text-sm"
                >
                  Add Category
                </Button>
              </div>
              <div 
                className={`h-10 flex items-center cursor-pointer p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/70 hover:text-white`}
                onClick={() => onFilterChange('')}
              >
                All Prompts
              </div>
              {renderCategoryList(categories)}
            </div>

            {/* Public Categories */}
            {publicCategories.length > 0 && (
              <div className="mt-8 mx-1">
                <Button 
                  className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 rounded-lg transition-colors text-sm mb-4"
                  onClick={() => {}}
                >
                  Public Categories
                </Button>
                {renderCategoryList(publicCategories.filter(category => !category.isPro))}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col h-full mx-1">
            <div className="space-y-2">
              <div 
                className={`h-10 flex items-center cursor-pointer p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/70 hover:text-white`}
                onClick={() => onFilterChange('')}
              >
                All Prompts
              </div>
              {renderCategoryList(publicCategories.filter(category => !category.isPro))}
            </div>
            <div className="mt-auto pt-4">
              <div className="text-white/70 text-sm text-center">
                Upgrade to Pro to create and manage custom categories
              </div>
              <Button
                onClick={handleUpgradeClick}
                className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 rounded-lg transition-colors text-sm mt-2"
              >
                Upgrade to Pro
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Actions */}
      <div className="pt-4 mt-4 border-t border-white/10 space-y-2 mx-1">
        <Link href="/settings" className="block">
          <button className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </button>
        </Link>
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 text-sm text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
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