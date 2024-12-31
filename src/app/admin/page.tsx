'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/firebase';
import { ref, set, get, update } from 'firebase/database';
import { promptCategories } from '@/lib/categories';
import Button from '@/components/ui/Button';

interface User {
  uid: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin: string;
  isPro?: boolean;
  status: string;
  stripeSubscriptionStatus?: string | null;
}

interface EditableCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  group: string;
  isEditing?: boolean;
}

interface Prompt {
  id: string;
  title: string;
  content: string;
  description: string;
  category: string;
  userId: string;
  userName: string;
  createdAt: string;
  visibility: 'public' | 'private';
  isPublished: boolean;
  likes?: number;
  downloads?: number;
}

type Tab = 'users' | 'categories' | 'private-prompts' | 'public-prompts';

export default function AdminPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('users');
  const [isUpdating, setIsUpdating] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [categories, setCategories] = useState<EditableCategory[]>(promptCategories);
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [editingUser, setEditingUser] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<{
    success?: boolean;
    message: string;
  } | null>(null);
  const [privatePrompts, setPrivatePrompts] = useState<Prompt[]>([]);
  const [publicPrompts, setPublicPrompts] = useState<Prompt[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
          const usersData = snapshot.val();
          const usersArray = Object.entries(usersData).map(([uid, data]: [string, any]) => ({
            uid,
            ...data
          }));
          setUsers(usersArray);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setIsLoadingUsers(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const promptsRef = ref(db, 'prompts');
        const snapshot = await get(promptsRef);
        if (snapshot.exists()) {
          const promptsData = snapshot.val();
          const promptsArray = Object.entries(promptsData).map(([id, data]: [string, any]) => ({
            id,
            ...data
          }));
          
          setPrivatePrompts(promptsArray.filter(p => p.visibility === 'private'));
          setPublicPrompts(promptsArray.filter(p => p.visibility === 'public'));
        }
      } catch (error) {
        console.error('Error fetching prompts:', error);
      } finally {
        setIsLoadingPrompts(false);
      }
    };

    fetchPrompts();
  }, []);

  const handleUpdateCategories = async () => {
    if (!user) {
      setUpdateStatus({
        success: false,
        message: 'You must be logged in to perform this action.'
      });
      return;
    }

    setIsUpdating(true);
    setUpdateStatus(null);

    try {
      const categoriesRef = ref(db, 'categories');
      const categoriesData = categories.map(({ isEditing, ...cat }) => cat);
      await set(categoriesRef, categoriesData);

      setUpdateStatus({
        success: true,
        message: 'Categories successfully updated in Firebase!'
      });
    } catch (error) {
      setUpdateStatus({
        success: false,
        message: `Failed to update categories: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateUser = async (userId: string, updatedData: Partial<User>) => {
    try {
      const userRef = ref(db, `users/${userId}`);
      await update(userRef, updatedData);
      
      setUsers(users.map(u => 
        u.uid === userId ? { ...u, ...updatedData } : u
      ));
      setEditingUser(null);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const handleEditCategory = (categoryId: string, field: keyof EditableCategory, value: string) => {
    setCategories(categories.map(cat => 
      cat.id === categoryId ? { ...cat, [field]: value } : cat
    ));
  };

  const handleDeletePrompt = async (promptId: string) => {
    if (!confirm('Are you sure you want to delete this prompt?')) return;
    
    try {
      const promptRef = ref(db, `prompts/${promptId}`);
      await set(promptRef, null);
      
      setPrivatePrompts(prev => prev.filter(p => p.id !== promptId));
      setPublicPrompts(prev => prev.filter(p => p.id !== promptId));
    } catch (error) {
      console.error('Error deleting prompt:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4 text-[#00ffff]">
            Access Denied
          </h1>
          <p className="text-white/70">
            You must be logged in to access the admin page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00ffff] to-[#0099ff] text-transparent bg-clip-text">
            Admin Dashboard
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2 bg-black/30 p-1 rounded-lg border border-[#00ffff]/10">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'users'
                  ? 'bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30'
                  : 'text-white/70 hover:text-white/90'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'categories'
                  ? 'bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30'
                  : 'text-white/70 hover:text-white/90'
              }`}
            >
              Categories
            </button>
            <button
              onClick={() => setActiveTab('private-prompts')}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'private-prompts'
                  ? 'bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30'
                  : 'text-white/70 hover:text-white/90'
              }`}
            >
              Private Prompts
            </button>
            <button
              onClick={() => setActiveTab('public-prompts')}
              className={`px-6 py-2 rounded-md transition-all duration-300 ${
                activeTab === 'public-prompts'
                  ? 'bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30'
                  : 'text-white/70 hover:text-white/90'
              }`}
            >
              Public Prompts
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'categories' ? (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-white">Categories</h2>
              <Button
                onClick={handleUpdateCategories}
                disabled={isUpdating}
                className={`${
                  isUpdating
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:from-[#00ffff]/90 hover:to-[#0099ff]/90'
                } bg-gradient-to-r from-[#00ffff] to-[#0099ff] text-black font-bold py-2 px-6 rounded-lg transition-all duration-300`}
              >
                {isUpdating ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>

            {updateStatus && (
              <div className={`p-4 rounded-lg mb-6 ${
                updateStatus.success
                  ? 'bg-[#00ffff]/10 border border-[#00ffff]/30 text-[#00ffff]'
                  : 'bg-red-500/10 border border-red-500/30 text-red-500'
              }`}>
                {updateStatus.message}
              </div>
            )}

            {/* Categories Table */}
            <div className="overflow-x-auto bg-black/30 rounded-lg border border-[#00ffff]/10">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#00ffff]/20">
                    <th className="py-4 px-6 text-[#00ffff]">ID</th>
                    <th className="py-4 px-6 text-[#00ffff]">Name</th>
                    <th className="py-4 px-6 text-[#00ffff]">Description</th>
                    <th className="py-4 px-6 text-[#00ffff]">Group</th>
                    <th className="py-4 px-6 text-[#00ffff]">Icon</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id} className="border-b border-[#00ffff]/10 hover:bg-[#00ffff]/5">
                      <td className="py-4 px-6 text-white/70">{category.id}</td>
                      <td className="py-4 px-6">
                        <input
                          type="text"
                          value={category.name}
                          onChange={(e) => handleEditCategory(category.id, 'name', e.target.value)}
                          className="w-full bg-black/50 border border-[#00ffff]/30 rounded px-2 py-1 text-white"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <input
                          type="text"
                          value={category.description}
                          onChange={(e) => handleEditCategory(category.id, 'description', e.target.value)}
                          className="w-full bg-black/50 border border-[#00ffff]/30 rounded px-2 py-1 text-white"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <input
                          type="text"
                          value={category.group}
                          onChange={(e) => handleEditCategory(category.id, 'group', e.target.value)}
                          className="w-full bg-black/50 border border-[#00ffff]/30 rounded px-2 py-1 text-white"
                        />
                      </td>
                      <td className="py-4 px-6">
                        <input
                          type="text"
                          value={category.icon}
                          onChange={(e) => handleEditCategory(category.id, 'icon', e.target.value)}
                          className="w-full bg-black/50 border border-[#00ffff]/30 rounded px-2 py-1 text-white font-mono"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-white">Users</h2>
            </div>

            {isLoadingUsers ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff] mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto bg-black/30 rounded-lg border border-[#00ffff]/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#00ffff]/20">
                      <th className="py-4 px-6 text-[#00ffff]">Email</th>
                      <th className="py-4 px-6 text-[#00ffff]">Role</th>
                      <th className="py-4 px-6 text-[#00ffff]">Status</th>
                      <th className="py-4 px-6 text-[#00ffff]">Plan</th>
                      <th className="py-4 px-6 text-[#00ffff]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.uid} className="border-b border-[#00ffff]/10 hover:bg-[#00ffff]/5">
                        <td className="py-4 px-6 text-white">
                          {editingUser === u.uid ? (
                            <input
                              type="text"
                              value={u.email}
                              onChange={(e) => handleUpdateUser(u.uid, { email: e.target.value })}
                              className="bg-black/50 border border-[#00ffff]/30 rounded px-2 py-1 text-white"
                            />
                          ) : (
                            u.email
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {editingUser === u.uid ? (
                            <select
                              value={u.role}
                              onChange={(e) => handleUpdateUser(u.uid, { role: e.target.value })}
                              className="bg-black/50 border border-[#00ffff]/30 rounded px-2 py-1 text-white"
                            >
                              <option value="user">User</option>
                              <option value="admin">Admin</option>
                            </select>
                          ) : (
                            <span className="text-white/70">{u.role || 'user'}</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {editingUser === u.uid ? (
                            <select
                              value={u.status || 'active'}
                              onChange={(e) => handleUpdateUser(u.uid, { status: e.target.value })}
                              className="bg-black/50 border border-[#00ffff]/30 rounded px-2 py-1 text-white"
                            >
                              <option value="active">Active</option>
                              <option value="suspended">Suspended</option>
                              <option value="banned">Banned</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              u.status === 'active' 
                                ? 'bg-green-500/10 text-green-500 border border-green-500/30'
                                : u.status === 'suspended'
                                ? 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/30'
                                : 'bg-red-500/10 text-red-500 border border-red-500/30'
                            }`}>
                              {u.status || 'active'}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          {editingUser === u.uid ? (
                            <select
                              value={u.isPro ? 'paid' : 'free'}
                              onChange={(e) => handleUpdateUser(u.uid, { 
                                isPro: e.target.value === 'paid',
                                stripeSubscriptionStatus: e.target.value === 'paid' ? 'active' : null
                              })}
                              className="bg-black/50 border border-[#00ffff]/30 rounded px-2 py-1 text-white"
                            >
                              <option value="free">Free</option>
                              <option value="paid">Paid</option>
                            </select>
                          ) : (
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              u.isPro 
                                ? 'bg-[#00ffff]/10 text-[#00ffff] border border-[#00ffff]/30' 
                                : 'bg-white/10 text-white/70 border border-white/30'
                            }`}>
                              {u.isPro ? 'PAID' : 'FREE'}
                            </span>
                          )}
                        </td>
                        <td className="py-4 px-6 space-x-2">
                          <Button
                            onClick={() => setEditingUser(editingUser === u.uid ? null : u.uid)}
                            className="text-sm bg-black/50 hover:bg-black/70 text-[#00ffff] px-3 py-1 rounded-md border border-[#00ffff]/30"
                          >
                            {editingUser === u.uid ? 'Save' : 'Edit'}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'private-prompts' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-white">Private Prompts</h2>
            </div>

            {isLoadingPrompts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff] mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto bg-black/30 rounded-lg border border-[#00ffff]/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#00ffff]/20">
                      <th className="py-4 px-6 text-[#00ffff]">Title</th>
                      <th className="py-4 px-6 text-[#00ffff]">User</th>
                      <th className="py-4 px-6 text-[#00ffff]">Category</th>
                      <th className="py-4 px-6 text-[#00ffff]">Created</th>
                      <th className="py-4 px-6 text-[#00ffff]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {privatePrompts.map((prompt) => (
                      <tr key={prompt.id} className="border-b border-[#00ffff]/10 hover:bg-[#00ffff]/5">
                        <td className="py-4 px-6 text-white">{prompt.title}</td>
                        <td className="py-4 px-6 text-white/70">{prompt.userName}</td>
                        <td className="py-4 px-6 text-white/70">{prompt.category}</td>
                        <td className="py-4 px-6 text-white/70">
                          {new Date(prompt.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 space-x-2">
                          <Button
                            onClick={() => handleDeletePrompt(prompt.id)}
                            className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1 rounded-md border border-red-500/30"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'public-prompts' && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-semibold text-white">Public Prompts</h2>
            </div>

            {isLoadingPrompts ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff] mx-auto"></div>
              </div>
            ) : (
              <div className="overflow-x-auto bg-black/30 rounded-lg border border-[#00ffff]/10">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#00ffff]/20">
                      <th className="py-4 px-6 text-[#00ffff]">Title</th>
                      <th className="py-4 px-6 text-[#00ffff]">User</th>
                      <th className="py-4 px-6 text-[#00ffff]">Category</th>
                      <th className="py-4 px-6 text-[#00ffff]">Likes</th>
                      <th className="py-4 px-6 text-[#00ffff]">Downloads</th>
                      <th className="py-4 px-6 text-[#00ffff]">Created</th>
                      <th className="py-4 px-6 text-[#00ffff]">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {publicPrompts.map((prompt) => (
                      <tr key={prompt.id} className="border-b border-[#00ffff]/10 hover:bg-[#00ffff]/5">
                        <td className="py-4 px-6 text-white">{prompt.title}</td>
                        <td className="py-4 px-6 text-white/70">{prompt.userName}</td>
                        <td className="py-4 px-6 text-white/70">{prompt.category}</td>
                        <td className="py-4 px-6 text-white/70">{prompt.likes || 0}</td>
                        <td className="py-4 px-6 text-white/70">{prompt.downloads || 0}</td>
                        <td className="py-4 px-6 text-white/70">
                          {new Date(prompt.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 space-x-2">
                          <Button
                            onClick={() => handleDeletePrompt(prompt.id)}
                            className="text-sm bg-red-500/10 hover:bg-red-500/20 text-red-500 px-3 py-1 rounded-md border border-red-500/30"
                          >
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
