'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, get, onValue, remove, update, push } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/Button';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface User {
  uid: string;
  email: string;
  role?: string;
  createdAt?: string;
  lastLogin?: string;
  promptCount?: number;
}

interface BlogPost {
  id: string;
  title: string;
  date: string;
  readTime: string;
  summary: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  subcategories?: {
    [key: string]: {
      name: string;
      description?: string;
    };
  };
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'blog' | 'categories'>('users');
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    // Check if current user is admin
    const checkAdmin = async () => {
      const adminRef = ref(db, `users/${user.uid}/role`);
      const snapshot = await get(adminRef);
      if (!snapshot.exists() || snapshot.val() !== 'admin') {
        router.push('/dashboard');
      }
    };

    checkAdmin();

    // Fetch all users
    const usersRef = ref(db, 'users');
    const unsubscribeUsers = onValue(usersRef, async (snapshot) => {
      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = await Promise.all(
          Object.entries(usersData).map(async ([uid, userData]: [string, any]) => {
            // Get prompt count for each user
            const promptsRef = ref(db, `users/${uid}/prompts`);
            const promptsSnapshot = await get(promptsRef);
            const promptCount = promptsSnapshot.exists() ? Object.keys(promptsSnapshot.val()).length : 0;

            return {
              uid,
              email: userData.email,
              role: userData.role || 'user',
              createdAt: userData.createdAt,
              lastLogin: userData.lastLogin,
              promptCount,
            };
          })
        );
        setUsers(usersArray);
      }
      setIsLoading(false);
    });

    // Fetch all blog posts
    const blogRef = ref(db, 'blog');
    const unsubscribeBlog = onValue(blogRef, (snapshot) => {
      if (snapshot.exists()) {
        const blogData = snapshot.val();
        const blogArray = Object.entries(blogData).map(([id, post]: [string, any]) => ({
          id,
          ...post,
        }));
        setBlogPosts(blogArray);
      }
    });

    // Fetch categories
    const categoriesRef = ref(db, 'categories');
    const unsubscribe = onValue(categoriesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const categoriesArray = Object.entries(data).map(([id, category]: [string, any]) => ({
          id,
          ...category,
        }));
        setCategories(categoriesArray);
      }
    });

    return () => {
      unsubscribeUsers();
      unsubscribeBlog();
      unsubscribe();
    };
  }, [user, router]);

  const handleDeletePost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const postRef = ref(db, `blog/${postId}`);
        await remove(postRef);
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  const handleAddCategory = async () => {
    if (newCategoryName.length < 3 || newCategoryName.length > 50) {
      setError('Category name must be between 3 and 50 characters');
      return;
    }

    try {
      const categoriesRef = ref(db, 'categories');
      await push(categoriesRef, {
        name: newCategoryName,
        createdAt: new Date().toISOString(),
      });
      setNewCategoryName('');
      setIsAddingCategory(false);
      setError('');
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
    }
  };

  const handleAddSubcategory = async () => {
    if (!selectedCategory) {
      setError('Please select a category first');
      return;
    }

    if (newSubcategoryName.length < 3 || newSubcategoryName.length > 50) {
      setError('Subcategory name must be between 3 and 50 characters');
      return;
    }

    try {
      const categoryRef = ref(db, `categories/${selectedCategory}/subcategories`);
      await push(categoryRef, {
        name: newSubcategoryName,
        createdAt: new Date().toISOString(),
      });
      setNewSubcategoryName('');
      setIsAddingSubcategory(false);
      setError('');
    } catch (error) {
      console.error('Error adding subcategory:', error);
      setError('Failed to add subcategory');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? This will also delete all subcategories.')) {
      return;
    }

    try {
      const categoryRef = ref(db, `categories/${categoryId}`);
      await remove(categoryRef);
    } catch (error) {
      console.error('Error deleting category:', error);
      setError('Failed to delete category');
    }
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }

    try {
      const subcategoryRef = ref(db, `categories/${categoryId}/subcategories/${subcategoryId}`);
      await remove(subcategoryRef);
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      setError('Failed to delete subcategory');
    }
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-white bg-clip-text text-transparent mb-8">
          Admin Dashboard
        </h1>

        {/* Tabs */}
        <div className="flex border-b border-[#00ffff]/20 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'users'
                ? 'text-[#00ffff] border-b-2 border-[#00ffff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'blog'
                ? 'text-[#00ffff] border-b-2 border-[#00ffff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Blog
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'categories'
                ? 'text-[#00ffff] border-b-2 border-[#00ffff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Categories
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#00ffff]/20">
                    <th className="px-6 py-4 text-left text-[#00ffff]">Email</th>
                    <th className="px-6 py-4 text-left text-[#00ffff]">Role</th>
                    <th className="px-6 py-4 text-left text-[#00ffff]">Prompts</th>
                    <th className="px-6 py-4 text-left text-[#00ffff]">Created At</th>
                    <th className="px-6 py-4 text-left text-[#00ffff]">Last Login</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr 
                      key={user.uid}
                      className="border-b border-[#00ffff]/10 hover:bg-[#00ffff]/5 transition-colors"
                    >
                      <td className="px-6 py-4 text-white">{user.email}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-sm ${
                          user.role === 'admin' 
                            ? 'bg-[#00ffff]/20 text-[#00ffff]' 
                            : 'bg-white/10 text-white/60'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white/60">{user.promptCount}</td>
                      <td className="px-6 py-4 text-white/60">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 text-white/60">
                        {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : activeTab === 'blog' ? (
          <div className="space-y-6">
            <div className="flex justify-end">
              <Link href="/admin/blog/new">
                <Button variant="default">
                  Create New Post
                </Button>
              </Link>
            </div>

            <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#00ffff]/20">
                      <th className="px-6 py-4 text-left text-[#00ffff]">Title</th>
                      <th className="px-6 py-4 text-left text-[#00ffff]">Date</th>
                      <th className="px-6 py-4 text-left text-[#00ffff]">Read Time</th>
                      <th className="px-6 py-4 text-left text-[#00ffff]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogPosts.map((post) => (
                      <tr 
                        key={post.id}
                        className="border-b border-[#00ffff]/10 hover:bg-[#00ffff]/5 transition-colors"
                      >
                        <td className="px-6 py-4 text-white">{post.title}</td>
                        <td className="px-6 py-4 text-white/60">
                          {new Date(post.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-white/60">{post.readTime}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <Link href={`/admin/blog/edit/${post.id}`}>
                              <Button variant="ghost" size="sm">
                                <PencilIcon className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeletePost(post.id)}
                            >
                              <TrashIcon className="h-4 w-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Categories</h2>
              <Button
                onClick={() => setIsAddingCategory(true)}
                className="bg-[#00ffff] hover:bg-[#00ffff]/80 text-black px-4 py-2 rounded-lg transition-colors"
              >
                Add Category
              </Button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-lg">
                {error}
              </div>
            )}

            {isAddingCategory && (
              <div className="bg-black/30 border border-[#00ffff]/20 rounded-lg p-4">
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="Category name"
                  className="w-full bg-black/50 text-white border border-[#00ffff]/20 rounded-lg p-2 focus:border-[#00ffff]/40 focus:outline-none mb-4"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleAddCategory}
                    className="bg-[#00ffff] hover:bg-[#00ffff]/80 text-black px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Category
                  </Button>
                  <Button
                    onClick={() => {
                      setIsAddingCategory(false);
                      setNewCategoryName('');
                    }}
                    className="bg-black/50 text-white border border-[#00ffff]/20 px-4 py-2 rounded-lg hover:border-[#00ffff]/40 transition-colors"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-black/30 border border-[#00ffff]/20 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium text-white">{category.name}</h3>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setSelectedCategory(category.id);
                          setIsAddingSubcategory(true);
                        }}
                        className="text-[#00ffff] hover:text-[#00ffff]/80 transition-colors"
                      >
                        Add Subcategory
                      </Button>
                      <Button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-500 hover:text-red-400 transition-colors"
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {selectedCategory === category.id && isAddingSubcategory && (
                    <div className="mb-4 bg-black/20 border border-[#00ffff]/10 rounded-lg p-4">
                      <input
                        type="text"
                        value={newSubcategoryName}
                        onChange={(e) => setNewSubcategoryName(e.target.value)}
                        placeholder="Subcategory name"
                        className="w-full bg-black/50 text-white border border-[#00ffff]/20 rounded-lg p-2 focus:border-[#00ffff]/40 focus:outline-none mb-4"
                      />
                      <div className="flex gap-2">
                        <Button
                          onClick={handleAddSubcategory}
                          className="bg-[#00ffff] hover:bg-[#00ffff]/80 text-black px-4 py-2 rounded-lg transition-colors"
                        >
                          Add Subcategory
                        </Button>
                        <Button
                          onClick={() => {
                            setIsAddingSubcategory(false);
                            setNewSubcategoryName('');
                            setSelectedCategory(null);
                          }}
                          className="bg-black/50 text-white border border-[#00ffff]/20 px-4 py-2 rounded-lg hover:border-[#00ffff]/40 transition-colors"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {category.subcategories && Object.keys(category.subcategories).length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium text-white/60 mb-2">Subcategories:</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {Object.entries(category.subcategories).map(([id, subcategory]) => (
                          <div
                            key={id}
                            className="flex justify-between items-center bg-black/20 border border-[#00ffff]/10 rounded-lg p-2"
                          >
                            <span className="text-white">{subcategory.name}</span>
                            <Button
                              onClick={() => handleDeleteSubcategory(category.id, id)}
                              className="text-red-500 hover:text-red-400 transition-colors"
                            >
                              Delete
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
