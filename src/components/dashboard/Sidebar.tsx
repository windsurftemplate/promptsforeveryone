'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, push, remove, update, get } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { PlusIcon, XMarkIcon, PencilIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, ChevronDownIcon, DocumentIcon, DocumentTextIcon, UserIcon, Squares2X2Icon, ListBulletIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';
import { useDashboard } from '@/contexts/DashboardContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  subcategories?: { [key: string]: { id: string; name: string } };
  isPrivate?: boolean;
}

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { setSelectedCategory, setSelectedSubcategory, selectedCategory, selectedSubcategory, isSidebarCollapsed, setIsSidebarCollapsed, viewMode, setViewMode } = useDashboard();
  const [categories, setCategories] = useState<Category[]>([]);
  const [privateCategories, setPrivateCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{ categoryId: string; itemId: string } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingSubcategory, setAddingSubcategory] = useState<string | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [userStats, setUserStats] = useState({ totalPrompts: 0, publicPrompts: 0 });
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [userPlan, setUserPlan] = useState<string>('Free Plan');

  useEffect(() => {
    if (!user) return;

    // Check user's subscription status
    const userRef = ref(db, `users/${user.uid}`);
    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userData = snapshot.val();
        const isPaid = userData.role === 'admin' || userData.stripeSubscriptionStatus === 'active';
        setIsPaidUser(isPaid);
        setUserPlan(isPaid ? 'Pro Plan' : 'Free Plan');

        // Only fetch private categories if user is paid
        if (isPaid) {
          const privateCategoriesRef = ref(db, `users/${user.uid}/categories`);
          const unsubscribePrivate = onValue(privateCategoriesRef, (snapshot) => {
            if (snapshot.exists()) {
              const data = snapshot.val();
              const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
                id,
                name: category.name,
                subcategories: category.subcategories || {},
                isPrivate: true,
              }));
              setPrivateCategories(categoriesArray);
            } else {
              setPrivateCategories([]);
            }
          });

          return () => unsubscribePrivate();
        } else {
          setPrivateCategories([]);
        }
      }
    });

    // Fetch public categories for all users
    const publicCategoriesRef = ref(db, 'categories');
    const unsubscribePublic = onValue(publicCategoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          name: category.name,
          subcategories: category.subcategories || {},
          isPrivate: false,
        }));
        setCategories(categoriesArray);
      } else {
        setCategories([]);
      }
    });

    return () => unsubscribePublic();
  }, [user]);

  const handleCategoryClick = (categoryId: string, isPrivate: boolean = false) => {
    const category = { id: categoryId, isPrivate };
    
    if (selectedCategory?.id === categoryId) {
      setSelectedCategory(null);
      setSelectedSubcategory(null);
    } else {
      setSelectedCategory(category);
      setSelectedSubcategory(null);
    }
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string, subcategoryName: string, isPrivate: boolean = false) => {
    if (isPrivate && !isPaidUser) {
      return;
    }
    
    setSelectedCategory({ id: categoryId, isPrivate });
    setSelectedSubcategory({ id: subcategoryId, name: subcategoryName });
  };

  const handleAddCategory = async () => {
    if (!user || !newCategoryName.trim()) return;

    const categoriesRef = ref(db, `users/${user.uid}/categories`);
    await push(categoriesRef, {
      name: newCategoryName,
      items: {},
      isPrivate: true // All user-created categories are private
    });
    
    setNewCategoryName('');
    setAddingCategory(false);
  };

  const handleAddSubcategory = async (categoryId: string) => {
    if (!user || !newSubcategoryName.trim()) return;

    const subcategoriesRef = ref(db, `users/${user.uid}/categories/${categoryId}/subcategories`);
    await push(subcategoriesRef, {
      name: newSubcategoryName,
    });
    
    setNewSubcategoryName('');
    setAddingSubcategory(null);
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!user) return;
    
    const categoryRef = ref(db, `users/${user.uid}/categories/${categoryId}`);
    await remove(categoryRef);
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (!user) return;
    
    const subcategoryRef = ref(db, `users/${user.uid}/categories/${categoryId}/subcategories/${subcategoryId}`);
    await remove(subcategoryRef);
  };

  const handleUpdateCategory = async (categoryId: string) => {
    if (!user || !newCategoryName.trim()) return;
    
    const categoryRef = ref(db, `users/${user.uid}/categories/${categoryId}`);
    await update(categoryRef, {
      name: newCategoryName,
    });
    
    setNewCategoryName('');
    setEditingCategory(null);
  };

  const handleUpdateSubcategory = async (categoryId: string, itemId: string) => {
    if (!user || !newSubcategoryName.trim()) return;
    
    const itemRef = ref(db, `users/${user.uid}/categories/${categoryId}/items/${itemId}`);
    await update(itemRef, {
      name: newSubcategoryName,
    });
    
    setNewSubcategoryName('');
    setEditingSubcategory(null);
  };

  const handleViewAllPrompts = () => {
    setSelectedCategory({ id: 'all-prompts', isPrivate: false });
    setSelectedSubcategory(null);
  };

  const toggleCategory = (categoryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleAddSubcategoryToItem = async (categoryId: string, itemId: string, subcategoryName: string) => {
    if (!user || !subcategoryName.trim()) return;

    const subcategoriesRef = ref(db, `users/${user.uid}/categories/${categoryId}/items/${itemId}/subcategories`);
    await push(subcategoriesRef, {
      name: subcategoryName
    });
  };

  const handleDeleteSubcategoryFromItem = async (categoryId: string, itemId: string, subcategoryId: string) => {
    if (!user) return;
    
    const subcategoryRef = ref(db, `users/${user.uid}/categories/${categoryId}/items/${itemId}/subcategories/${subcategoryId}`);
    await remove(subcategoryRef);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className={`relative h-full transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'w-16' : 'w-80'}`}>
      {/* Collapse button - positioned outside the scrollable area */}
      <button
        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="absolute -right-3 top-6 p-1 bg-black border border-[#00ffff]/20 rounded-full hover:border-[#00ffff]/40 transition-colors z-50"
      >
        {isSidebarCollapsed ? (
          <ChevronRightIcon className="h-4 w-4 text-[#00ffff]" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4 text-[#00ffff]" />
        )}
      </button>

      <div className="h-full bg-black/90 backdrop-blur-xl text-white p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#00ffff]/20 scrollbar-track-black/40 border-r border-[#00ffff]/10">
        {!isSidebarCollapsed && (
          <div className="space-y-8 pb-44">
            {/* User Navigation */}
            <div className="space-y-1">
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors text-white/60 hover:text-red-500 hover:bg-red-500/5"
              >
                <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                Logout
              </button>
            </div>

            <div className="border-t border-[#00ffff]/10" />

            <Link href="/submit">
              <button className="w-full px-4 py-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 group hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                <PlusIcon className="h-5 w-5 text-[#00ffff] group-hover:scale-110 transition-transform duration-200" />
                <span className="text-[#00ffff]">Create New Prompt</span>
              </button>
            </Link>

            <div className="space-y-1">
              <button
                onClick={() => handleCategoryClick('all-prompts')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedCategory?.id === 'all-prompts'
                    ? 'bg-[#00ffff]/10 text-[#00ffff]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <DocumentTextIcon className="h-4 w-4" />
                All Prompts
              </button>

              <button
                onClick={() => handleCategoryClick('my-prompts')}
                className={`w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors ${
                  selectedCategory?.id === 'my-prompts'
                    ? 'bg-[#00ffff]/10 text-[#00ffff]'
                    : 'text-white/60 hover:text-white hover:bg-white/5'
                }`}
              >
                <UserIcon className="h-4 w-4" />
                My Prompts
              </button>
            </div>

            {/* Private Categories Section - Only show for paid users */}
            {isPaidUser && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-semibold text-[#00ffff]">Private Categories</h2>
                    {!isSidebarCollapsed && (
                      <button
                        onClick={() => setIsEditMode(!isEditMode)}
                        className="p-1.5 hover:bg-[#00ffff]/10 rounded-lg transition-all duration-200"
                        title={isEditMode ? "Exit edit mode" : "Enter edit mode"}
                      >
                        {isEditMode ? (
                          <XMarkIcon className="h-4 w-4 text-[#00ffff]" />
                        ) : (
                          <PencilIcon className="h-4 w-4 text-[#00ffff]" />
                        )}
                      </button>
                    )}
                  </div>
                  {isEditMode && (
                    <button
                      onClick={() => setAddingCategory(true)}
                      className="p-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 rounded-full transition-all duration-200 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                      title="Add new category"
                    >
                      <PlusIcon className="h-5 w-5 text-[#00ffff]" />
                    </button>
                  )}
                </div>

                {/* Private Categories List */}
                <div className="space-y-4">
                  {privateCategories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center justify-between group">
                        <div className="flex-1 flex items-center">
                          <button
                            onClick={(e) => {
                              toggleCategory(category.id, e);
                              handleCategoryClick(category.id, true);
                            }}
                            className={`flex-1 text-left px-3 py-2 rounded-lg transition-all duration-200 ${
                              selectedCategory?.id === category.id
                                ? 'bg-[#00ffff]/30 text-white'
                                : 'bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff]'
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <ChevronDownIcon
                                className={`h-4 w-4 text-[#00ffff] transition-transform ${
                                  expandedCategories.includes(category.id) ? 'transform rotate-180' : ''
                                }`}
                              />
                              {editingCategory === category.id ? (
                                <input
                                  type="text"
                                  value={newCategoryName}
                                  onChange={(e) => setNewCategoryName(e.target.value)}
                                  className="w-full bg-black/60 text-white px-2 py-1 rounded border border-[#00ffff]/20 focus:border-[#00ffff]/40 focus:outline-none"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                category.name
                              )}
                            </div>
                          </button>
                        </div>
                        {isEditMode && (
                          <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {editingCategory === category.id ? (
                              <>
                                <button
                                  onClick={() => handleUpdateCategory(category.id)}
                                  className="p-1 hover:bg-[#00ffff]/10 rounded transition-colors"
                                >
                                  <CheckIcon className="h-4 w-4 text-[#00ffff]" />
                                </button>
                                <button
                                  onClick={() => {
                                    setEditingCategory(null);
                                    setNewCategoryName('');
                                  }}
                                  className="p-1 hover:bg-[#00ffff]/10 rounded transition-colors"
                                >
                                  <XMarkIcon className="h-4 w-4 text-[#00ffff]" />
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditingCategory(category.id);
                                    setNewCategoryName(category.name);
                                  }}
                                  className="p-1 hover:bg-[#00ffff]/10 rounded transition-colors"
                                >
                                  <PencilIcon className="h-4 w-4 text-[#00ffff]" />
                                </button>
                                <button
                                  onClick={() => handleDeleteCategory(category.id)}
                                  className="p-1 hover:bg-[#00ffff]/10 rounded transition-colors"
                                >
                                  <TrashIcon className="h-4 w-4 text-[#00ffff]" />
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Subcategories */}
                      {expandedCategories.includes(category.id) && (
                        <div className="pl-4 space-y-1">
                          {category.subcategories && Object.entries(category.subcategories).map(([subcategoryId, subcategory]) => (
                            <div key={subcategoryId} className="flex items-center justify-between group">
                              <button
                                onClick={() => handleSubcategoryClick(category.id, subcategoryId, subcategory.name, true)}
                                className={`flex-1 text-left px-3 py-1.5 rounded-lg transition-all duration-200 ${
                                  selectedCategory?.id === category.id && selectedSubcategory?.id === subcategoryId
                                    ? 'bg-[#00ffff]/30 text-white'
                                    : 'bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff]'
                                }`}
                              >
                                {editingSubcategory?.categoryId === category.id && editingSubcategory?.itemId === subcategoryId ? (
                                  <input
                                    type="text"
                                    value={newSubcategoryName}
                                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                                    className="w-full bg-black/60 text-white px-2 py-1 rounded border border-[#00ffff]/20 focus:border-[#00ffff]/40 focus:outline-none"
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                ) : (
                                  subcategory.name
                                )}
                              </button>
                              {isEditMode && (
                                <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {editingSubcategory?.categoryId === category.id && editingSubcategory?.itemId === subcategoryId ? (
                                    <>
                                      <button
                                        onClick={() => handleUpdateSubcategory(category.id, subcategoryId)}
                                        className="p-1 hover:bg-[#00ffff]/10 rounded transition-colors"
                                      >
                                        <CheckIcon className="h-4 w-4 text-[#00ffff]" />
                                      </button>
                                      <button
                                        onClick={() => {
                                          setEditingSubcategory(null);
                                          setNewSubcategoryName('');
                                        }}
                                        className="p-1 hover:bg-[#00ffff]/10 rounded transition-colors"
                                      >
                                        <XMarkIcon className="h-4 w-4 text-[#00ffff]" />
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button
                                        onClick={() => {
                                          setEditingSubcategory({ categoryId: category.id, itemId: subcategoryId });
                                          setNewSubcategoryName(subcategory.name);
                                        }}
                                        className="p-1 hover:bg-[#00ffff]/10 rounded transition-colors"
                                      >
                                        <PencilIcon className="h-4 w-4 text-[#00ffff]" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteSubcategory(category.id, subcategoryId)}
                                        className="p-1 hover:bg-[#00ffff]/10 rounded transition-colors"
                                      >
                                        <TrashIcon className="h-4 w-4 text-[#00ffff]" />
                                      </button>
                                    </>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                          {isEditMode && addingSubcategory === category.id && (
                            <div className="pl-3 pr-2 py-2 bg-[#00ffff]/5 backdrop-blur-xl rounded-lg border border-[#00ffff]/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                              <input
                                type="text"
                                value={newSubcategoryName}
                                onChange={(e) => setNewSubcategoryName(e.target.value)}
                                placeholder="Subcategory name"
                                className="w-full bg-black/60 text-white px-2 py-1 rounded border border-[#00ffff]/20 focus:border-[#00ffff]/40 focus:outline-none mb-2 transition-all duration-200 focus:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                              />
                              <div className="flex justify-end space-x-2">
                                <button
                                  onClick={() => handleAddSubcategory(category.id)}
                                  className="px-2 py-1 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 rounded transition-all duration-200 text-[#00ffff] text-sm hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => {
                                    setNewSubcategoryName('');
                                    setAddingSubcategory(null);
                                  }}
                                  className="px-2 py-1 bg-black/60 hover:bg-black/40 rounded transition-all duration-200 text-white/60 text-sm hover:shadow-[0_0_10px_rgba(0,0,0,0.2)]"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                          {isEditMode && addingSubcategory !== category.id && (
                            <button
                              onClick={() => setAddingSubcategory(category.id)}
                              className="w-full px-3 py-1.5 text-left text-white/40 hover:text-white/60 hover:bg-[#00ffff]/10 rounded-lg transition-all duration-200 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] text-sm flex items-center gap-2"
                            >
                              <PlusIcon className="h-4 w-4" />
                              Add subcategory
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Public Categories Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#00ffff]">Public Categories</h2>
              </div>

              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          toggleCategory(category.id, e);
                          handleCategoryClick(category.id, category.isPrivate);
                        }}
                        className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors ${
                          selectedCategory?.id === category.id
                            ? 'bg-[#00ffff]/30 text-white'
                            : 'bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff]'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <ChevronDownIcon
                            className={`h-4 w-4 text-[#00ffff] transition-transform ${
                              expandedCategories.includes(category.id) ? 'transform rotate-180' : ''
                            }`}
                          />
                          {category.name}
                        </div>
                      </button>
                    </div>

                    {/* Subcategories */}
                    {expandedCategories.includes(category.id) && (
                      <div className="pl-4 space-y-1">
                        {category.subcategories && Object.entries(category.subcategories).map(([subcategoryId, subcategory]) => (
                          <div key={subcategoryId} className="flex items-center justify-between">
                            <button
                              onClick={() => handleSubcategoryClick(category.id, subcategoryId, subcategory.name, category.isPrivate)}
                              className={`flex-1 text-left px-3 py-1.5 rounded-lg transition-all duration-200 ${
                                selectedCategory?.id === category.id && selectedSubcategory?.id === subcategoryId
                                  ? 'bg-[#00ffff]/30 text-white'
                                  : 'bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff]'
                              }`}
                            >
                              {subcategory.name}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 