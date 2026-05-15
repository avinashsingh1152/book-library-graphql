import { useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_AUTHORS_LIST } from '../../graphql/queries/authorQueries';
import { useAuth } from '../../context/AuthContext';

export default function BookForm({ initialValues = {}, onSubmit, loading, error }) {
  const { isAdmin, user } = useAuth();
  const [title, setTitle] = useState(initialValues.title || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [publishedDate, setPublishedDate] = useState(initialValues.published_date || '');
  const [coverImage, setCoverImage] = useState(initialValues.cover_image || '');
  const [authorId, setAuthorId] = useState(initialValues.author_id || '');

  // Admins see all authors; regular users see only their own
  const { data: authorsData } = useQuery(GET_AUTHORS_LIST, {
    variables: isAdmin ? {} : { created_by: user?.uid },
    skip: !user,
  });
  const authors = authorsData?.authors?.authors || [];

  function handleSubmit(e) {
    e.preventDefault();
    if (publishedDate && publishedDate > new Date().toISOString().slice(0, 10)) {
      alert('Published date cannot be in the future.');
      return;
    }
    onSubmit({
      title,
      description,
      published_date: publishedDate || null,
      cover_image: coverImage || null,
      author_id: authorId || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      {error && <p className="error-msg">{error.message}</p>}
      <div className="form-group">
        <label htmlFor="title">Title *</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="published_date">Published Date</label>
        <input
          id="published_date"
          type="date"
          value={publishedDate}
          max={new Date().toISOString().slice(0, 10)}
          onChange={(e) => setPublishedDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="cover_image">Cover Image URL</label>
        <input
          id="cover_image"
          type="url"
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          placeholder="https://example.com/cover.jpg"
        />
      </div>
      <div className="form-group">
        <label htmlFor="author">Author</label>
        {authors.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: '#888', margin: '0.25rem 0' }}>
            No authors found.{!isAdmin && ' Add an author first before creating a book.'}
          </p>
        ) : (
          <select
            id="author"
            value={authorId}
            onChange={(e) => setAuthorId(e.target.value)}
          >
            <option value="">-- Select Author --</option>
            {authors.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        )}
      </div>
      <div style={{ display: 'flex', gap: '0.75rem' }}>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save Book'}
        </button>
      </div>
    </form>
  );
}
