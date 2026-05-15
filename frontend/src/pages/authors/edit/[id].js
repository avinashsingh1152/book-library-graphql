import { useRouter } from 'next/router';
import { useQuery, useMutation } from '@apollo/client';
import Layout from '../../../components/layout/Layout';
import AuthorForm from '../../../components/authors/AuthorForm';
import ProtectedRoute from '../../../components/auth/ProtectedRoute';
import { useAuth } from '../../../context/AuthContext';
import { GET_AUTHOR } from '../../../graphql/queries/authorQueries';
import { UPDATE_AUTHOR } from '../../../graphql/mutations/authorMutations';

export function getStaticPaths() {
  return { paths: [], fallback: false };
}
export function getStaticProps() {
  return { props: {} };
}

export default function EditAuthorPage() {
  const router = useRouter();
  const { id } = router.query;
  const { isAdmin, user } = useAuth();

  const { data, loading: fetching } = useQuery(GET_AUTHOR, {
    variables: { id },
    skip: !id,
  });

  const [updateAuthor, { loading: saving, error }] = useMutation(UPDATE_AUTHOR);

  async function handleSubmit(values) {
    await updateAuthor({ variables: { id, ...values } });
    router.push(`/authors/${id}`);
  }

  const author = data?.author;
  const canEdit = author && (isAdmin || (user && author.created_by === user.uid));

  return (
    <Layout>
      <ProtectedRoute>
        <div className="page-header">
          <h1>Edit Author</h1>
        </div>
        {fetching && <p className="loading">Loading author...</p>}
        {author && !canEdit && <p className="error-msg">You do not have permission to edit this author.</p>}
        {author && canEdit && (
          <AuthorForm
            initialValues={author}
            onSubmit={handleSubmit}
            loading={saving}
            error={error}
          />
        )}
      </ProtectedRoute>
    </Layout>
  );
}
