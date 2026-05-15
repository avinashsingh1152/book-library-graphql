import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { useAuth } from '../../context/AuthContext';
import { DELETE_AUTHOR } from '../../graphql/mutations/authorMutations';
import { AUTHOR_PLACEHOLDER } from '../common/ImageUpload';

export default function AuthorDetail({ author }) {
  const { isAdmin, user } = useAuth();
  const canEdit = isAdmin || (user && author.created_by === user.uid);
  const router = useRouter();
  const [deleteAuthor, { loading }] = useMutation(DELETE_AUTHOR);

  async function handleDelete() {
    if (!confirm('Delete this author? Their books will remain.')) return;
    await deleteAuthor({ variables: { id: author.id } });
    router.push('/authors');
  }

  return (
    <div>
      <img
        src={author.photo || AUTHOR_PLACEHOLDER}
        alt={author.name}
        onError={(e) => { e.currentTarget.src = AUTHOR_PLACEHOLDER; }}
        style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: '50%', marginBottom: '1rem', border: '3px solid #eee' }}
      />
      <h1 style={{ marginBottom: '0.5rem' }}>{author.name}</h1>
      {author.born_date && (
        <p className="detail-meta">Born: {author.born_date}</p>
      )}
      {author.biography && (
        <p style={{ marginTop: '1rem', lineHeight: 1.7 }}>{author.biography}</p>
      )}
      {author.books && author.books.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '0.75rem', fontSize: '1.1rem' }}>Books</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {author.books.map((book) => (
              <li key={book.id}>
                <Link href={`/books/${book.id}`}>{book.title}</Link>
                {book.published_date && (
                  <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: '0.5rem' }}>
                    ({book.published_date})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {canEdit && (
        <div className="detail-actions">
          <Link href={`/authors/edit/${author.id}`} className="btn btn-secondary">Edit</Link>
          <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
            {loading ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      )}
    </div>
  );
}
