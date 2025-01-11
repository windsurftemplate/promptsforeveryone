'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, push, remove, update, get } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { PlusIcon, XMarkIcon, PencilIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon, TrashIcon, ChevronDownIcon, DocumentIcon } from '@heroicons/react/24/outline';
import { useDashboard } from '@/contexts/DashboardContext';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  subcategories?: { [key: string]: { name: string } };
  isPrivate?: boolean;
}

export default function Sidebar() {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { setSelectedCategory, setSelectedSubcategory, selectedCategory, selectedSubcategory } = useDashboard();
  const [categories, setCategories] = useState<Category[]>([]);
  const [privateCategories, setPrivateCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<{ categoryId: string; itemId: string } | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingSubcategory, setAddingSubcategory] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPaidUser, setIsPaidUser] = useState(false);
  const [userStats, setUserStats] = useState({ totalPrompts: 0, publicPrompts: 0 });
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [userPlan, setUserPlan] = useState<string>('Free Plan');
  const [userData, setUserData] = useState<{ name?: string; plan?: string }>({});

  useEffect(() => {
    if (!user) return;

    // Fetch user data including name, plan, and paid status
    const userDataRef = ref(db, `users/${user.uid}`);
    const unsubscribeUser = onValue(userDataRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setUserData({
          name: data.name || user.displayName || user.email?.split('@')[0],
          plan: data.plan === 'paid' ? 'Premium Plan' : 'Free Plan'
        });
        setIsPaidUser(data.role === 'admin' || data.plan === 'paid');
        setUserPlan(data.plan === 'paid' ? 'Premium Plan' : 'Free Plan');
      }
    });

    // Fetch public categories
    const publicCategoriesRef = ref(db, 'categories');
    const unsubscribePublic = onValue(publicCategoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          name: category.name,
          subcategories: category.subcategories || {}
        }));
        setCategories(categoriesArray);
      } else {
        setCategories([]);
      }
    });

    // Fetch private categories
    const privateCategoriesRef = ref(db, `users/${user.uid}/categories`);
    const unsubscribePrivate = onValue(privateCategoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          name: category.name,
          subcategories: category.subcategories || {},
          isPrivate: true
        }));
        setPrivateCategories(categoriesArray);
      } else {
        setPrivateCategories([]);
      }
    });

    // Fetch user stats
    const userPromptsRef = ref(db, `users/${user.uid}/prompts`);
    const publicPromptsRef = ref(db, 'prompts');

    const fetchStats = async () => {
      onValue(userPromptsRef, (snapshot) => {
        const totalPrompts = snapshot.exists() ? Object.keys(snapshot.val()).length : 0;
        setUserStats(prev => ({ ...prev, totalPrompts }));
      });

      onValue(publicPromptsRef, (snapshot) => {
        if (snapshot.exists()) {
          const publicPrompts = Object.values(snapshot.val()).filter((prompt: any) => prompt.userId === user.uid).length;
          setUserStats(prev => ({ ...prev, publicPrompts }));
        }
      });
    };

    fetchStats();

    return () => {
      unsubscribePublic();
      unsubscribePrivate();
      unsubscribeUser();
    };
  }, [user]);

  const handleCategoryClick = (categoryId: string, isPrivate: boolean = false) => {
    // If trying to access private category without being paid user
    if (isPrivate && !isPaidUser) {
      return;
    }
    setSelectedCategory({ id: categoryId, isPrivate });
    setSelectedSubcategory(null);
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string, isPrivate: boolean = false) => {
    // If trying to access private subcategory without being paid user
    if (isPrivate && !isPaidUser) {
      return;
    }
    setSelectedCategory({ id: categoryId, isPrivate });
    setSelectedSubcategory({ id: subcategoryId });
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
        ? []  // Close all dropdowns
        : [categoryId]  // Only open the clicked category
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

  return (
    <div className={`relative h-full transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-80'}`}>
      <div className="h-full bg-black/90 backdrop-blur-xl text-white p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-[#00ffff]/20 scrollbar-track-black/40 border-r border-[#00ffff]/10">
        {/* Profile Section */}
        {!isCollapsed && user && (
          <div className="mb-6 p-4 bg-black/40 rounded-lg border border-[#00ffff]/10">
            <div className="flex items-center space-x-3">
              {user.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-10 h-10 rounded-full" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#00ffff]/10 flex items-center justify-center">
                  <span className="text-[#00ffff] text-lg">
                    {userData.name?.[0] || user.email?.[0] || '?'}
                  </span>
                </div>
              )}
              <div>
                <h3 className="text-white font-medium">
                  {userData.name || user.email?.split('@')[0]}
                </h3>
                <p className="text-[#00ffff] text-sm">{userData.plan}</p>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-[#00ffff]/10 rounded-lg transition-all duration-200 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
          >
            {isCollapsed ? (
              <ChevronRightIcon className="h-5 w-5 text-[#00ffff]" />
            ) : (
              <ChevronLeftIcon className="h-5 w-5 text-[#00ffff]" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="space-y-8">
            <Link href="/submit">
              <button className="w-full px-4 py-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 group hover:shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                <PlusIcon className="h-5 w-5 text-[#00ffff] group-hover:scale-110 transition-transform duration-200" />
                <span className="text-[#00ffff]">Create New Prompt</span>
              </button>
            </Link>

            <button
              onClick={handleViewAllPrompts}
              className={`w-full px-4 py-3 rounded-lg text-left transition-all duration-200 flex items-center gap-3 ${
                selectedCategory?.id === 'all-prompts'
                  ? 'bg-[#00ffff]/30 text-white'
                  : 'bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff]'
              }`}
            >
              <div className="flex items-center gap-2">
                <DocumentIcon className="h-4 w-4" />
                View All Prompts
              </div>
            </button>

            {/* Private Categories Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-[#00ffff]">Private Categories</h2>
                  {!isCollapsed && (
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
                  {!isPaidUser && (
                    <span className="px-2 py-0.5 text-xs bg-[#00ffff]/10 text-[#00ffff] rounded-full border border-[#00ffff]/20 shadow-[0_0_10px_rgba(0,255,255,0.1)]">
                      PRO
                    </span>
                  )}
                </div>
                {isPaidUser && isEditMode && (
                  <button
                    onClick={() => setAddingCategory(true)}
                    className="p-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 rounded-full transition-all duration-200 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)]"
                    title="Add new category"
                  >
                    <PlusIcon className="h-5 w-5 text-[#00ffff]" />
                  </button>
                )}
              </div>

              {!isPaidUser ? (
                <div className="p-4 bg-[#00ffff]/5 backdrop-blur-xl rounded-xl border border-[#00ffff]/20 shadow-[0_0_15px_rgba(0,255,255,0.1)]">
                  <p className="text-white/60 text-sm mb-3">
                    Upgrade to Pro to create private categories and organize your prompts.
                  </p>
                  <Link href="/price">
                    <button className="w-full px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg transition-all duration-200 hover:shadow-[0_0_10px_rgba(0,255,255,0.2)] text-sm">
                      Upgrade to Pro
                    </button>
                  </Link>
                </div>
              ) : (
                <>
                  {addingCategory && (
                    <div className="mb-4 p-3 bg-[#00ffff]/5 backdrop-blur-xl rounded-xl border border-[#00ffff]/20 shadow-lg shadow-black/20">
                      <input
                        type="text"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        placeholder="Category name"
                        className="w-full bg-black/60 text-white px-3 py-2 rounded-lg border border-[#00ffff]/20 focus:border-[#00ffff]/40 focus:outline-none mb-2 transition-colors duration-200"
                      />
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={handleAddCategory}
                          className="px-3 py-1 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 rounded-lg transition-all duration-200 text-[#00ffff] text-sm hover:shadow-lg hover:shadow-[#00ffff]/20"
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setNewCategoryName('');
                            setAddingCategory(false);
                          }}
                          className="px-3 py-1 bg-black/60 hover:bg-black/40 rounded-lg transition-all duration-200 text-white/60 text-sm hover:shadow-lg hover:shadow-black/20"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

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
                                  onClick={() => handleSubcategoryClick(category.id, subcategoryId, true)}
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
                </>
              )}
            </div>

            {/* Public Categories Section */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-[#00ffff]">Public Categories</h2>
              </div>

              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 flex items-center">
                        <button
                          onClick={(e) => {
                            toggleCategory(category.id, e);
                            handleCategoryClick(category.id, false);
                          }}
                          className={`flex-1 text-left px-3 py-2 rounded-lg transition-colors ${
                            selectedCategory?.id === category.id && !selectedCategory?.isPrivate
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
                    </div>

                    {/* Public Subcategories */}
                    {expandedCategories.includes(category.id) && (
                      <div className="pl-4 space-y-1">
                        {category.subcategories && Object.entries(category.subcategories).map(([subcategoryId, subcategory]) => (
                          <div key={subcategoryId} className="flex items-center justify-between">
                            <button
                              onClick={() => handleSubcategoryClick(category.id, subcategoryId, false)}
                              className={`flex-1 text-left px-3 py-1.5 rounded-lg transition-all duration-200 ${
                                selectedCategory?.id === category.id && 
                                selectedSubcategory?.id === subcategoryId && 
                                !selectedCategory?.isPrivate
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