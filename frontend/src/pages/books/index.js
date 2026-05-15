import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import Link from 'next/link';
import Layout from '../../components/layout/Layout';
import BookList from '../../components/books/BookList';
import { GET_BOOKS } from '../../graphql/queries/bookQueries';
import { GET_AUTHORS_LIST } from '../../graphql/queries/authorQueries';
import { useAuth } from '../../context/AuthContext';

const SORT_OPTIONS = [
  { value: '', label: 'Default (newest first)' },
  { value: 'title_ASC', label: 'Title A → Z' },
  { value: 'title_DESC', label: 'Title Z → A' },
  { value: 'published_date_DESC', label: 'Release Date (newest)' },
  { value: 'published_date_ASC', label: 'Release Date (oldest)' },
  { value: 'author_name_ASC', label: 'Author A → Z' },
  { value: 'author_name_DESC', label: 'Author Z → A' },
];

export default function BooksPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [allBooks, setAllBooks] = useState([]);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [titleInput, setTitleInput] = useState('');
  const [titleFilter, setTitleFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [authorFilter, setAuthorFilter] = useState('');
  const [sortValue, setSortValue] = useState('');

  const { data: authorsData } = useQuery(GET_AUTHORS_LIST);
  const authorsList = authorsData?.authors?.authors || [];

  const lastUnderscore = sortValue.lastIndexOf('_');
  const sortBy = sortValue ? sortValue.slice(0, lastUnderscore) : '';
  const sortOrder = sortValue ? sortValue.slice(lastUnderscore + 1) : '';

  const { data, loading, error } = useQuery(GET_BOOKS, {
    variables: {
      page,
      pageSize: 9,
      title: titleFilter || undefined,
      published_date_from: dateFrom || undefined,
      published_date_to: dateTo || undefined,
      author_id: authorFilter || undefined,
      sortBy: sortBy || undefined,
      sortOrder: sortOrder || undefined,
    },
  });

  useEffect(() => {
    if (data?.books) {
      const { books, total: t, totalPages } = data.books;
      setTotal(t);
      if (page === 1) {
        setAllBooks(books);
      } else {
        setAllBooks((prev) => [...prev, ...books]);
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
    setTitleFilter(titleInput);
    resetFilters();
  }

  function clearFilters() {
    setTitleInput('');
    setTitleFilter('');
    setDateFrom('');
    setDateTo('');
    setAuthorFilter('');
    setSortValue('');
    resetFilters();
  }

  function handleSortChange(e) {
    setSortValue(e.target.value);
    resetFilters();
  }

  function handleAuthorFilterChange(e) {
    setAuthorFilter(e.target.value);
    resetFilters();
  }

  return (
    <Layout>
      <div className="page-header">
        <h1>Books</h1>
        {user && <Link href="/books/create" className="btn btn-primary">+ Add Book</Link>}
      </div>

      <div className="filter-bar">
        <form onSubmit={applyFilters} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 2 }}>Title</label>
            <input
              type="text"
              placeholder="Search by title..."
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 2 }}>Author</label>
            <select value={authorFilter} onChange={handleAuthorFilterChange} style={{ minWidth: 160 }}>
              <option value="">All Authors</option>
              {authorsList.map((a) => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 2 }}>Published Date From</label>
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={(e) => { setDateFrom(e.target.value); resetFilters(); }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', marginBottom: 2 }}>Published Date To</label>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => { setDateTo(e.target.value); resetFilters(); }}
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
      <BookList
        books={allBooks}
        total={total}
        hasMore={hasMore}
        loadMore={loadMore}
        loading={loading}
        page={page}
      />
    </Layout>
  );
}
