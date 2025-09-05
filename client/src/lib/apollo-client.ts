import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getSession } from 'next-auth/react';
import { offsetLimitPagination } from '@apollo/client/utilities';
import { nextFetchPolicy } from './nextFetchPolicy';

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

const TYPE_POLICIES = {
  query_root: {
    fields: {
      blocks: offsetLimitPagination(['where', 'order_by']),
    },
  },
};

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache({
    typePolicies: TYPE_POLICIES,
  }),
  defaultOptions: {
    watchQuery: {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy,
    },
},
});

export default client;