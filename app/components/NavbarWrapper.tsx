'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

export default function NavbarWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');

  return (
    <>
      {!isDashboard && <Navbar />}
      <main className={`min-h-screen ${!isDashboard ? 'pt-24' : ''}`}>
        {children}
      </main>
    </>
  );
} 