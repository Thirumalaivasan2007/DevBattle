import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/sonner';
import GlobalBattleListener from '@/components/GlobalBattleListener';

const inter = Inter({ subsets: ['latin'] });

import Providers from '@/components/Providers';
import PWARegistration from '@/components/pwa/PWARegistration';
import OfflineBanner from '@/components/pwa/OfflineBanner';
import NetworkStatus from '@/components/pwa/NetworkStatus';
import InstallPrompt from '@/components/pwa/InstallPrompt';
import MobileBottomNav from '@/components/pwa/MobileBottomNav';

export const metadata: Metadata = {
  title: 'DevBattle | Code. Compete. Conquer.',
  description: 'A modern competitive programming platform',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DevBattle',
  },
};

export const viewport = {
  themeColor: '#09090b',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script suppressHydrationWarning dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('unhandledrejection', function(event) {
              if (event.reason && typeof event.reason === 'object') {
                if (event.reason.type === 'cancelation' || event.reason.message === 'Canceled' || event.reason.name === 'Canceled') {
                  event.preventDefault();
                  event.stopImmediatePropagation();
                }
              }
            });
          `
        }} />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased`}>
        <PWARegistration />
        <Providers>
          <OfflineBanner />
          <NetworkStatus />
          <InstallPrompt />
          {children}
          <MobileBottomNav />
          <Toaster position="bottom-right" theme="dark" />
          <GlobalBattleListener />
        </Providers>
      </body>
    </html>
  );
}
