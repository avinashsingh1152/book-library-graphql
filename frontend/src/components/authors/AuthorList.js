import { useEffect, useRef } from 'react';
import AuthorCard from './AuthorCard';

export default function AuthorList({ authors, total, hasMore, loadMore, loading, page }) {
  const sentinelRef = useRef(null);
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);

  useEffect(() => { loadingRef.current = loading; }, [loading]);
  useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasMoreRef.current && !loadingRef.current) {
        loadMore();
      }
    }, { rootMargin: '300px' });
    observer.observe(el);
    return () => observer.disconnect();
  }, [loadMore]);

  // After a fetch completes, check if sentinel is still in view (short list edge case)
  useEffect(() => {
    if (!loading && hasMore && sentinelRef.current) {
      const rect = sentinelRef.current.getBoundingClientRect();
      if (rect.top < window.innerHeight + 300) {
        loadMore();
      }
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading && page === 1 && authors.length === 0) {
    return <p className="loading">Loading authors...</p>;
  }

  if (!loading && authors.length === 0) {
    return <p style={{ color: '#888', textAlign: 'center', padding: '2rem' }}>No authors found.</p>;
  }

  return (
    <>
      <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
        {total} author{total !== 1 ? 's' : ''} found
      </p>
      <div className="card-grid">
        {authors.map((author) => (
          <AuthorCard key={author.id} author={author} />
        ))}
      </div>
      <div ref={sentinelRef} className="infinite-scroll-sentinel">
        {loading && page > 1 && <p className="loading">Loading more authors...</p>}
        {!hasMore && authors.length > 0 && (
          <p className="scroll-end-msg">You&apos;ve reached the end</p>
        )}
      </div>
    </>
  );
}
