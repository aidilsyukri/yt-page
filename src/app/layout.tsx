import type { Metadata } from 'next';
import { Suspense } from 'react';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import YouTubeNavbar from '@/components/youtube/Navbar';

export const metadata: Metadata = {
  title: 'PageNet — YouTube Explorer',
  description:
    'Explore YouTube videos, channels, and playlists. Search, discover, and dive deep into YouTube content.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Suspense fallback={null}>
            <YouTubeNavbar />
          </Suspense>
          <main className="min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
