'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLogo } from '@/lib/settings-context';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Blog Posts', href: '/admin/blog', icon: '📝' },
  { name: 'Case Studies', href: '/admin/case-studies', icon: '💼' },
  { name: 'Enquiries', href: '/admin/enquiries', icon: '📧' },
  { name: 'Media', href: '/admin/media', icon: '🖼️' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  { name: 'View Site', href: '/', icon: '🌐', external: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const { user, logout, isAuthenticated } = useAuth();
  const { logo, hasLogo, siteName } = useLogo();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Hide layout on login page
  if (pathname === '/login') {
    return <>{children}</>;
  }

  // Proper redirect (avoids render loop)
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/login');
    }
  }, [mounted, isAuthenticated, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-brand-grey-50">
      {/* ================= SIDEBAR ================= */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-brand-black text-white flex flex-col">

        {/* ✅ LOGO SECTION */}
        <div className="flex items-center justify-center h-24 border-b border-brand-grey-800 px-4">
          <Link href="/admin" className="flex items-center justify-center w-full">
            {hasLogo && logo ? (
              <img
                src={logo}
                alt={siteName || 'Logo'}
                className="h-16 w-auto max-w-full object-contain"
              />
            ) : (
              <span className="text-xl font-bold text-brand-yellow text-center px-4">
                {siteName || 'Admin Panel'}
              </span>
            )}
          </Link>
        </div>

        {/* ================= NAVIGATION ================= */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== '/admin' && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.name}
                href={item.href}
                target={item.external ? '_blank' : undefined}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive
                  ? 'bg-brand-yellow text-brand-black'
                  : 'text-brand-grey-300 hover:bg-brand-grey-800 hover:text-white'
                  }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* ================= USER SECTION ================= */}
        <div className="p-4 border-t border-brand-grey-800">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-medium">{user?.name || 'Admin'}</div>
              <div className="text-xs text-brand-grey-400">{user?.email}</div>
            </div>

            <button
              onClick={logout}
              className="text-brand-grey-400 hover:text-white transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN CONTENT ================= */}
      <main className="ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
}