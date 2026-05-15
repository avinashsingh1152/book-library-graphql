import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import Layout from '../../components/layout/Layout';
import BookForm from '../../components/books/BookForm';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { CREATE_BOOK } from '../../graphql/mutations/bookMutations';
import { GET_BOOKS } from '../../graphql/queries/bookQueries';

export default function CreateBookPage() {
  const router = useRouter();
  const [createBook, { loading, error }] = useMutation(CREATE_BOOK, {
    refetchQueries: [{ query: GET_BOOKS, variables: { page: 1, pageSize: 9 } }],
  });

  async function handleSubmit(values) {
    const { data } = await createBook({ variables: values });
    if (data?.createBook) {
      router.push(`/books/${data.createBook.id}`);
    }
  }

  return (
    <Layout>
      <ProtectedRoute>
        <div className="page-header">
          <h1>Add New Book</h1>
        </div>
        <BookForm onSubmit={handleSubmit} loading={loading} error={error} />
      </ProtectedRoute>
    </Layout>
  );
}
