import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/contexts/AuthContext';
import ClientLayout from '@/components/layout/ClientLayout';
import './globals.css';
import Script from 'next/script';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'WindsurfPrompts',
  description: 'Your go-to destination for windsurfing inspiration and AI-crafted prompts',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <meta name="impact-site-verification" content="e852defc-eaa3-40a9-bcf9-8cec6dea85f5" />
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
      <body className={`${inter.className} bg-[#0A0A0B] min-h-screen text-white`}>
        <AuthProvider>
          <ClientLayout>
            <main className="pt-24">
              {children}
            </main>
          </ClientLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
