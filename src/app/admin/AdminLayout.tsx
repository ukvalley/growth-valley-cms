'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useLogo } from '@/lib/settings-context';

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: '📊' },
  { name: 'Content', href: '/admin/content', icon: '📄' },
  { name: 'Blog Posts', href: '/admin/blog', icon: '📝' },
  { name: 'Case Studies', href: '/admin/case-studies', icon: '💼' },
  { name: 'Testimonials', href: '/admin/testimonials', icon: '⭐' },
  { name: 'Team', href: '/admin/team', icon: '👥' },
  { name: 'Enquiries', href: '/admin/enquiries', icon: '📧' },
  { name: 'Settings', href: '/admin/settings', icon: '⚙️' },
  { name: 'View Site', href: '/', icon: '🌐', external: true },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, isAuthenticated, loading } = useAuth();
  const { logo: adminLogo, hasLogo, siteName } = useLogo();

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-brand-grey-50 dark:bg-brand-grey-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-black dark:border-white mx-auto mb-4"></div>
          <p className="text-brand-grey-500 dark:text-brand-grey-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    if (typeof window !== 'undefined') {
      router.push('/login');
    }
    return (
      <div className="min-h-screen bg-brand-grey-50 dark:bg-brand-grey-950 flex items-center justify-center">
        <div className="text-center">
          <p className="text-brand-grey-500 dark:text-brand-grey-400">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-brand-grey-50 dark:bg-brand-grey-950">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-brand-black text-white flex flex-col z-50">
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-brand-grey-800">
          <Link href="/admin" className="flex items-center gap-2">
            {hasLogo && adminLogo ? (
              <img 
                src={adminLogo} 
                alt={siteName}
                className="h-8 w-auto"
              />
            ) : (
              <span className="text-xl font-bold text-white">
                {siteName.split(' ')[0]}<span className="text-accent">{siteName.split(' ')[1] || ''}</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href || 
                (item.href !== '/admin' && pathname?.startsWith(item.href));
              
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-accent text-brand-black font-medium'
                        : 'text-brand-grey-300 hover:bg-brand-grey-800 hover:text-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-brand-grey-800">
          <div className="flex items-center justify-between">
            <div className="overflow-hidden mr-2">
              <div className="text-sm font-medium truncate">{user?.name || 'Admin'}</div>
              <div className="text-xs text-brand-grey-400 truncate">{user?.email}</div>
            </div>
            <button
              onClick={logout}
              className="p-2 text-brand-grey-400 hover:text-white transition-colors rounded-lg hover:bg-brand-grey-800 flex-shrink-0"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        {children}
      </main>
    </div>
  );
}