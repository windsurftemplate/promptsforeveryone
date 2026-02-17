'use client';

import { UserNav } from '@/components/UserNav';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-black">
      <main>
        <div className="hidden h-16 items-center justify-between px-4">
          <h2 className="text-lg font-semibold bg-gradient-to-r from-[#8B5CF6] to-[#8B5CF6] bg-clip-text text-transparent">
            Dashboard
          </h2>
          <div className="flex items-center gap-4">
            <UserNav />
          </div>
        </div>
        {children}
      </main>
    </div>
  );
} 