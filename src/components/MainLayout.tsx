'use client';

import { usePathname } from 'next/navigation';
import { Navbar, Footer } from '@/components';
import DynamicFavicon from './DynamicFavicon';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Don't show Navbar/Footer on admin routes
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/login');

  if (isAdminRoute) {
    return (
      <>
        <DynamicFavicon />
        {children}
      </>
    );
  }

  return (
    <>
      <DynamicFavicon />
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}