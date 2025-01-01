'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { PlusIcon, XMarkIcon, PencilIcon, CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useDashboard } from '@/contexts/DashboardContext';

interface Category {
  id: string;
  name: string;
  items: { id: string; name: string }[];
  isPrivate?: boolean;
}

export default function Sidebar() {
  const { user } = useAuth();
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

  useEffect(() => {
    if (!user) return;

    // Fetch public categories
    const publicCategoriesRef = ref(db, 'categories');
    const unsubscribePublic = onValue(publicCategoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          name: category.name,
          items: Object.entries(category.items || {}).map(([itemId, item]: [string, any]) => ({
            id: itemId,
            name: item.name,
          })),
          }));
          setCategories(categoriesArray);
        }
      });

    // Fetch private categories
    const privateCategoriesRef = ref(db, `users/${user.uid}/categories`);
    const unsubscribePrivate = onValue(privateCategoriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          name: category.name,
          items: Object.entries(category.items || {}).map(([itemId, item]: [string, any]) => ({
            id: itemId,
            name: item.name,
          })),
          isPrivate: true,
        }));
        setPrivateCategories(categoriesArray);
      }
    });

    return () => {
      unsubscribePublic();
      unsubscribePrivate();
    };
  }, [user]);

  const handleCategoryClick = (categoryId: string, isPrivate: boolean = false) => {
    setSelectedCategory({ id: categoryId, isPrivate });
    setSelectedSubcategory(null);
  };

  const handleSubcategoryClick = (categoryId: string, subcategoryId: string, isPrivate: boolean = false) => {
    setSelectedCategory({ id: categoryId, isPrivate });
    setSelectedSubcategory({ id: subcategoryId });
  };

  const handleAddCategory = async () => {
    if (!user || !newCategoryName.trim()) return;

      const categoriesRef = ref(db, `users/${user.uid}/categories`);
    await push(categoriesRef, {
      name: newCategoryName,
      items: {},
    });
    
    setNewCategoryName('');
    setAddingCategory(false);
  };

  const handleAddSubcategory = async (categoryId: string) => {
    if (!user || !newSubcategoryName.trim()) return;

      const itemsRef = ref(db, `users/${user.uid}/categories/${categoryId}/items`);
    await push(itemsRef, {
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

  const handleDeleteSubcategory = async (categoryId: string, itemId: string) => {
    if (!user) return;
    
    const itemRef = ref(db, `users/${user.uid}/categories/${categoryId}/items/${itemId}`);
    await remove(itemRef);
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

  return (
    <div className={`relative h-full transition-all duration-300 ease-in-out ${isCollapsed ? 'w-16' : 'w-80'}`}>
      <div className="h-full bg-black text-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-[#00ffff]/20 scrollbar-track-black/40 border-r border-[#00ffff]/10">
        {/* Toggle button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-8 p-2 bg-black rounded-full border border-[#00ffff]/20 hover:border-[#00ffff]/40 transition-colors z-50"
        >
          {isCollapsed ? (
            <ChevronRightIcon className="h-4 w-4 text-[#00ffff]" />
          ) : (
            <ChevronLeftIcon className="h-4 w-4 text-[#00ffff]" />
          )}
        </button>

        {!isCollapsed && (
          <>
            {/* Private Categories Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-[#00ffff]">Private Categories</h2>
                  <button
                    onClick={() => setIsEditMode(!isEditMode)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isEditMode 
                        ? 'bg-[#00ffff]/20 text-[#00ffff]' 
                        : 'text-white/60 hover:bg-[#00ffff]/10 hover:text-[#00ffff]'
                    }`}
                    title={isEditMode ? 'Exit edit mode' : 'Enter edit mode'}
                  >
                    <PencilIcon className="h-4 w-4" />
                  </button>
                </div>
                {isEditMode && (
                  <button
                    onClick={() => setAddingCategory(true)}
                    className="p-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 rounded-full transition-colors"
                    title="Add new category"
                  >
                    <PlusIcon className="h-5 w-5 text-[#00ffff]" />
                  </button>
                )}
              </div>

              {addingCategory && (
                <div className="mb-4 p-3 bg-[#00ffff]/5 rounded-xl border border-[#00ffff]/20">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="w-full bg-black/60 text-white px-3 py-2 rounded-lg border border-[#00ffff]/20 focus:border-[#00ffff]/40 focus:outline-none mb-2"
                  />
                  <div className="flex justify-end space-x-2">
                    <button
                      onClick={handleAddCategory}
                      className="px-3 py-1 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 rounded-lg transition-colors text-[#00ffff] text-sm"
                    >
                      Add
                    </button>
                    <button
                      onClick={() => {
                        setAddingCategory(false);
                        setNewCategoryName('');
                      }}
                      className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-500 text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {privateCategories.map((category) => (
                <div key={category.id} className="mb-4 bg-[#00ffff]/5 rounded-xl p-3 border border-[#00ffff]/20">
                  <div className="flex items-center justify-between mb-3">
                    {editingCategory === category.id ? (
                      <div className="w-full">
                        <input
                          type="text"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          placeholder="Category name"
                          className="w-full bg-black/60 text-white px-3 py-2 rounded-lg border border-[#00ffff]/20 focus:border-[#00ffff]/40 focus:outline-none mb-2"
                        />
                        <div className="flex justify-end space-x-2">
                          <button
                            onClick={() => handleUpdateCategory(category.id)}
                            className="px-3 py-1 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 rounded-lg transition-colors text-[#00ffff] text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => {
                              setEditingCategory(null);
                              setNewCategoryName('');
                            }}
                            className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-500 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => handleCategoryClick(category.id, true)}
                          className={`font-medium hover:text-[#00ffff] transition-colors ${
                            selectedCategory?.id === category.id ? 'text-[#00ffff]' : 'text-white/80'
                          }`}
                        >
                          {category.name}
                        </button>
                        {isEditMode && (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => {
                                setEditingCategory(category.id);
                                setNewCategoryName(category.name);
                              }}
                              className="p-1.5 hover:bg-[#00ffff]/10 rounded-lg transition-colors"
                              title="Edit category"
                            >
                              <PencilIcon className="h-4 w-4 text-[#00ffff]" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(category.id)}
                              className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Delete category"
                            >
                              <XMarkIcon className="h-4 w-4 text-red-500" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <div key={item.id} 
                        className={`p-2 rounded-lg transition-colors ${
                          selectedCategory?.id === category.id && selectedSubcategory?.id === item.id
                            ? 'bg-[#00ffff]/10'
                            : 'hover:bg-[#00ffff]/5'
                        }`}
                      >
                        {editingSubcategory?.categoryId === category.id && 
                          editingSubcategory?.itemId === item.id ? (
                          <div className="w-full">
                            <input
                              type="text"
                              value={newSubcategoryName}
                              onChange={(e) => setNewSubcategoryName(e.target.value)}
                              placeholder="Subcategory name"
                              className="w-full bg-black/60 text-white px-3 py-2 rounded-lg border border-[#00ffff]/20 focus:border-[#00ffff]/40 focus:outline-none mb-2"
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleUpdateSubcategory(category.id, item.id)}
                                className="px-3 py-1 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 rounded-lg transition-colors text-[#00ffff] text-sm"
                              >
                                Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSubcategory(null);
                                  setNewSubcategoryName('');
                                }}
                                className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-500 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between group">
                            <button
                              onClick={() => handleSubcategoryClick(category.id, item.id, true)}
                              className={`text-sm hover:text-[#00ffff] transition-colors ${
                                selectedCategory?.id === category.id && selectedSubcategory?.id === item.id
                                  ? 'text-[#00ffff]'
                                  : 'text-white/60'
                              }`}
                            >
                              {item.name}
                            </button>
                            {isEditMode && (
                              <div className="flex items-center space-x-1">
                                <button
                                  onClick={() => {
                                    setEditingSubcategory({
                                      categoryId: category.id,
                                      itemId: item.id,
                                    });
                                    setNewSubcategoryName(item.name);
                                  }}
                                  className="p-1.5 hover:bg-[#00ffff]/10 rounded-lg transition-colors"
                                  title="Edit subcategory"
                                >
                                  <PencilIcon className="h-3.5 w-3.5 text-[#00ffff]" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSubcategory(category.id, item.id)}
                                  className="p-1.5 hover:bg-red-500/10 rounded-lg transition-colors"
                                  title="Delete subcategory"
                                >
                                  <XMarkIcon className="h-3.5 w-3.5 text-red-500" />
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}

                    {isEditMode && (
                      <>
                        {addingSubcategory === category.id && (
                          <div className="p-2 bg-[#00ffff]/5 rounded-lg">
                            <input
                              type="text"
                              value={newSubcategoryName}
                              onChange={(e) => setNewSubcategoryName(e.target.value)}
                              placeholder="New subcategory"
                              className="w-full bg-black/60 text-white px-3 py-2 rounded-lg border border-[#00ffff]/20 focus:border-[#00ffff]/40 focus:outline-none mb-2"
                            />
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleAddSubcategory(category.id)}
                                className="px-3 py-1 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 rounded-lg transition-colors text-[#00ffff] text-sm"
                              >
                                Add
                              </button>
                              <button
                                onClick={() => {
                                  setAddingSubcategory(null);
                                  setNewSubcategoryName('');
                                }}
                                className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-500 text-sm"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}

                        <button
                          onClick={() => setAddingSubcategory(category.id)}
                          className="w-full text-sm text-white/60 hover:text-[#00ffff] flex items-center justify-center space-x-1 p-2 rounded-lg hover:bg-[#00ffff]/5 transition-colors"
                        >
                          <PlusIcon className="h-4 w-4" />
                          <span>Add subcategory</span>
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Public Categories Section */}
            <div>
              <h2 className="text-lg font-semibold text-[#00ffff] mb-4">Public Categories</h2>
              {categories.map((category) => (
                <div key={category.id} className="mb-4 bg-[#00ffff]/5 rounded-xl p-3 border border-[#00ffff]/20">
                  <button
                    onClick={() => handleCategoryClick(category.id)}
                    className={`font-medium hover:text-[#00ffff] transition-colors mb-3 ${
                      selectedCategory?.id === category.id ? 'text-[#00ffff]' : 'text-white/80'
                    }`}
                  >
                    {category.name}
                  </button>
                  <div className="space-y-2">
                    {category.items.map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleSubcategoryClick(category.id, item.id)}
                        className={`block w-full text-left text-sm p-2 rounded-lg transition-colors ${
                          selectedCategory?.id === category.id && selectedSubcategory?.id === item.id
                            ? 'bg-[#00ffff]/10 text-[#00ffff]'
                            : 'text-white/60 hover:bg-[#00ffff]/5 hover:text-[#00ffff]'
                        }`}
                      >
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Collapsed view */}
        {isCollapsed && (
          <div className="flex flex-col items-center space-y-4">
            <button
              onClick={() => setAddingCategory(true)}
              className="p-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 rounded-full transition-colors"
              title="Add new category"
            >
              <PlusIcon className="h-5 w-5 text-[#00ffff]" />
            </button>
            {privateCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id, true)}
                className={`p-2 rounded-full transition-colors ${
                  selectedCategory?.id === category.id 
                    ? 'bg-[#00ffff]/20 text-[#00ffff]' 
                    : 'bg-[#00ffff]/5 text-white/80 hover:bg-[#00ffff]/10'
                }`}
                title={category.name}
              >
                {category.name.charAt(0).toUpperCase()}
              </button>
            ))}
            <div className="w-full border-t border-[#00ffff]/10 my-2"></div>
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`p-2 rounded-full transition-colors ${
                  selectedCategory?.id === category.id 
                    ? 'bg-[#00ffff]/20 text-[#00ffff]' 
                    : 'bg-[#00ffff]/5 text-white/80 hover:bg-[#00ffff]/10'
                }`}
                title={category.name}
              >
                {category.name.charAt(0).toUpperCase()}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 