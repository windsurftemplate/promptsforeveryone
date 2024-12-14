'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useState, useEffect } from 'react';
import {
  ChevronDownIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowLeftOnRectangleIcon,
} from '@heroicons/react/24/outline';
import { ref, get } from 'firebase/database';
import { db } from '@/lib/firebase';

const adminNavItems = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: Cog6ToothIcon,
    requiresAuth: true,
  },
];

export default function SideNav() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const [categories, setCategories] = useState<any[]>([]);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesRef = ref(db, 'categories');
        const snapshot = await get(categoriesRef);
        if (snapshot.exists()) {
          const categoriesData = Object.entries(snapshot.val()).map(([id, data]: [string, any]) => ({
            id,
            ...data,
          }));
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <nav className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-white/[0.06]">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold">Prompt Repository</span>
        </Link>
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 flex flex-col gap-1">
        {/* Categories Section */}
        <div className="px-6 mb-2">
          <button
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
            className="w-full flex items-center justify-between text-sm font-semibold text-white/90 hover:text-white"
          >
            <span>Categories</span>
            <ChevronDownIcon
              className={`w-4 h-4 transition-transform ${
                isCategoriesOpen ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {isCategoriesOpen && (
          <div className="space-y-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.id}`}
                className={`flex items-center gap-2 px-6 py-2 text-sm font-medium transition-colors ${
                  isActive(`/categories/${category.id}`)
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.name}</span>
              </Link>
            ))}
          </div>
        )}

        {/* Admin Navigation - Only show if user is logged in */}
        {user && (
          <>
            <div className="mt-6 mb-2 px-6">
              <h3 className="text-xs font-semibold text-white/50 uppercase">Admin</h3>
            </div>
            {adminNavItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-2 px-6 py-2 text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/70 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            ))}
          </>
        )}
      </div>

      {/* User Section - Only show if logged in */}
      {user && (
        <div className="p-6 border-t border-white/[0.06]">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-sm">
              <UserIcon className="w-5 h-5" />
              <span className="font-medium">{user.email}</span>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
