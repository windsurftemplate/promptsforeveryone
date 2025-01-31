'use client';

import { useEffect } from 'react';
import { ref, increment, update } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    let deferredPrompt: any;

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      deferredPrompt = e;
    });

    window.addEventListener('appinstalled', async () => {
      // Update the PWA installs counter in Firebase
      const statsRef = ref(db, 'stats/pwa');
      await update(statsRef, {
        installs: increment(1)
      });
      deferredPrompt = null;
    });

    // Cleanup event listeners
    return () => {
      window.removeEventListener('beforeinstallprompt', () => {});
      window.removeEventListener('appinstalled', () => {});
    };
  }, []);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
} 
