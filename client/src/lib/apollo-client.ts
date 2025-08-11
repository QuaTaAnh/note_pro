import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';

const httpLink = createHttpLink({
  uri: `${process.env.NEXT_PUBLIC_HASURA_SERVER_ENDPOINT}/v1/graphql`,
});

const authLink = setContext(async (_, { headers }) => {
  const session = await getSession();
  const token = session?.token;
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      errorPolicy: 'all',
    },
    query: {
      errorPolicy: 'all',
    },
  },
});

export default client;