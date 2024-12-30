'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ref, get, update, remove, set, push, query, orderByChild } from 'firebase/database';
import { db } from '@/lib/firebase';

interface User {
  uid: string;
  email: string;
  role: string;
  plan: string;
  createdAt: string;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  authorId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

interface Category {
  name: string;
  description: string;
  icon: string;
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  featured?: boolean;
}

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'prompts' | 'pages' | 'categories' | 'blog'>('users');
  const [pageContent, setPageContent] = useState('');
  const [editingPage, setEditingPage] = useState(false);
  const [savingPage, setSavingPage] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [newCategory, setNewCategory] = useState<Category>({
    name: '',
    description: '',
    icon: ''
  });
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [newPost, setNewPost] = useState<Omit<BlogPost, 'id'>>({
    title: '',
    excerpt: '',
    content: '',
    author: '',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
    category: '',
    readTime: '',
    featured: false
  });

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!user) {
        console.log('No user found, redirecting to home');
        router.push('/');
        return;
      }

      try {
        console.log('Checking admin access for user:', user.uid);
        // First check if the user exists and is an admin
        const userRef = ref(db, `users/${user.uid}`);
        const snapshot = await get(userRef);
        const userData = snapshot.val();
        console.log('User data:', userData);

        if (!userData) {
          console.log('No user data found, creating admin user');
          const newUserData = {
            email: user.email,
            role: 'admin', // Set as admin for the first user
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPro: true // Set as pro user
          };
          
          try {
            await set(userRef, newUserData);
            console.log('Created admin user successfully');
            window.location.reload();
            return;
          } catch (error) {
            console.error('Error creating admin user:', error);
            router.push('/');
            return;
          }
        }

        if (userData.role !== 'admin') {
          console.log('User is not an admin, redirecting');
          router.push('/');
          return;
        }

        // Now that we've confirmed admin status, fetch data
        console.log('User is admin, proceeding to fetch data');
        
        // First fetch users one by one to avoid permission issues
        try {
          const usersRef = ref(db, 'users');
          const usersSnapshot = await get(usersRef);
          if (usersSnapshot.exists()) {
            const usersData = usersSnapshot.val();
            const formattedUsers = await Promise.all(
              Object.entries(usersData)
                .filter(([uid]) => uid !== 'undefined' && uid !== 'null')
                .map(async ([uid, data]: [string, any]) => {
                  try {
                    const userSnapshot = await get(ref(db, `users/${uid}`));
                    const userData = userSnapshot.val();
                    return {
                      uid,
                      email: userData?.email || '',
                      role: userData?.role || 'user',
                      createdAt: userData?.createdAt || new Date().toISOString()
                    };
                  } catch (error) {
                    console.error(`Error fetching user ${uid}:`, error);
                    return null;
                  }
                })
            );
            setUsers(formattedUsers.filter(user => user !== null) as User[]);
            console.log('Users fetched successfully');
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        }

        // Then fetch prompts
        try {
          const promptsRef = ref(db, 'prompts');
          const promptsSnapshot = await get(promptsRef);
          if (promptsSnapshot.exists()) {
            const promptsData = promptsSnapshot.val();
            const formattedPrompts = Object.entries(promptsData)
              .filter(([id, data]: [string, any]) => data && data.title)
              .map(([id, data]: [string, any]) => ({
                id,
                title: data.title || '',
                content: data.content || '',
                authorId: data.userId || '',
                status: data.status || 'pending',
                createdAt: data.createdAt || new Date().toISOString()
              }));
            setPrompts(formattedPrompts);
            console.log('Prompts fetched successfully');
          }
        } catch (error) {
          console.error('Error fetching prompts:', error);
        }

        // Finally fetch blog posts
        try {
          const blogRef = ref(db, 'blog');
          const blogSnapshot = await get(blogRef);
          if (blogSnapshot.exists()) {
            const blogData = blogSnapshot.val();
            const formattedPosts = Object.entries(blogData)
              .filter(([id, data]: [string, any]) => data && data.title)
              .map(([id, data]: [string, any]) => ({
                id,
                title: data.title || '',
                excerpt: data.excerpt || '',
                content: data.content || '',
                author: data.author || '',
                date: data.date || new Date().toLocaleDateString(),
                category: data.category || '',
                readTime: data.readTime || '',
                featured: data.featured || false
              }));
            setBlogPosts(formattedPosts);
            console.log('Blog posts fetched successfully');
          }
        } catch (error) {
          console.error('Error fetching blog posts:', error);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error checking admin access:', error);
        router.push('/');
      }
    };

    checkAdminAccess();
  }, [user, router]);

  useEffect(() => {
    const loadPageContent = async () => {
      if (!user) return;

      try {
        const howToStartRef = ref(db, 'howToStart');
        const snapshot = await get(howToStartRef);
        if (snapshot.exists()) {
          setPageContent(snapshot.val().content);
        }
      } catch (error) {
        console.error('Error loading page content:', error);
      }
    };

    if (activeTab === 'pages') {
      loadPageContent();
    }
  }, [activeTab, user]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      if (!user || activeTab !== 'blog') return;

      try {
        const blogRef = ref(db, 'blog');
        const snapshot = await get(blogRef);
        if (snapshot.exists()) {
          const posts = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
            id,
            ...data,
          }));
          setBlogPosts(posts);
        }
      } catch (error) {
        console.error('Error fetching blog posts:', error);
      }
    };

    fetchBlogPosts();
  }, [activeTab, user]);

  const updateUserRole = async (uid: string, newRole: string) => {
    try {
      await update(ref(db, `users/${uid}`), { role: newRole });
      setUsers(users.map(user => 
        user.uid === uid ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const updatePromptStatus = async (promptId: string, newStatus: 'approved' | 'rejected') => {
    try {
      await update(ref(db, `prompts/${promptId}`), { status: newStatus });
      setPrompts(prompts.map(prompt => 
        prompt.id === promptId ? { ...prompt, status: newStatus } : prompt
      ));
    } catch (error) {
      console.error('Error updating prompt status:', error);
    }
  };

  const deletePrompt = async (promptId: string) => {
    try {
      await remove(ref(db, `prompts/${promptId}`));
      setPrompts(prompts.filter(prompt => prompt.id !== promptId));
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  const handleSavePageContent = async () => {
    setSavingPage(true);
    try {
      const howToStartRef = ref(db, 'howToStart');
      await set(howToStartRef, {
        content: pageContent,
        updatedAt: new Date().toISOString(),
        updatedBy: user?.email
      });
      setEditingPage(false);
    } catch (error) {
      console.error('Error saving page content:', error);
    } finally {
      setSavingPage(false);
    }
  };

  const addCategory = async () => {
    try {
      const categoriesRef = ref(db, 'categories');
      const newCategoryRef = push(categoriesRef);
      await set(newCategoryRef, newCategory);
      setNewCategory({ name: '', description: '', icon: '' });
      // Refresh categories
      const snapshot = await get(categoriesRef);
      if (snapshot.exists()) {
        setCategories(Object.values(snapshot.val()));
      }
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (categoryId: string, updatedData: Category) => {
    try {
      const categoryRef = ref(db, `categories/${categoryId}`);
      await update(categoryRef, updatedData);
      setEditingCategory(null);
      // Refresh categories
      const categoriesRef = ref(db, 'categories');
      const snapshot = await get(categoriesRef);
      if (snapshot.exists()) {
        setCategories(Object.values(snapshot.val()));
      }
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (categoryId: string) => {
    try {
      await remove(ref(db, `categories/${categoryId}`));
      const categoriesRef = ref(db, 'categories');
      const snapshot = await get(categoriesRef);
      if (snapshot.exists()) {
        setCategories(Object.values(snapshot.val()));
      } else {
        setCategories([]);
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const addBlogPost = async () => {
    try {
      if (!newPost.title || !newPost.content) {
        alert('Title and content are required');
        return;
      }

      const blogRef = ref(db, 'blog');
      const newPostRef = push(blogRef);
      const postData = {
        ...newPost,
        id: newPostRef.key,
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        createdAt: new Date().toISOString()
      };

      await set(newPostRef, postData);

      // Reset form
      setNewPost({
        title: '',
        excerpt: '',
        content: '',
        author: '',
        date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
        category: '',
        readTime: '',
        featured: false
      });

      // Refresh blog posts
      const snapshot = await get(blogRef);
      if (snapshot.exists()) {
        const posts = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
          id,
          ...data,
        }));
        setBlogPosts(posts);
      }

      alert('Blog post created successfully!');
    } catch (error) {
      console.error('Error adding blog post:', error);
      alert('Error creating blog post. Please try again.');
    }
  };

  const updateBlogPost = async (postId: string, updatedData: Partial<BlogPost>) => {
    try {
      const postRef = ref(db, `blog/${postId}`);
      await update(postRef, updatedData);
      setEditingPost(null);
      // Refresh blog posts
      const blogRef = ref(db, 'blog');
      const snapshot = await get(blogRef);
      if (snapshot.exists()) {
        setBlogPosts(Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
          id,
          ...data,
        })));
      }
    } catch (error) {
      console.error('Error updating blog post:', error);
    }
  };

  const deleteBlogPost = async (postId: string) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        const postRef = ref(db, `blog/${postId}`);
        await remove(postRef);
        // Refresh blog posts
        const blogRef = ref(db, 'blog');
        const snapshot = await get(blogRef);
        if (snapshot.exists()) {
          setBlogPosts(Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
            id,
            ...data,
          })));
        } else {
          setBlogPosts([]);
        }
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  const deleteUser = async (uid: string) => {
    try {
      await remove(ref(db, `users/${uid}`));
      setUsers(users.filter(user => user.uid !== uid));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const updateUserPlan = async (uid: string, newPlan: string) => {
    try {
      const userRef = ref(db, `users/${uid}`);
      const updates = {
        plan: newPlan,
        isPro: newPlan === 'pro',
        updatedAt: new Date().toISOString()
      };

      // First check if the user exists
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        console.error('User not found');
        return;
      }

      // Update the user data
      await update(userRef, updates);
      console.log('User plan updated successfully');

      // Update the local state
      setUsers(users.map(user => 
        user.uid === uid ? { ...user, plan: newPlan } : user
      ));
    } catch (error) {
      console.error('Error updating user plan:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-[#00ffff]">Admin Dashboard</h1>
      
      <div className="flex space-x-4 mb-8">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-[#00ffff] text-black' : 'bg-black text-[#00ffff] border border-[#00ffff]'}`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('categories')}
          className={`px-4 py-2 rounded ${activeTab === 'categories' ? 'bg-[#00ffff] text-black' : 'bg-black text-[#00ffff] border border-[#00ffff]'}`}
        >
          Categories
        </button>
        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-4 py-2 rounded ${activeTab === 'prompts' ? 'bg-[#00ffff] text-black' : 'bg-black text-[#00ffff] border border-[#00ffff]'}`}
        >
          Prompts
        </button>
        <button
          onClick={() => setActiveTab('blog')}
          className={`px-4 py-2 rounded ${activeTab === 'blog' ? 'bg-[#00ffff] text-black' : 'bg-black text-[#00ffff] border border-[#00ffff]'}`}
        >
          Blog
        </button>
      </div>

      {/* Users Management */}
      {activeTab === 'users' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#00ffff]">Users Management</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-black border border-[#00ffff]/20">
              <thead>
                <tr className="border-b border-[#00ffff]/20">
                  <th className="px-6 py-3 text-left text-[#00ffff]">Email</th>
                  <th className="px-6 py-3 text-left text-[#00ffff]">Role</th>
                  <th className="px-6 py-3 text-left text-[#00ffff]">Plan</th>
                  <th className="px-6 py-3 text-left text-[#00ffff]">Created At</th>
                  <th className="px-6 py-3 text-left text-[#00ffff]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.uid} className="border-b border-[#00ffff]/20">
                    <td className="px-6 py-4 text-gray-200">{user.email}</td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => updateUserRole(user.uid, e.target.value)}
                        className="bg-black text-gray-200 border border-[#00ffff]/20 rounded px-2 py-1"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                        <option value="moderator">Moderator</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.plan || 'free'}
                        onChange={(e) => updateUserPlan(user.uid, e.target.value)}
                        className="bg-black text-gray-200 border border-[#00ffff]/20 rounded px-2 py-1"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-gray-200">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this user?')) {
                            deleteUser(user.uid);
                          }
                        }}
                        className="text-red-500 hover:text-red-400"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Categories Management */}
      {activeTab === 'categories' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-4 text-[#00ffff]">Categories Management</h2>
          
          {/* Add New Category Form */}
          <div className="bg-black border border-[#00ffff]/20 rounded-lg p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4 text-[#00ffff]">Add New Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Category Name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                className="bg-black text-gray-200 border border-[#00ffff]/20 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                className="bg-black text-gray-200 border border-[#00ffff]/20 rounded px-4 py-2"
              />
              <input
                type="text"
                placeholder="Icon (emoji or class name)"
                value={newCategory.icon}
                onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
                className="bg-black text-gray-200 border border-[#00ffff]/20 rounded px-4 py-2"
              />
            </div>
            <button
              onClick={addCategory}
              disabled={!newCategory.name}
              className="mt-4 px-4 py-2 bg-[#00ffff] text-black rounded disabled:opacity-50"
            >
              Add Category
            </button>
          </div>

          {/* Categories List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-black border border-[#00ffff]/20 rounded-lg p-6">
                {editingCategory === category ? (
                  <>
                    <input
                      type="text"
                      value={editingCategory.name}
                      onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                      className="bg-black text-gray-200 border border-[#00ffff]/20 rounded px-4 py-2 mb-2 w-full"
                    />
                    <input
                      type="text"
                      value={editingCategory.description}
                      onChange={(e) => setEditingCategory({ ...editingCategory, description: e.target.value })}
                      className="bg-black text-gray-200 border border-[#00ffff]/20 rounded px-4 py-2 mb-2 w-full"
                    />
                    <input
                      type="text"
                      value={editingCategory.icon}
                      onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                      className="bg-black text-gray-200 border border-[#00ffff]/20 rounded px-4 py-2 mb-4 w-full"
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={() => updateCategory(index.toString(), editingCategory)}
                        className="px-4 py-2 bg-[#00ffff] text-black rounded"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="px-4 py-2 bg-black text-[#00ffff] border border-[#00ffff] rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-[#00ffff]">{category.name}</h3>
                        <p className="text-gray-400 mt-1">{category.description}</p>
                      </div>
                      <span className="text-2xl">{category.icon}</span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setEditingCategory(category)}
                        className="px-4 py-2 bg-black text-[#00ffff] border border-[#00ffff] rounded"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (window.confirm('Are you sure you want to delete this category?')) {
                            deleteCategory(index.toString());
                          }
                        }}
                        className="px-4 py-2 bg-black text-red-500 border border-red-500 rounded"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Existing Prompts and Blog tabs */}
      {activeTab === 'prompts' && (
        <div>
          {/* ... existing prompts management code ... */}
        </div>
      )}

      {activeTab === 'blog' && (
        <div>
          {/* ... existing blog management code ... */}
        </div>
      )}
    </div>
  );
}
