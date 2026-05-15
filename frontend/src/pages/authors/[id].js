import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import Layout from '../../components/layout/Layout';
import AuthorDetail from '../../components/authors/AuthorDetail';
import { GET_AUTHOR } from '../../graphql/queries/authorQueries';

export function getStaticPaths() {
  return { paths: [], fallback: false };
}
export function getStaticProps() {
  return { props: {} };
}

export default function AuthorPage() {
  const { query } = useRouter();
  const { data, loading, error } = useQuery(GET_AUTHOR, {
    variables: { id: query.id },
    skip: !query.id,
  });

  return (
    <Layout>
      {loading && <p className="loading">Loading...</p>}
      {error && <p className="error-msg">Error: {error.message}</p>}
      {data?.author && <AuthorDetail author={data.author} />}
      {!loading && !data?.author && !error && <p className="loading">Author not found.</p>}
    </Layout>
  );
}
