import { ApolloProvider } from '@apollo/client';
import { AuthProvider } from '../context/AuthContext';
import client from '../lib/apolloClient';
import '../styles/globals.css';

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ApolloProvider>
  );
}
