import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Link from 'next/link';
import './globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import SideNav from '@/components/layout/SideNav';
import MobileNav from '@/components/layout/MobileNav';
import NavBar from '@/components/NavBar';
import CityBackground from '@/components/ui/CityBackground';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'Windsurf Prompts',
  description: 'A community-driven repository of prompts for Windsurf IDE',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={`${inter.className} bg-primary min-h-screen text-text`}>
        <AuthProvider>
          <CityBackground />
          
          <div className="flex h-screen relative">
            {/* Sidebar - Desktop only */}
            <aside className="hidden lg:block w-64 border-r border-surface-light/10 bg-surface/60 backdrop-blur-sm">
              <SideNav />
            </aside>
            
            {/* Main content */}
            <div className="flex-1 flex flex-col">
              <div className="bg-surface/60 backdrop-blur-sm">
                <NavBar />
              </div>
              <main className="flex-1 overflow-auto px-4 py-8">
                {children}
              </main>
            </div>
            
            {/* Mobile navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface/60 backdrop-blur-sm">
              <MobileNav />
            </nav>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
