import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import { DELETE_BOOK } from '../../graphql/mutations/bookMutations';
import { BOOK_PLACEHOLDER } from '../common/ImageUpload';

export default function BookDetail({ book }) {
  const { isAdmin, user } = useAuth();
  const canEdit = isAdmin || (user && book.created_by === user.uid);
  const router = useRouter();
  const [deleteBook, { loading }] = useMutation(DELETE_BOOK);

  async function handleDelete() {
    if (!confirm('Delete this book?')) return;
    await deleteBook({ variables: { id: book.id } });
    router.push('/books');
  }

  return (
    <div>
      <img
        src={book.cover_image || BOOK_PLACEHOLDER}
        alt={book.title}
        onError={(e) => { e.currentTarget.src = BOOK_PLACEHOLDER; }}
        style={{ maxWidth: 220, maxHeight: 300, objectFit: 'cover', borderRadius: 8, marginBottom: '1rem', border: '1px solid #ddd' }}
      />
      <h1 style={{ marginBottom: '0.5rem' }}>{book.title}</h1>
      {book.author && (
        <p className="detail-meta">
          by <Link href={`/authors/${book.author.id}`}>{book.author.name}</Link>
        </p>
      )}
      {book.published_date && (
        <p className="detail-meta">Published: {book.published_date}</p>
      )}
      {book.description && (
        <p style={{ marginTop: '1rem', lineHeight: 1.7 }}>{book.description}</p>
      )}
      {canEdit && (
        <div className="detail-actions">
          <Link href={`/books/edit/${book.id}`} className="btn btn-secondary">Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
