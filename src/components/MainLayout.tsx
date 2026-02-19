'use client';

import { usePathname } from 'next/navigation';
import { Navbar, Footer } from '@/components';

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show Navbar/Footer on admin routes
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/login');
  
  if (isAdminRoute) {
    return <>{children}</>;
  }
  
  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
}