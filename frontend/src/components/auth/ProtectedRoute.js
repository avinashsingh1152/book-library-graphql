import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace(`/auth/login?redirect=${router.asPath}`);
    } else if (requireAdmin && !isAdmin) {
      router.replace('/');
    }
  }, [user, isAdmin, loading, requireAdmin, router]);

  if (loading || !user) return <p className="loading">Checking authentication...</p>;
  if (requireAdmin && !isAdmin) return <p className="loading">Access denied.</p>;
  return children;
}
