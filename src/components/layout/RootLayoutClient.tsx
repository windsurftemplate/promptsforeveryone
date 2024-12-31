'use client';

import { useEffect } from 'react';
import FirebaseInitializer from '../firebase/FirebaseInitializer';
import Navbar from '../Navbar';
import { AuthProvider } from '@/contexts/AuthContext';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <body className="bg-black min-h-screen">
      <AuthProvider>
        <FirebaseInitializer />
        <Navbar />
        <main className="pt-24">
          {children}
        </main>
      </AuthProvider>
    </body>
  );
} 