'use client';

import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import SideNav from '@/components/layout/SideNav';
import NavBar from '@/components/NavBar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const showSidebar = user && pathname !== '/';

  return (
    <div className="relative min-h-screen">
      <div className="flex h-screen">
        {/* Sidebar */}
        {showSidebar && (
          <div className="w-64 shrink-0 border-r border-white/[0.06]">
            <SideNav />
          </div>
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto">
          <NavBar />
          <main className={showSidebar ? 'p-6' : ''}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
} 