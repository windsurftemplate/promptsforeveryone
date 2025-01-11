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
  plan?: string;
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
  count: number;
  subcategories?: {
    [key: string]: {
      name: string;
    };
  };
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  userId: string;
  userName?: string;
  category: string;
  subcategory?: string;
  createdAt: string;
  isPrivate?: boolean;
}

interface UserData {
  name?: string;
  email: string;
  role?: string;
  plan?: string;
  createdAt?: string;
  lastLogin?: string;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'blog' | 'categories' | 'prompts'>('users');
  const [categories, setCategories] = useState<Category[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }

    // Check if user is admin
    const checkAdmin = async () => {
      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      if (!snapshot.exists() || snapshot.val().role !== 'admin') {
        router.push('/');
        return;
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
              plan: userData.plan || 'free',
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

    // Fetch all prompts
    const fetchPrompts = async () => {
      try {
        // Check admin status first
        const adminRef = ref(db, `users/${user.uid}`);
        const adminSnapshot = await get(adminRef);
        if (!adminSnapshot.exists() || adminSnapshot.val().role !== 'admin') {
          router.push('/');
          return;
        }

        // Fetch public prompts
        const publicPromptsRef = ref(db, 'prompts');
        onValue(publicPromptsRef, async (snapshot) => {
          try {
            const publicPrompts: Prompt[] = [];
            if (snapshot.exists()) {
              const data = snapshot.val();
              for (const [id, prompt] of Object.entries(data)) {
                const promptData = prompt as any;
                // Fetch user details
                const userRef = ref(db, `users/${promptData.userId}`);
                const userSnapshot = await get(userRef);
                const userData = userSnapshot.val() as UserData;
                
                // Fetch category details to get subcategory name
                let subcategoryName = '';
                if (promptData.category && promptData.subcategoryId) {
                  const categoryRef = ref(db, `categories/${promptData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                  const categorySnapshot = await get(categoryRef);
                  if (categorySnapshot.exists()) {
                    const categoryData = categorySnapshot.val();
                    subcategoryName = categoryData.subcategories?.[promptData.subcategoryId]?.name || '';
                  }
                }
                
                publicPrompts.push({
                  id,
                  ...promptData,
                  userName: userData?.name || userData?.email || 'Unknown User',
                  subcategory: subcategoryName,
                  isPrivate: false
                });
              }
            }

            // Fetch private prompts from all users
            const usersRef = ref(db, 'users');
            const usersSnapshot = await get(usersRef);
            const privatePrompts: Prompt[] = [];
            
            if (usersSnapshot.exists()) {
              const users = usersSnapshot.val();
              for (const [userId, userData] of Object.entries(users)) {
                const typedUserData = userData as UserData;
                const userPromptsRef = ref(db, `users/${userId}/prompts`);
                const userPromptsSnapshot = await get(userPromptsRef);
                
                if (userPromptsSnapshot.exists()) {
                  const userPrompts = userPromptsSnapshot.val();
                  for (const [promptId, prompt] of Object.entries(userPrompts)) {
                    const promptData = prompt as any;
                    
                    // Fetch category details to get subcategory name
                    let subcategoryName = '';
                    if (promptData.category && promptData.subcategoryId) {
                      const categoryRef = ref(db, `categories/${promptData.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
                      const categorySnapshot = await get(categoryRef);
                      if (categorySnapshot.exists()) {
                        const categoryData = categorySnapshot.val();
                        subcategoryName = categoryData.subcategories?.[promptData.subcategoryId]?.name || '';
                      }
                    }

                    privatePrompts.push({
                      id: promptId,
                      ...promptData,
                      userName: typedUserData.name || typedUserData.email || 'Unknown User',
                      subcategory: subcategoryName,
                      userId,
                      isPrivate: true
                    });
                  }
                }
              }
            }

            // Combine and sort all prompts by creation date
            const allPrompts = [...publicPrompts, ...privatePrompts].sort((a, b) => 
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );
            
            setPrompts(allPrompts);
            setError(''); // Clear any previous errors
          } catch (error) {
            console.error('Error processing prompts:', error);
            setError('Error loading prompts. Please try again.');
          }
        });
      } catch (error) {
        console.error('Error in fetchPrompts:', error);
        if (error instanceof Error && error.message.includes('Permission denied')) {
          router.push('/');
        } else {
          setError('Failed to load prompts. Please try again.');
        }
        setPrompts([]);
      }
    };

    fetchPrompts();

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
    try {
      const categoryId = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const categoryRef = ref(db, `categories/${categoryId}`);
      await update(categoryRef, {
        name: newCategoryName,
        count: 0,
        subcategories: {}  // Initialize empty subcategories object
      });
      setNewCategoryName('');
      setIsAddingCategory(false);
    } catch (error) {
      console.error('Error adding category:', error);
      setError('Failed to add category');
    }
  };

  const handleAddSubcategory = async (categoryId: string) => {
    try {
      const subcategoryRef = ref(db, `categories/${categoryId}/subcategories`);
      const newSubcategoryRef = push(subcategoryRef);
      await update(newSubcategoryRef, {
        name: newSubcategoryName
      });
      setNewSubcategoryName('');
      setIsAddingSubcategory(false);
      setSelectedCategory(null);
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

  const handleDeletePrompt = async (prompt: Prompt) => {
    if (!confirm('Are you sure you want to delete this prompt?')) {
      return;
    }

    try {
      if (prompt.isPrivate) {
        // Delete from user's private prompts
        await remove(ref(db, `users/${prompt.userId}/prompts/${prompt.id}`));
      } else {
        // Delete from public prompts
        await remove(ref(db, `prompts/${prompt.id}`));
      }

      // Update category count if needed
      if (prompt.category) {
        const categoryRef = ref(db, `categories/${prompt.category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
        const categorySnapshot = await get(categoryRef);
        if (categorySnapshot.exists()) {
          const categoryData = categorySnapshot.val();
          const currentCount = categoryData.count || 0;
          if (currentCount > 0) {
            await update(categoryRef, { count: currentCount - 1 });
          }
        }
      }
    } catch (error) {
      console.error('Error deleting prompt:', error);
      setError('Failed to delete prompt');
    }
  };

  const handleUpdateUser = async (userId: string, field: 'role' | 'plan', value: string) => {
    try {
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, {
        [field]: value
      });
    } catch (error) {
      console.error(`Error updating user ${field}:`, error);
      setError(`Failed to update user ${field}`);
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    let passesUserFilter = true;
    let passesDateFilter = true;

    // User filter
    if (selectedUser !== 'all') {
      passesUserFilter = prompt.userId === selectedUser;
    }

    // Date filter
    if (dateFilter !== 'all') {
      const promptDate = new Date(prompt.createdAt);
      const today = new Date();
      const diffTime = today.getTime() - promptDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      switch (dateFilter) {
        case 'today':
          passesDateFilter = diffDays <= 1;
          break;
        case 'week':
          passesDateFilter = diffDays <= 7;
          break;
        case 'month':
          passesDateFilter = diffDays <= 30;
          break;
      }
    }

    return passesUserFilter && passesDateFilter;
  });

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
            onClick={() => setActiveTab('prompts')}
            className={`px-6 py-3 font-medium text-sm transition-colors ${
              activeTab === 'prompts'
                ? 'text-[#00ffff] border-b-2 border-[#00ffff]'
                : 'text-white/60 hover:text-white'
            }`}
          >
            Prompts
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
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
          </div>
        ) : activeTab === 'users' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-black/30 border border-[#00ffff]/20 rounded-lg p-4">
                <h3 className="text-[#00ffff] text-sm mb-1">Total Users</h3>
                <p className="text-2xl font-semibold text-white">{users.length}</p>
              </div>
              <div className="bg-black/30 border border-[#00ffff]/20 rounded-lg p-4">
                <h3 className="text-[#00ffff] text-sm mb-1">Admin Users</h3>
                <p className="text-2xl font-semibold text-white">
                  {users.filter(user => user.role === 'admin').length}
                </p>
              </div>
            </div>
            <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#00ffff]/20">
                      <th className="px-6 py-4 text-left text-[#00ffff]">Email</th>
                      <th className="px-6 py-4 text-left text-[#00ffff]">Role</th>
                      <th className="px-6 py-4 text-left text-[#00ffff]">Plan</th>
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
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              user.role === 'admin' 
                                ? 'bg-red-500/20 text-red-400'
                                : 'bg-blue-500/20 text-blue-400'
                            }`}>
                              {user.role || 'user'}
                            </span>
                            <button
                              onClick={() => handleUpdateUser(user.uid, 'role', user.role === 'admin' ? 'user' : 'admin')}
                              className="text-[#00ffff] hover:text-[#00ffff]/80 text-sm"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              user.plan === 'paid' 
                                ? 'bg-green-500/20 text-green-400'
                                : 'bg-gray-500/20 text-gray-400'
                            }`}>
                              {user.plan || 'free'}
                            </span>
                            <button
                              onClick={() => handleUpdateUser(user.uid, 'plan', user.plan === 'paid' ? 'free' : 'paid')}
                              className="text-[#00ffff] hover:text-[#00ffff]/80 text-sm"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                          </div>
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
          </div>
        ) : activeTab === 'prompts' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-black/30 border border-[#00ffff]/20 rounded-lg p-4">
                <h3 className="text-[#00ffff] text-sm mb-1">Total Prompts</h3>
                <p className="text-2xl font-semibold text-white">{prompts.length}</p>
              </div>
              <div className="bg-black/30 border border-[#00ffff]/20 rounded-lg p-4">
                <h3 className="text-[#00ffff] text-sm mb-1">Public Prompts</h3>
                <p className="text-2xl font-semibold text-white">
                  {prompts.filter(prompt => !prompt.isPrivate).length}
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-4 items-center">
                  <div className="flex-1">
                    <label className="block text-[#00ffff] text-sm mb-1">Filter by User</label>
                    <select
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:border-[#00ffff] hover:border-[#00ffff]/50 transition-colors"
                    >
                      <option value="all" className="bg-black">All Users</option>
                      {users.map((user) => (
                        <option key={user.uid} value={user.uid} className="bg-black">
                          {user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-1">
                    <label className="block text-[#00ffff] text-sm mb-1">Filter by Date</label>
                    <select
                      value={dateFilter}
                      onChange={(e) => setDateFilter(e.target.value as 'all' | 'today' | 'week' | 'month')}
                      className="w-full px-3 py-2 bg-black/50 border border-[#00ffff]/20 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-[#00ffff]/50 focus:border-[#00ffff] hover:border-[#00ffff]/50 transition-colors"
                    >
                      <option value="all" className="bg-black">All Time</option>
                      <option value="today" className="bg-black">Last 24 Hours</option>
                      <option value="week" className="bg-black">Last 7 Days</option>
                      <option value="month" className="bg-black">Last 30 Days</option>
                    </select>
                  </div>
                </div>
                <Link href="/prompt/new">
                  <Button variant="default" className="bg-[#00ffff] hover:bg-[#00ffff]/80 text-black">
                    Create New Prompt
                  </Button>
                </Link>
              </div>

              <div className="bg-black/80 backdrop-blur-lg border border-[#00ffff]/20 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-[#00ffff]/20">
                        <th className="px-6 py-4 text-left text-[#00ffff]">Title</th>
                        <th className="px-6 py-4 text-left text-[#00ffff]">User</th>
                        <th className="px-6 py-4 text-left text-[#00ffff]">Category</th>
                        <th className="px-6 py-4 text-left text-[#00ffff]">Type</th>
                        <th className="px-6 py-4 text-left text-[#00ffff]">Created At</th>
                        <th className="px-6 py-4 text-left text-[#00ffff]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPrompts.map((prompt) => (
                        <tr 
                          key={prompt.id}
                          className="border-b border-[#00ffff]/10 hover:bg-[#00ffff]/5 transition-colors"
                        >
                          <td className="px-6 py-4 text-white">{prompt.title}</td>
                          <td className="px-6 py-4 text-white/60">{prompt.userName}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className="px-2 py-1 rounded-full text-sm bg-[#00ffff]/10 text-[#00ffff]">
                                {prompt.category}
                              </span>
                              {prompt.subcategory && (
                                <span className="px-2 py-1 rounded-full text-sm bg-[#00ffff]/5 text-[#00ffff]/80">
                                  {prompt.subcategory}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-sm ${
                              prompt.isPrivate
                                ? 'bg-gray-500/20 text-gray-400'
                                : 'bg-green-500/20 text-green-400'
                            }`}>
                              {prompt.isPrivate ? 'Private' : 'Public'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-white/60">
                            {new Date(prompt.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <Link 
                                href={`/prompt/${prompt.id}`}
                                className="text-[#00ffff] hover:text-[#00ffff]/80"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => handleDeletePrompt(prompt)}
                                className="text-red-500 hover:text-red-400 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="bg-black/30 border border-[#00ffff]/20 rounded-lg p-4">
                <h3 className="text-[#00ffff] text-sm mb-1">Total Categories</h3>
                <p className="text-2xl font-semibold text-white">{categories.length}</p>
              </div>
              <div className="bg-black/30 border border-[#00ffff]/20 rounded-lg p-4">
                <h3 className="text-[#00ffff] text-sm mb-1">Total Subcategories</h3>
                <p className="text-2xl font-semibold text-white">
                  {categories.reduce((total, category) => 
                    total + (category.subcategories ? Object.keys(category.subcategories).length : 0), 
                  0)}
                </p>
              </div>
            </div>
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
                          onClick={() => handleAddSubcategory(category.id)}
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
