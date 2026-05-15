import Link from 'next/link';
import Layout from '../components/layout/Layout';

export default function Home() {
  return (
    <Layout>
      <div className="hero">
        <h1>Book Library</h1>
        <p>Browse books and authors, or sign in to manage the collection.</p>
        <div className="hero-links">
          <Link href="/books" className="btn btn-primary">Browse Books</Link>
          <Link href="/authors" className="btn btn-secondary">Browse Authors</Link>
        </div>
      </div>
    </Layout>
  );
}
