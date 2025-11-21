import * as Types from 'generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type SearchUsersByEmailQueryVariables = Types.Exact<{
  searchTerm: Types.Scalars['String']['input'];
}>;


export type SearchUsersByEmailQuery = { __typename?: 'query_root', users: Array<{ __typename?: 'users', id: string, email: string, name?: string | null, avatar_url?: string | null }> };


export const SearchUsersByEmailDocument = gql`
    query SearchUsersByEmail($searchTerm: String!) {
  users(where: {email: {_ilike: $searchTerm}}, limit: 10) {
    id
    email
    name
    avatar_url
  }
}
    `;

/**
 * __useSearchUsersByEmailQuery__
 *
 * To run a query within a React component, call `useSearchUsersByEmailQuery` and pass it any options that fit your needs.
 * When your component renders, `useSearchUsersByEmailQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useSearchUsersByEmailQuery({
 *   variables: {
 *      searchTerm: // value for 'searchTerm'
 *   },
 * });
 */
export function useSearchUsersByEmailQuery(baseOptions: Apollo.QueryHookOptions<SearchUsersByEmailQuery, SearchUsersByEmailQueryVariables> & ({ variables: SearchUsersByEmailQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<SearchUsersByEmailQuery, SearchUsersByEmailQueryVariables>(SearchUsersByEmailDocument, options);
      }
export function useSearchUsersByEmailLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<SearchUsersByEmailQuery, SearchUsersByEmailQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<SearchUsersByEmailQuery, SearchUsersByEmailQueryVariables>(SearchUsersByEmailDocument, options);
        }
export function useSearchUsersByEmailSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<SearchUsersByEmailQuery, SearchUsersByEmailQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<SearchUsersByEmailQuery, SearchUsersByEmailQueryVariables>(SearchUsersByEmailDocument, options);
        }
export type SearchUsersByEmailQueryHookResult = ReturnType<typeof useSearchUsersByEmailQuery>;
export type SearchUsersByEmailLazyQueryHookResult = ReturnType<typeof useSearchUsersByEmailLazyQuery>;
export type SearchUsersByEmailSuspenseQueryHookResult = ReturnType<typeof useSearchUsersByEmailSuspenseQuery>;
export type SearchUsersByEmailQueryResult = Apollo.QueryResult<SearchUsersByEmailQuery, SearchUsersByEmailQueryVariables>;