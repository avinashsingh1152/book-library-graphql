import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import Layout from '../../components/layout/Layout';
import AuthorForm from '../../components/authors/AuthorForm';
import ProtectedRoute from '../../components/auth/ProtectedRoute';
import { CREATE_AUTHOR } from '../../graphql/mutations/authorMutations';
import { GET_AUTHORS } from '../../graphql/queries/authorQueries';

export default function CreateAuthorPage() {
  const router = useRouter();
  const [createAuthor, { loading, error }] = useMutation(CREATE_AUTHOR, {
    refetchQueries: [{ query: GET_AUTHORS, variables: { page: 1, pageSize: 9 } }],
  });

  async function handleSubmit(values) {
    const { data } = await createAuthor({ variables: values });
    if (data?.createAuthor) {
      router.push(`/authors/${data.createAuthor.id}`);
    }
  }

  return (
    <Layout>
      <ProtectedRoute>
        <div className="page-header">
          <h1>Add New Author</h1>
        </div>
        <AuthorForm onSubmit={handleSubmit} loading={loading} error={error} />
      </ProtectedRoute>
    </Layout>
  );
}
