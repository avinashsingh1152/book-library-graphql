import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.push('/');
  }

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link href="/" className="navbar-brand">Book Library</Link>
        <ul className="navbar-links">
          <li><Link href="/books">Books</Link></li>
          <li><Link href="/authors">Authors</Link></li>
          {user ? (
            <>
              {isAdmin && <li><Link href="/books/create">+ Add Book</Link></li>}
              {isAdmin && <li><Link href="/authors/create">+ Add Author</Link></li>}
              <li>
                <button className="btn-logout" onClick={handleLogout}>
                  Sign Out
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link href="/auth/login">Sign In</Link></li>
              <li><Link href="/auth/register">Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}
