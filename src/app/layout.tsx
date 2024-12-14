import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import SideNav from '@/components/layout/SideNav';
import MobileNav from '@/components/layout/MobileNav';
import NavBar from '@/components/NavBar';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Prompt Repository',
  description: 'A collection of prompts for Windsurf IDE',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-[#0A0A0B] min-h-screen text-white`}>
        <AuthProvider>
          <div className="relative min-h-screen">
            <div className="flex h-screen">
              {/* Sidebar */}
              <div className="w-64 shrink-0 border-r border-white/[0.06]">
                <SideNav />
              </div>

              {/* Main Content */}
              <div className="flex-1 overflow-auto">
                <NavBar />
                <main className="p-6">
                  {children}
                </main>
              </div>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
