import Link from 'next/link';
import { BOOK_PLACEHOLDER } from '../common/ImageUpload';

export default function BookCard({ book }) {
  return (
    <div className="card">
      <img
        src={book.cover_image || BOOK_PLACEHOLDER}
        alt={book.title}
        onError={(e) => { e.currentTarget.src = BOOK_PLACEHOLDER; }}
        style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, marginBottom: '0.6rem' }}
      />
      <h3 style={{ marginBottom: '0.4rem' }}>
        <Link href={`/books/${book.id}`}>{book.title}</Link>
      </h3>
      {book.author && (
        <p style={{ fontSize: '0.9rem', color: '#555', marginBottom: '0.4rem' }}>
          by{' '}
          <Link href={`/authors/${book.author.id}`}>{book.author.name}</Link>
        </p>
      )}
      {book.published_date && (
        <span className="badge">{book.published_date}</span>
      )}
      {book.description && (
        <p style={{ marginTop: '0.6rem', fontSize: '0.9rem', color: '#666' }}>
          {book.description.length > 120
            ? book.description.slice(0, 120) + '…'
            : book.description}
        </p>
      )}
    </div>
  );
}
