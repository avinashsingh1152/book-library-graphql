import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import Layout from '../../components/layout/Layout';
import BookDetail from '../../components/books/BookDetail';
import { GET_BOOK } from '../../graphql/queries/bookQueries';

export function getStaticPaths() {
  return { paths: [], fallback: false };
}
export function getStaticProps() {
  return { props: {} };
}

export default function BookPage() {
  const { query } = useRouter();
  const { data, loading, error } = useQuery(GET_BOOK, {
    variables: { id: query.id },
    skip: !query.id,
  });

  return (
    <Layout>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error-msg">Error: {error.message}</p>}
      {data?.book && <BookDetail book={data.book} />}
      {!loading && !data?.book && !error && <p className="loading">Book not found.</p>}
    </Layout>
  );
}
