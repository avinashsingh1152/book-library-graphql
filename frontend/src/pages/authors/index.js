import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import AuthorList from '../../components/authors/AuthorList';
import { GET_AUTHORS } from '../../graphql/queries/authorQueries';
import { useAuth } from '../../context/AuthContext';

const SORT_OPTIONS = [
  { value: 'name_ASC', label: 'Name A → Z' },
  { value: 'name_DESC', label: 'Name Z → A' },
  { value: 'born_date_DESC', label: 'Birth Date (newest)' },
  { value: 'born_date_ASC', label: 'Birth Date (oldest)' },
];

export default function AuthorsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [allAuthors, setAllAuthors] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [nameInput, setNameInput] = useState('');
  const [nameFilter, setNameFilter] = useState('');
  const [birthYear, setBirthYear] = useState('');
  const [sortValue, setSortValue] = useState('name_ASC');

  const lastUnderscore = sortValue.lastIndexOf('_');
  const sortBy = sortValue.slice(0, lastUnderscore);
  const sortOrder = sortValue.slice(lastUnderscore + 1);

  const { data, loading, error } = useQuery(GET_AUTHORS, {
    variables: {
      page,
      pageSize: 9,
      name: nameFilter || undefined,
      birth_year: birthYear ? parseInt(birthYear) : undefined,
      sortBy,
      sortOrder,
    },
  });

  useEffect(() => {
    if (data?.authors) {
      const { authors, total: t, totalPages } = data.authors;
      setTotal(t);
      if (page === 1) {
        setAllAuthors(authors);
      } else {
        setAllAuthors((prev) => [...prev, ...authors]);
      }
      setHasMore(page < totalPages);
    }
  }, [data, page]);

  const loadMore = useCallback(() => {
    setPage((prev) => prev + 1);
  }, []);

  function resetFilters() {
    setPage(1);
    setHasMore(true);
  }

  function applyFilters(e) {
    e.preventDefault();
    setNameFilter(nameInput);
    resetFilters();
  }

  function clearFilters() {
    setNameInput('');
    setNameFilter('');
    setBirthYear('');
    setSortValue('name_ASC');
    resetFilters();
  }

  function handleSortChange(e) {
    setSortValue(e.target.value);
    resetFilters();
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Authors</h1>
        {user && <Link href="/authors/create" className="btn btn-primary">+ Add Author</Link>}
      </div>

      <div className="filter-bar">
        <form onSubmit={applyFilters} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 2 }}>Name</label>
            <input
              type="text"
              placeholder="Search by name..."
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 2 }}>Birth Year</label>
            <input
              type="number"
              placeholder="e.g. 1950"
              value={birthYear}
              onChange={(e) => { setBirthYear(e.target.value); resetFilters(); }}
              style={{ width: 100 }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 2 }}>Sort By</label>
            <select value={sortValue} onChange={handleSortChange} style={{ minWidth: 180 }}>
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn btn-primary">Search</button>
          <button type="button" className="btn btn-secondary" onClick={clearFilters}>Clear</button>
        </form>
      </div>

      {error && <p className="error-msg">Error: {error.message}</p>}
      <AuthorList
        authors={allAuthors}
        total={total}
        hasMore={hasMore}
        loadMore={loadMore}
        loading={loading}
        page={page}
      />
    </Layout>
  );
}
