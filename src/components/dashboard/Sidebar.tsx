'use client';

import React, { useState, useEffect } from 'react';
import Button from '../ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { ref, get, set } from 'firebase/database';
import { db } from '@/lib/firebase';
import { redirectToCheckout } from '@/lib/stripe';

interface Category {
  name: string;
  subcategories: string[];
}

interface SidebarProps {
  onFilterChange: (category: string) => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
  const { user, loading } = useAuth();
  const [isPro, setIsPro] = useState(false);
  const [categories, setCategories] = useState<Category[]>([
    {
      name: 'Code Generation',
      subcategories: ['React', 'Node.js', 'Python']
    },
    {
      name: 'Debugging',
      subcategories: ['Error Handling', 'Performance', 'Memory Leaks']
    },
    {
      name: 'API Development',
      subcategories: ['REST', 'GraphQL', 'WebSockets']
    },
    {
      name: 'Automation',
      subcategories: ['CI/CD', 'Testing', 'Deployment']
    },
    {
      name: 'Frontend',
      subcategories: ['UI/UX', 'State Management', 'Styling']
    },
    {
      name: 'Backend',
      subcategories: ['Database', 'Authentication', 'Caching']
    }
  ]);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategory, setNewSubcategory] = useState('');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const checkProStatus = async () => {
      if (!user?.uid) return;
      
      try {
        // Initialize user data in Firebase if it doesn't exist
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        let userData = snapshot.val();

        if (!userData) {
          userData = {
            email: user.email,
            displayName: user.displayName,
            plan: 'free',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          await set(userRef, userData);
          console.log('Initialized user data:', userData);
        }

        // Fetch subscription data from Stripe
        try {
          const response = await fetch('/api/check-subscription', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: user.uid,
              email: user.email,
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log('Stripe subscription data:', data);

          if (data.subscription) {
            // Update user data with Stripe information
            const updatedData = {
              ...userData,
              stripeCustomerId: data.subscription.customer,
              stripeSubscriptionId: data.subscription.id,
              stripeSubscriptionStatus: data.subscription.status,
              plan: data.subscription.status === 'active' ? 'pro' : 'free',
              updatedAt: new Date().toISOString()
            };

            await set(userRef, updatedData);
            console.log('Updated user data with Stripe info:', {
              plan: updatedData.plan,
              status: updatedData.stripeSubscriptionStatus,
              subscriptionId: updatedData.stripeSubscriptionId
            });

            setIsPro(updatedData.plan === 'pro');
          } else {
            // No active subscription found
            const updatedData = {
              ...userData,
              plan: 'free',
              stripeSubscriptionStatus: null,
              updatedAt: new Date().toISOString()
            };

            if (userData.plan !== 'free') {
              await set(userRef, updatedData);
              console.log('Reset user to free plan');
            }

            setIsPro(false);
          }
        } catch (error) {
          console.error('Error fetching subscription:', error);
          // On error, use existing data from Firebase
          setIsPro(userData.plan === 'pro');
        }

        console.log('Final subscription status:', {
          plan: userData.plan,
          stripeSubscriptionId: userData.stripeSubscriptionId,
          stripeSubscriptionStatus: userData.stripeSubscriptionStatus,
          isPro: userData.plan === 'pro'
        });
      } catch (error) {
        console.error('Error checking pro status:', error);
        setIsPro(false);
      }
    };

    // Check status immediately and set up an interval to check periodically
    checkProStatus();
    const interval = setInterval(checkProStatus, 5000); // Check every 5 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [user?.uid, user?.email, user?.displayName]);

  // Update categories in Firebase
  const updateCategoriesInFirebase = async (newCategories: Category[]) => {
    if (!user?.uid) return;
    
    try {
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      await set(userRef, {
        ...userData,
        categories: newCategories,
        updatedAt: new Date().toISOString()
      });
      console.log('Updated categories in Firebase:', newCategories);
    } catch (error) {
      console.error('Error updating categories:', error);
    }
  };

  // Load categories from Firebase on mount
  useEffect(() => {
    const loadCategories = async () => {
      if (!user?.uid) return;
      
      try {
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();

        if (userData?.categories) {
          // Ensure each category has a subcategories array
          const validatedCategories = userData.categories.map((cat: { name: string; subcategories?: string[] }) => ({
            ...cat,
            subcategories: Array.isArray(cat.subcategories) ? cat.subcategories : []
          }));
          setCategories(validatedCategories);
          console.log('Loaded categories from Firebase:', validatedCategories);
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };

    loadCategories();
  }, [user?.uid]);

  const handleAddCategory = () => {
    if (newCategory && !categories.find(cat => cat.name === newCategory)) {
      const updatedCategories = [...categories, { name: newCategory, subcategories: [] }];
      setCategories(updatedCategories);
      updateCategoriesInFirebase(updatedCategories);
      setNewCategory('');
    }
  };

  const handleDeleteCategory = (categoryName: string) => {
    const updatedCategories = categories.filter(cat => cat.name !== categoryName);
    setCategories(updatedCategories);
    updateCategoriesInFirebase(updatedCategories);
  };

  const handleAddSubcategory = (categoryName: string) => {
    if (!newSubcategory) return;
    
    const updatedCategories = categories.map(cat => {
      if (cat.name === categoryName && !cat.subcategories.includes(newSubcategory)) {
        return {
          ...cat,
          subcategories: [...cat.subcategories, newSubcategory]
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    updateCategoriesInFirebase(updatedCategories);
    setNewSubcategory('');
  };

  const handleDeleteSubcategory = (categoryName: string, subcategory: string) => {
    const updatedCategories = categories.map(cat => {
      if (cat.name === categoryName) {
        return {
          ...cat,
          subcategories: cat.subcategories.filter(sub => sub !== subcategory)
        };
      }
      return cat;
    });

    setCategories(updatedCategories);
    updateCategoriesInFirebase(updatedCategories);
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

      console.log('Starting checkout process...');
      console.log('User:', {
        uid: user.uid,
        email: user.email,
        isAuthenticated: true
      });
      console.log('Price ID:', priceId);
      
      await redirectToCheckout(priceId, user.uid);
    } catch (error) {
      console.error('Error during checkout:', error);
      if (error instanceof Error) {
        console.error('Error details:', error.message);
      }
      alert('Sorry, there was an error initiating the checkout. Please try again later.');
    }
  };

  if (!isPro) {
    return (
      <div className="w-64 min-h-screen flex-shrink-0 border-r border-[#2563eb]/20 p-6 bg-[#0f172a]">
        <div className="space-y-6">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => window.location.href = '/submit'}
                className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 rounded-lg transition-colors text-sm"
              >
                Submit
              </Button>
              <Button
                onClick={() => window.location.href = '/settings'}
                className="flex-1 bg-[#1e293b] hover:bg-[#2e3b4e] text-white py-2 rounded-lg transition-colors text-sm"
              >
                Settings
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">Categories</h2>
            <span className="px-2 py-1 text-xs font-medium bg-gray-600 text-white rounded">Free Plan</span>
          </div>
          <div className="p-4 rounded-lg bg-[#1e293b] border border-[#2563eb]/20">
            <p className="text-sm text-white/70 mb-4">
              Upgrade to Pro to create and manage custom categories for your prompts.
            </p>
            <Button 
              onClick={handleUpgradeClick}
              className="w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 rounded-lg transition-colors text-sm"
            >
              Upgrade to Pro
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-64 min-h-screen flex-shrink-0 border-r border-[#2563eb]/20 p-6 bg-[#0f172a]">
      <div className="space-y-6">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center space-x-4">
            <Button
              onClick={() => window.location.href = '/submit'}
              className="flex-1 bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 rounded-lg transition-colors text-sm"
            >
              Submit
            </Button>
            <Button
              onClick={() => window.location.href = '/settings'}
              className="flex-1 bg-[#1e293b] hover:bg-[#2e3b4e] text-white py-2 rounded-lg transition-colors text-sm"
            >
              Settings
            </Button>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`w-full p-2 rounded-lg transition-colors text-sm ${
              isEditing 
                ? 'bg-[#2563eb] text-white hover:bg-[#1d4ed8]' 
                : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
            }`}
          >
            {isEditing ? 'Done Editing' : 'Edit Categories'}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Categories</h2>
          <span className="px-2 py-1 text-xs font-medium bg-[#2563eb] text-white rounded">Pro Plan</span>
        </div>
        <div className="space-y-4">
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
          <div className="space-y-2">
            <div 
              className={`h-10 flex items-center cursor-pointer p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-sm text-white/70 hover:text-white`}
              onClick={() => onFilterChange('')}
            >
              All Prompts
            </div>
            {categories.map((category) => (
              <div key={category.name} className="space-y-1">
                <div className="relative group">
                  <div 
                    className={`h-10 flex items-center justify-between cursor-pointer p-3 rounded-lg ${
                      isEditing 
                        ? 'bg-[#2563eb]/20 hover:bg-[#2563eb]/30 border border-[#2563eb]/50' 
                        : 'bg-white/5 hover:bg-white/10'
                    } transition-colors text-sm ${
                      isEditing ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                    onClick={() => {
                      if (isEditing) {
                        setEditingCategory(editingCategory === category.name ? null : category.name);
                      } else {
                        setEditingCategory(editingCategory === category.name ? null : category.name);
                        onFilterChange(category.name);
                      }
                    }}
                  >
                    <span>{category.name}</span>
                    {category.subcategories?.length > 0 && (
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
                  {isEditing && (
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
                  <div className="ml-4 space-y-2">
                    {isEditing && (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={newSubcategory}
                          onChange={(e) => setNewSubcategory(e.target.value)}
                          placeholder="Add subcategory"
                          className="h-10 w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                        <Button 
                          onClick={() => handleAddSubcategory(category.name)}
                          className="h-10 w-full bg-[#2563eb] hover:bg-[#1d4ed8] text-white py-2 rounded-lg transition-colors text-sm"
                        >
                          Add Subcategory
                        </Button>
                      </div>
                    )}
                    <div className="space-y-1">
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory} className="relative group">
                          <div 
                            className={`h-10 flex items-center cursor-pointer p-3 rounded-lg ${
                              isEditing 
                                ? 'bg-[#2563eb]/10 hover:bg-[#2563eb]/20 border border-[#2563eb]/30' 
                                : 'bg-white/5 hover:bg-white/10'
                            } text-sm ${
                              isEditing ? 'text-white' : 'text-white/70'
                            } transition-colors cursor-pointer`}
                            onClick={(e) => {
                              e.stopPropagation();
                              onFilterChange(subcategory);
                            }}
                          >
                            {subcategory}
                          </div>
                          {isEditing && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteSubcategory(category.name, subcategory);
                              }}
                              className="absolute -top-1 -right-1 bg-red-500 text-white w-4 h-4 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-xs flex items-center justify-center"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 