import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/lib/store';
import { AuthProvider } from '@/lib/auth-store';
import { DemoModeProvider } from '@/lib/demo-mode-store';
import { DemoStatusBanner } from '@/components/demo/demo-status-banner';
import { SessionProvider } from '@/components/providers/session-provider';
import { Navbar } from '@/components/navbar';
import { RandomStudentPickerModal } from '@/components/random-student-picker';
import { EnforceProfileGuard } from '@/components/auth/enforce-profile-guard';
import { PwaInstallBanner } from '@/components/pwa-install-banner';

export const viewport: Viewport = {
  themeColor: '#0d9488',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Maarif Akademi – Kademeli Akıllı Tahta ve İnteraktif Dersler Platformu',
  description:
    'Türkiye Yüzyılı Maarif Modeli müfredatına tam uyumlu, akıllı tahta öğretmen sunum ve interaktif öğrenci ders platformu.',
  manifest: '/manifest.webmanifest',
  applicationName: 'Maarif Akademi',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Maarif Akademi',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16.png', type: 'image/png', sizes: '16x16' },
      { url: '/logo-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/logo-512.png', type: 'image/png', sizes: '512x512' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico'
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="tr" className="h-full">
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased selection:bg-teal-500 selection:text-white">
        <SessionProvider>
          <DemoModeProvider>
            <AuthProvider>
              <AppProvider>
                <DemoStatusBanner />
                <Navbar />
                <EnforceProfileGuard />
                <main className="flex-1 w-full">
                  {children}
                </main>
                <RandomStudentPickerModal />
                <PwaInstallBanner />
              </AppProvider>
            </AuthProvider>
          </DemoModeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
