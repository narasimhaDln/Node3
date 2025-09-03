'use client'; // client component

import './globals.css';
import Providers from '../components/Providers';
import { Geist, Geist_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Footer from '../pages/Footer';
import Navbar from '../pages/Navbar';
import { useRouter, usePathname } from 'next/navigation';
import { useState } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// ❌ remove metadata, not allowed in client component

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (query: string) => {
    if (pathname !== '/dashboard') {
      if (query.trim()) {
        router.push(`/dashboard?search=${encodeURIComponent(query.trim())}`);
      } else {
        router.push('/dashboard');
      }
    } else {
      if (query.trim()) {
        router.replace(
          `/dashboard?search=${encodeURIComponent(query.trim())}`,
          { scroll: false },
        );
      } else {
        router.replace('/dashboard', { scroll: false });
      }
    }
  };

  const handleClearSearch = () => {
    if (pathname === '/dashboard') {
      router.replace('/dashboard', { scroll: false });
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <Navbar
            onSearch={handleSearch}
            onClearSearch={handleClearSearch}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          {children}
          <Footer />
        </Providers>
        <Toaster position="top-right" reverseOrder={false} />
      </body>
    </html>
  );
}
