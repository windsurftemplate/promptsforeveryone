'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ref, get, update, remove, set, push } from 'firebase/database';
import { db } from '@/lib/firebase';

interface User {
  uid: string;
  email: string;
  role: string;
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
        router.push('/');
        return;
      }

      const userRef = ref(db, `users/${user.uid}`);
      const snapshot = await get(userRef);
      const userData = snapshot.val();

      if (!userData || userData.role !== 'admin') {
        router.push('/');
      }
    };

    checkAdminAccess();
  }, [user, router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch users
        const usersRef = ref(db, 'users');
        const usersSnapshot = await get(usersRef);
        const usersData = usersSnapshot.val() || {};
        const formattedUsers = Object.entries(usersData).map(([uid, data]: [string, any]) => ({
          uid,
          ...data,
        }));
        setUsers(formattedUsers);

        // Fetch prompts
        const promptsRef = ref(db, 'prompts');
        const promptsSnapshot = await get(promptsRef);
        const promptsData = promptsSnapshot.val() || {};
        const formattedPrompts = Object.entries(promptsData).map(([id, data]: [string, any]) => ({
          id,
          ...data,
        }));
        setPrompts(formattedPrompts);

        // Fetch categories
        const categoriesRef = ref(db, 'categories');
        const categoriesSnapshot = await get(categoriesRef);
        const categoriesData = categoriesSnapshot.val() || {};
        setCategories(Object.values(categoriesData));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const loadPageContent = async () => {
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
  }, [activeTab]);

  useEffect(() => {
    const fetchBlogPosts = async () => {
      if (activeTab === 'blog') {
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
      }
    };

    fetchBlogPosts();
  }, [activeTab]);

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
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const categoryRef = ref(db, `categories/${categoryId}`);
        await remove(categoryRef);
        // Refresh categories
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

  const renderCategoriesTab = () => (
    <div className="space-y-6">
      <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#00ffff] mb-4">Add New Category</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[#00ffff] text-sm font-medium mb-2">Name</label>
            <input
              type="text"
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
            />
          </div>
          <div>
            <label className="block text-[#00ffff] text-sm font-medium mb-2">Description</label>
            <input
              type="text"
              value={newCategory.description}
              onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
            />
          </div>
          <div>
            <label className="block text-[#00ffff] text-sm font-medium mb-2">Icon (emoji)</label>
            <input
              type="text"
              value={newCategory.icon}
              onChange={(e) => setNewCategory({ ...newCategory, icon: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
            />
          </div>
          <button
            onClick={addCategory}
            className="px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg transition-all duration-300 border border-[#00ffff]/30"
          >
            Add Category
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {categories.map((category, index) => (
          <div key={index} className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
            {editingCategory === category ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-[#00ffff] text-sm font-medium mb-2">Name</label>
                  <input
                    type="text"
                    value={category.name}
                    onChange={(e) => setCategories(categories.map((c, i) => i === index ? { ...c, name: e.target.value } : c))}
                    className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                  />
                </div>
                <div>
                  <label className="block text-[#00ffff] text-sm font-medium mb-2">Description</label>
                  <input
                    type="text"
                    value={category.description}
                    onChange={(e) => setCategories(categories.map((c, i) => i === index ? { ...c, description: e.target.value } : c))}
                    className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                  />
                </div>
                <div>
                  <label className="block text-[#00ffff] text-sm font-medium mb-2">Icon</label>
                  <input
                    type="text"
                    value={category.icon}
                    onChange={(e) => setCategories(categories.map((c, i) => i === index ? { ...c, icon: e.target.value } : c))}
                    className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => updateCategory(index.toString(), category)}
                    className="px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg transition-all duration-300 border border-[#00ffff]/30"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingCategory(null)}
                    className="px-4 py-2 bg-black/50 hover:bg-black/70 text-white/60 hover:text-white rounded-lg transition-all duration-300 border border-white/10"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{category.icon}</span>
                    <h3 className="text-xl font-semibold text-white">{category.name}</h3>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="px-4 py-2 bg-[#00ffff]/10 hover:bg-[#00ffff]/20 text-[#00ffff] rounded-lg transition-all duration-300 border border-[#00ffff]/30"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(index.toString())}
                      className="px-4 py-2 bg-black/50 hover:bg-red-500/20 text-white/60 hover:text-red-500 rounded-lg transition-all duration-300 border border-white/10"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <p className="text-white/60">{category.description}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div className="space-y-6">
      <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#00ffff]">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#00ffff]">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#00ffff]">Created At</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#00ffff]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00ffff]/10">
            {users.map((user) => (
              <tr key={user.uid} className="hover:bg-black/30">
                <td className="px-6 py-4 text-sm text-white/80">{user.email}</td>
                <td className="px-6 py-4 text-sm text-white/80">{user.role}</td>
                <td className="px-6 py-4 text-sm text-white/80">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm">
                  <select
                    value={user.role}
                    onChange={(e) => updateUserRole(user.uid, e.target.value)}
                    className="bg-black/50 text-white border border-[#00ffff]/30 rounded-lg px-3 py-1 focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="moderator">Moderator</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderPromptsTab = () => (
    <div className="space-y-6">
      <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#00ffff]">Title</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#00ffff]">Author</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#00ffff]">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#00ffff]">Created At</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-[#00ffff]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#00ffff]/10">
            {prompts.map((prompt) => (
              <tr key={prompt.id} className="hover:bg-black/30">
                <td className="px-6 py-4 text-sm text-white/80">{prompt.title}</td>
                <td className="px-6 py-4 text-sm text-white/80">{prompt.authorId}</td>
                <td className="px-6 py-4 text-sm">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      prompt.status === 'approved'
                        ? 'bg-green-100 text-green-800'
                        : prompt.status === 'rejected'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {prompt.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-white/80">
                  {new Date(prompt.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-sm space-x-2">
                  <button
                    onClick={() => updatePromptStatus(prompt.id, 'approved')}
                    className="text-[#00ffff] hover:text-[#00ffff]/80"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => updatePromptStatus(prompt.id, 'rejected')}
                    className="text-red-400 hover:text-red-300"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => deletePrompt(prompt.id)}
                    className="text-white/60 hover:text-white/80"
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
  );

  const renderBlogTab = () => (
    <div className="space-y-6">
      <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#00ffff] mb-4">Add New Blog Post</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          addBlogPost();
        }} className="space-y-4">
          <div>
            <label className="block text-[#00ffff] text-sm font-medium mb-2">Title *</label>
            <input
              type="text"
              value={newPost.title}
              onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
              required
            />
          </div>
          <div>
            <label className="block text-[#00ffff] text-sm font-medium mb-2">Excerpt</label>
            <textarea
              value={newPost.excerpt}
              onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] h-20"
            />
          </div>
          <div>
            <label className="block text-[#00ffff] text-sm font-medium mb-2">Content *</label>
            <textarea
              value={newPost.content}
              onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
              className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] h-40"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#00ffff] text-sm font-medium mb-2">Author</label>
              <input
                type="text"
                value={newPost.author}
                onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
              />
            </div>
            <div>
              <label className="block text-[#00ffff] text-sm font-medium mb-2">Category</label>
              <input
                type="text"
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#00ffff] text-sm font-medium mb-2">Read Time</label>
              <input
                type="text"
                value={newPost.readTime}
                onChange={(e) => setNewPost({ ...newPost, readTime: e.target.value })}
                className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                placeholder="e.g., 5 min read"
              />
            </div>
            <div className="flex items-center">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPost.featured}
                  onChange={(e) => setNewPost({ ...newPost, featured: e.target.checked })}
                  className="form-checkbox h-5 w-5 text-[#00ffff] rounded border-[#00ffff]/30 focus:ring-[#00ffff]"
                />
                <span className="text-[#00ffff] text-sm font-medium">Featured Post</span>
              </label>
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-[#00ffff] text-black font-semibold rounded-lg hover:bg-[#00ffff]/80 transition-colors"
          >
            Add Post
          </button>
        </form>
      </div>

      <div className="bg-black/50 border border-[#00ffff]/20 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-[#00ffff] mb-4">Manage Blog Posts</h2>
        <div className="space-y-4">
          {blogPosts.map(post => (
            <div key={post.id} className="border border-[#00ffff]/20 rounded-lg p-4 space-y-2">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{post.title}</h3>
                  <p className="text-white/60 text-sm">{post.excerpt}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setEditingPost(post)}
                    className="px-3 py-1 bg-[#00ffff]/20 text-[#00ffff] rounded hover:bg-[#00ffff]/30 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deleteBlogPost(post.id)}
                    className="px-3 py-1 bg-red-500/20 text-red-500 rounded hover:bg-red-500/30 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-4 text-sm text-white/60">
                <span>{post.author}</span>
                <span>•</span>
                <span>{post.date}</span>
                <span>•</span>
                <span>{post.category}</span>
                {post.featured && (
                  <>
                    <span>•</span>
                    <span className="text-[#00ffff]">Featured</span>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {editingPost && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-black border border-[#00ffff]/20 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold text-[#00ffff] mb-4">Edit Blog Post</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-[#00ffff] text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={editingPost.title}
                  onChange={(e) => setEditingPost({ ...editingPost, title: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                />
              </div>
              <div>
                <label className="block text-[#00ffff] text-sm font-medium mb-2">Excerpt</label>
                <textarea
                  value={editingPost.excerpt}
                  onChange={(e) => setEditingPost({ ...editingPost, excerpt: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] h-20"
                />
              </div>
              <div>
                <label className="block text-[#00ffff] text-sm font-medium mb-2">Content</label>
                <textarea
                  value={editingPost.content}
                  onChange={(e) => setEditingPost({ ...editingPost, content: e.target.value })}
                  className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff] h-40"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#00ffff] text-sm font-medium mb-2">Author</label>
                  <input
                    type="text"
                    value={editingPost.author}
                    onChange={(e) => setEditingPost({ ...editingPost, author: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                  />
                </div>
                <div>
                  <label className="block text-[#00ffff] text-sm font-medium mb-2">Category</label>
                  <input
                    type="text"
                    value={editingPost.category}
                    onChange={(e) => setEditingPost({ ...editingPost, category: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#00ffff] text-sm font-medium mb-2">Read Time</label>
                  <input
                    type="text"
                    value={editingPost.readTime}
                    onChange={(e) => setEditingPost({ ...editingPost, readTime: e.target.value })}
                    className="w-full px-4 py-2 bg-black/50 border border-[#00ffff]/30 rounded-lg text-white focus:outline-none focus:border-[#00ffff] focus:ring-1 focus:ring-[#00ffff]"
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPost.featured}
                      onChange={(e) => setEditingPost({ ...editingPost, featured: e.target.checked })}
                      className="form-checkbox h-5 w-5 text-[#00ffff] rounded border-[#00ffff]/30 focus:ring-[#00ffff]"
                    />
                    <span className="text-[#00ffff] text-sm font-medium">Featured Post</span>
                  </label>
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setEditingPost(null)}
                  className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateBlogPost(editingPost.id, editingPost)}
                  className="px-4 py-2 bg-[#00ffff] text-black font-semibold rounded-lg hover:bg-[#00ffff]/80 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-[#00ffff] bg-clip-text text-transparent mb-8">
          Admin Dashboard
        </h1>

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'users'
                ? 'bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30'
                : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('prompts')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'prompts'
                ? 'bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30'
                : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            Prompts
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'categories'
                ? 'bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30'
                : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-4 py-2 rounded-lg transition-all duration-300 ${
              activeTab === 'blog'
                ? 'bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30'
                : 'text-white/60 hover:text-white hover:bg-white/[0.06]'
            }`}
          >
            Blog
          </button>
        </div>

        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'prompts' && renderPromptsTab()}
        {activeTab === 'categories' && renderCategoriesTab()}
        {activeTab === 'blog' && renderBlogTab()}
      </div>
    </div>
  );
}
