import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type GetFoldersQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
}>;


export type GetFoldersQuery = { __typename?: 'query_root', folders: Array<{ __typename?: 'folders', id: string, name: string, description?: string | null, color?: string | null, icon?: string | null, parent_id?: string | null, created_at?: string | null }> };


export const GetFoldersDocument = gql`
    query GetFolders($workspaceId: uuid!) {
  folders(
    order_by: {created_at: desc}
    where: {workspace_id: {_eq: $workspaceId}}
  ) {
    id
    name
    description
    color
    icon
    parent_id
    created_at
  }
}
    `;

/**
 * __useGetFoldersQuery__
 *
 * To run a query within a React component, call `useGetFoldersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetFoldersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetFoldersQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetFoldersQuery(baseOptions: Apollo.QueryHookOptions<GetFoldersQuery, GetFoldersQueryVariables> & ({ variables: GetFoldersQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetFoldersQuery, GetFoldersQueryVariables>(GetFoldersDocument, options);
      }
export function useGetFoldersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetFoldersQuery, GetFoldersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetFoldersQuery, GetFoldersQueryVariables>(GetFoldersDocument, options);
        }
export function useGetFoldersSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetFoldersQuery, GetFoldersQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetFoldersQuery, GetFoldersQueryVariables>(GetFoldersDocument, options);
        }
export type GetFoldersQueryHookResult = ReturnType<typeof useGetFoldersQuery>;
export type GetFoldersLazyQueryHookResult = ReturnType<typeof useGetFoldersLazyQuery>;
export type GetFoldersSuspenseQueryHookResult = ReturnType<typeof useGetFoldersSuspenseQuery>;
export type GetFoldersQueryResult = Apollo.QueryResult<GetFoldersQuery, GetFoldersQueryVariables>;