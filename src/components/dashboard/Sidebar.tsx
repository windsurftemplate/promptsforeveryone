'use client';

import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { ref, onValue, push, remove, update } from 'firebase/database';
import { useAuth } from '@/contexts/AuthContext';
import { PlusIcon, XMarkIcon, PencilIcon, CheckIcon } from '@heroicons/react/24/outline';
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
    <div className="h-full w-64 bg-gray-900 text-white p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      {/* Private Categories Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Private Categories</h2>
          <button
            onClick={() => setAddingCategory(true)}
            className="p-1 hover:bg-gray-700 rounded-full"
          >
            <PlusIcon className="h-5 w-5" />
          </button>
        </div>

        {addingCategory && (
          <div className="flex items-center mb-4 space-x-2">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Category name"
              className="bg-gray-800 text-white px-2 py-1 rounded flex-1"
            />
            <button
              onClick={handleAddCategory}
              className="p-1 hover:bg-gray-700 rounded-full"
            >
              <CheckIcon className="h-5 w-5 text-green-500" />
            </button>
            <button
              onClick={() => {
                setAddingCategory(false);
                setNewCategoryName('');
              }}
              className="p-1 hover:bg-gray-700 rounded-full"
            >
              <XMarkIcon className="h-5 w-5 text-red-500" />
              </button>
          </div>
        )}

        {privateCategories.map((category) => (
          <div key={category.id} className="mb-4">
            <div className="flex items-center justify-between mb-2">
              {editingCategory === category.id ? (
                <div className="flex items-center space-x-2 flex-1">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Category name"
                    className="bg-gray-800 text-white px-2 py-1 rounded flex-1"
                  />
                  <button
                    onClick={() => handleUpdateCategory(category.id)}
                    className="p-1 hover:bg-gray-700 rounded-full"
                  >
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </button>
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setNewCategoryName('');
                    }}
                    className="p-1 hover:bg-gray-700 rounded-full"
                  >
                    <XMarkIcon className="h-5 w-5 text-red-500" />
                  </button>
                    </div>
              ) : (
                <>
                  <button
                    onClick={() => handleCategoryClick(category.id, true)}
                    className={`font-medium hover:text-cyan-400 transition-colors ${
                      selectedCategory?.id === category.id ? 'text-cyan-400' : ''
                    }`}
                  >
                    {category.name}
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingCategory(category.id);
                        setNewCategoryName(category.name);
                      }}
                      className="p-1 hover:bg-gray-700 rounded-full"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 hover:bg-gray-700 rounded-full"
                    >
                      <XMarkIcon className="h-4 w-4 text-red-500" />
                    </button>
                  </div>
                </>
              )}
            </div>

            <div className="ml-4 space-y-2">
              {category.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  {editingSubcategory?.categoryId === category.id && 
                    editingSubcategory?.itemId === item.id ? (
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="text"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        placeholder="Subcategory name"
                        className="bg-gray-800 text-white px-2 py-1 rounded flex-1"
                      />
                      <button
                        onClick={() => handleUpdateSubcategory(category.id, item.id)}
                        className="p-1 hover:bg-gray-700 rounded-full"
                      >
                        <CheckIcon className="h-4 w-4 text-green-500" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingSubcategory(null);
                          setNewSubcategoryName('');
                        }}
                        className="p-1 hover:bg-gray-700 rounded-full"
                      >
                        <XMarkIcon className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => handleSubcategoryClick(category.id, item.id, true)}
                        className={`text-sm hover:text-cyan-400 transition-colors ${
                          selectedCategory?.id === category.id && selectedSubcategory?.id === item.id
                            ? 'text-cyan-400'
                            : 'text-gray-300'
                        }`}
                      >
                        {item.name}
                      </button>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {
                            setEditingSubcategory({
                              categoryId: category.id,
                              itemId: item.id,
                            });
                            setNewSubcategoryName(item.name);
                          }}
                          className="p-1 hover:bg-gray-700 rounded-full"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubcategory(category.id, item.id)}
                          className="p-1 hover:bg-gray-700 rounded-full"
                        >
                          <XMarkIcon className="h-4 w-4 text-red-500" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}

              {addingSubcategory === category.id && (
                <div className="flex items-center space-x-2">
                <input
                  type="text"
                    value={newSubcategoryName}
                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                    placeholder="New subcategory"
                    className="bg-gray-800 text-white px-2 py-1 rounded flex-1"
                  />
                  <button
                    onClick={() => handleAddSubcategory(category.id)}
                    className="p-1 hover:bg-gray-700 rounded-full"
                  >
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  </button>
                  <button
                    onClick={() => {
                      setAddingSubcategory(null);
                      setNewSubcategoryName('');
                    }}
                    className="p-1 hover:bg-gray-700 rounded-full"
                  >
                    <XMarkIcon className="h-4 w-4 text-red-500" />
                  </button>
              </div>
            )}

              <button
                onClick={() => setAddingSubcategory(category.id)}
                className="text-sm text-gray-400 hover:text-white flex items-center space-x-1"
              >
                <PlusIcon className="h-4 w-4" />
                <span>Add subcategory</span>
              </button>
            </div>
        </div>
        ))}
      </div>

      {/* Public Categories Section */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Public Categories</h2>
        {categories.map((category) => (
          <div key={category.id} className="mb-4">
            <button
              onClick={() => handleCategoryClick(category.id)}
              className={`font-medium hover:text-cyan-400 transition-colors mb-2 ${
                selectedCategory?.id === category.id ? 'text-cyan-400' : ''
              }`}
            >
              {category.name}
          </button>
            <div className="ml-4 space-y-2">
              {category.items.map((item) => (
        <button
                  key={item.id}
                  onClick={() => handleSubcategoryClick(category.id, item.id)}
                  className={`block text-sm hover:text-cyan-400 transition-colors ${
                    selectedCategory?.id === category.id && selectedSubcategory?.id === item.id
                      ? 'text-cyan-400'
                      : 'text-gray-300'
                  }`}
                >
                  {item.name}
        </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 