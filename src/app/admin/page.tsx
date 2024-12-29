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

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'prompts' | 'pages' | 'categories'>('users');
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
        </div>

        {activeTab === 'users' && renderUsersTab()}
        {activeTab === 'prompts' && renderPromptsTab()}
        {activeTab === 'categories' && renderCategoriesTab()}
      </div>
    </div>
  );
}
