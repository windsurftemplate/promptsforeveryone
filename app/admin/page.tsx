'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { ref, get, onValue } from 'firebase/database';
import { db } from '@/lib/firebase';

interface User {
  uid: string;
  email: string;
  role?: string;
  createdAt?: string;
  lastLogin?: string;
  promptCount?: number;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const unsubscribe = onValue(usersRef, async (snapshot) => {
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

    return () => unsubscribe();
  }, [user, router]);

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00ffff] to-white bg-clip-text text-transparent mb-8">
          Admin Dashboard
        </h1>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-[#00ffff]"></div>
          </div>
        ) : (
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
        )}
      </div>
    </div>
  );
}
