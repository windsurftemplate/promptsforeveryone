'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function SitemapPage() {
  const { user } = useAuth();

  const mainPages = [
    { name: 'Home', path: '/', description: 'Landing page with featured prompts and categories' },
    { name: 'Explore', path: '/explore', description: 'Browse and search all public prompts' },
    { name: 'Popular', path: '/popular', description: 'Discover the most voted prompts' },
    { name: 'Categories', path: '/categories', description: 'View all categories and subcategories' },
    { name: 'Submit', path: '/submit', description: 'Create and submit new prompts' },
    { name: 'Dashboard', path: '/dashboard', description: 'Manage your prompts and account' },
  ];

  const accountPages = [
    { name: 'Login', path: '/login', description: 'Sign in to your account' },
    { name: 'Register', path: '/register', description: 'Create a new account' },
    { name: 'Profile', path: '/profile', description: 'View and edit your profile' },
    { name: 'Settings', path: '/settings', description: 'Manage your account settings' },
  ];

  const adminPages = [
    { name: 'Admin Dashboard', path: '/admin', description: 'Manage users, categories, and content' },
    { name: 'Blog Management', path: '/admin/blog', description: 'Create and edit blog posts' },
  ];

  const otherPages = [
    { name: 'About', path: '/about', description: 'Learn about our platform' },
    { name: 'Privacy Policy', path: '/privacy', description: 'Our privacy policy' },
    { name: 'Terms of Service', path: '/terms', description: 'Our terms of service' },
    { name: 'Contact', path: '/contact', description: 'Get in touch with us' },
  ];

  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#8B5CF6] to-white bg-clip-text text-transparent mb-8">
          Sitemap
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Main Pages */}
          <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Main Pages</h2>
            <div className="space-y-4">
              {mainPages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="block group"
                >
                  <div className="p-3 rounded-lg border border-[#8B5CF6]/10 hover:border-[#8B5CF6]/30 transition-colors">
                    <h3 className="text-[#8B5CF6] group-hover:text-[#8B5CF6]/80 font-medium mb-1">
                      {page.name}
                    </h3>
                    <p className="text-white/60 text-sm">{page.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Account Pages */}
          <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Account Pages</h2>
            <div className="space-y-4">
              {accountPages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="block group"
                >
                  <div className="p-3 rounded-lg border border-[#8B5CF6]/10 hover:border-[#8B5CF6]/30 transition-colors">
                    <h3 className="text-[#8B5CF6] group-hover:text-[#8B5CF6]/80 font-medium mb-1">
                      {page.name}
                    </h3>
                    <p className="text-white/60 text-sm">{page.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Admin Pages (only shown to admin users) */}
          {user?.role === 'admin' && (
            <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-4">Admin Pages</h2>
              <div className="space-y-4">
                {adminPages.map((page) => (
                  <Link
                    key={page.path}
                    href={page.path}
                    className="block group"
                  >
                    <div className="p-3 rounded-lg border border-[#8B5CF6]/10 hover:border-[#8B5CF6]/30 transition-colors">
                      <h3 className="text-[#8B5CF6] group-hover:text-[#8B5CF6]/80 font-medium mb-1">
                        {page.name}
                      </h3>
                      <p className="text-white/60 text-sm">{page.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Other Pages */}
          <div className="bg-black/30 border border-[#8B5CF6]/20 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Other Pages</h2>
            <div className="space-y-4">
              {otherPages.map((page) => (
                <Link
                  key={page.path}
                  href={page.path}
                  className="block group"
                >
                  <div className="p-3 rounded-lg border border-[#8B5CF6]/10 hover:border-[#8B5CF6]/30 transition-colors">
                    <h3 className="text-[#8B5CF6] group-hover:text-[#8B5CF6]/80 font-medium mb-1">
                      {page.name}
                    </h3>
                    <p className="text-white/60 text-sm">{page.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 