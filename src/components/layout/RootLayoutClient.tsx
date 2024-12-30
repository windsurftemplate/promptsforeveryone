'use client';

import { AuthProvider } from '@/contexts/AuthContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import ClientLayout from '@/components/layout/ClientLayout';
import Script from 'next/script';

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <head>
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-KSPBY7FHN5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-KSPBY7FHN5');
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-[#0A0A0B] text-white">
        <AuthProvider>
          <ThemeProvider>
            <ClientLayout>
              <main className="pt-24">
                {children}
              </main>
            </ClientLayout>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </>
  );
} 