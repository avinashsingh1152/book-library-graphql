import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import Layout from '../../../components/layout/Layout';
import BookForm from '../../../components/books/BookForm';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import { GET_BOOK } from '../../../graphql/queries/bookQueries';
import { UPDATE_BOOK } from '../../../graphql/mutations/bookMutations';

export function getStaticPaths() {
  return { paths: [], fallback: false };
}
export function getStaticProps() {
  return { props: {} };
}

export default function EditBookPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAdmin, user } = useAuth();

  const { data, loading: fetching } = useQuery(GET_BOOK, {
    variables: { id },
    skip: !id,
  });

  const [updateBook, { loading: saving, error }] = useMutation(UPDATE_BOOK);

  async function handleSubmit(values) {
    await updateBook({ variables: { id, ...values } });
    router.push(`/books/${id}`);
  }

  const book = data?.book;
  const canEdit = book && (isAdmin || (user && book.created_by === user.uid));

  return (
    <Layout>
      <ProtectedRoute>
        <div className="page-header">
          <h1>Edit Book</h1>
        </div>
        {fetching && <p className="loading">Loading book...</p>}
        {book && !canEdit && <p className="error-msg">You do not have permission to edit this book.</p>}
        {book && canEdit && (
          <BookForm
            initialValues={book}
            onSubmit={handleSubmit}
            loading={saving}
            error={error}
          />
        )}
      </ProtectedRoute>
    </Layout>
  );
}
