import { useState } from 'react';

export default function AuthorForm({ initialValues = {}, onSubmit, loading, error }) {
  const [name, setName] = useState(initialValues.name || '');
  const [biography, setBiography] = useState(initialValues.biography || '');
  const [bornDate, setBornDate] = useState(initialValues.born_date || '');
  const [photo, setPhoto] = useState(initialValues.photo || '');

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit({
      name,
      biography,
      born_date: bornDate || null,
      photo: photo || null,
    });
  }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 560 }}>
      {error && <p className="error-msg">{error.message}</p>}
      <div className="form-group">
        <label htmlFor="name">Name *</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="biography">Biography</label>
        <textarea
          id="biography"
          value={biography}
          onChange={(e) => setBiography(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="born_date">Date of Birth</label>
        <input
          id="born_date"
          type="date"
          value={bornDate}
          onChange={(e) => setBornDate(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label htmlFor="photo">Author Photo URL</label>
        <input
          id="photo"
          type="url"
          value={photo}
          onChange={(e) => setPhoto(e.target.value)}
          placeholder="https://example.com/photo.jpg"
        />
      </div>
      <button type="submit" className="btn btn-primary" disabled={loading}>
        {loading ? 'Saving...' : 'Save Author'}
      </button>
    </form>
  );
}
