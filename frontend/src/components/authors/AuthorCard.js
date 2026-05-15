import Link from 'next/link';
import { AUTHOR_PLACEHOLDER } from '../common/ImageUpload';

export default function AuthorCard({ author }) {
  return (
    <div className="card">
      <img
        src={author.photo || AUTHOR_PLACEHOLDER}
        alt={author.name}
        onError={(e) => { e.currentTarget.src = AUTHOR_PLACEHOLDER; }}
        style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: '50%', marginBottom: '0.6rem', border: '2px solid #eee' }}
      />
      <h3 style={{ marginBottom: '0.4rem' }}>
        <Link href={`/authors/${author.id}`}>{author.name}</Link>
      </h3>
      {author.born_date && (
        <span className="badge">Born: {author.born_date}</span>
      )}
      {author.biography && (
        <p style={{ marginTop: '0.6rem', fontSize: '0.9rem', color: '#666' }}>
          {author.biography.length > 120
            ? author.biography.slice(0, 120) + '…'
            : author.biography}
        </p>
      )}
    </div>
  );
}
