import { AuthProvider } from '@/lib/auth-context';
import './admin.css';

export const metadata = {
  title: 'Admin Dashboard | Growth Valley',
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  );
}