'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ref, get, update, remove, set } from 'firebase/database';
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

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'users' | 'prompts' | 'pages'>('users');
  const [pageContent, setPageContent] = useState('');
  const [editingPage, setEditingPage] = useState(false);
  const [savingPage, setSavingPage] = useState(false);

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Tabs */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'users'
              ? 'bg-primary text-white'
              : 'bg-surface hover:bg-surface-hover'
          }`}
        >
          Users
        </button>
        <button
          onClick={() => setActiveTab('prompts')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'prompts'
              ? 'bg-primary text-white'
              : 'bg-surface hover:bg-surface-hover'
          }`}
        >
          Prompts
        </button>
        <button
          onClick={() => setActiveTab('pages')}
          className={`px-4 py-2 rounded-md ${
            activeTab === 'pages'
              ? 'bg-primary text-white'
              : 'bg-surface hover:bg-surface-hover'
          }`}
        >
          Pages
        </button>
      </div>

      {/* Users Table */}
      {activeTab === 'users' && (
        <div className="bg-white/[0.03] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/[0.06]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Email</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Role</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Created At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-sm text-white/70">{user.email}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{user.role}</td>
                  <td className="px-6 py-4 text-sm text-white/70">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <select
                      value={user.role}
                      onChange={(e) => updateUserRole(user.uid, e.target.value)}
                      className="bg-white/[0.06] text-white border border-white/[0.1] rounded-lg px-3 py-1"
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
      )}

      {/* Prompts Table */}
      {activeTab === 'prompts' && (
        <div className="bg-white/[0.03] rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-white/[0.06]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Author</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Created At</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {prompts.map((prompt) => (
                <tr key={prompt.id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-sm text-white/70">{prompt.title}</td>
                  <td className="px-6 py-4 text-sm text-white/70">{prompt.authorId}</td>
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
                  <td className="px-6 py-4 text-sm text-white/70">
                    {new Date(prompt.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm space-x-2">
                    <button
                      onClick={() => updatePromptStatus(prompt.id, 'approved')}
                      className="text-green-400 hover:text-green-300"
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
      )}

      {/* Pages */}
      {activeTab === 'pages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Page Management</h2>
            <div className="space-x-4">
              <Link
                href="/how-to-start/edit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-accent"
              >
                Edit How to Start Page
              </Link>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <div className="bg-white/[0.03] rounded-xl p-6">
              <h3 className="text-xl font-semibold mb-4">How to Start Page</h3>
              <p className="text-white/70 mb-4">
                This page contains the getting started guide for new users. It supports markdown formatting
                and can be edited to update the onboarding experience.
              </p>
              <Link
                href="/how-to-start"
                className="text-primary hover:text-primary-accent"
              >
                View Page →
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
