import * as Types from 'generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type GetAllDocsQueryVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
}>;


export type GetAllDocsQuery = { __typename?: 'query_root', blocks: Array<{ __typename?: 'blocks', id: string, content?: any | null, created_at?: string | null, updated_at?: string | null, folder?: { __typename?: 'folders', id: string, name: string } | null, sub_blocks: Array<{ __typename?: 'blocks', id: string, type: string, content?: any | null }> }> };

export type GetDocumentBlocksQueryVariables = Types.Exact<{
  pageId: Types.Scalars['uuid']['input'];
}>;


export type GetDocumentBlocksQuery = { __typename?: 'query_root', blocks: Array<{ __typename?: 'blocks', id: string, content?: any | null, position?: number | null, parent_id?: string | null, page_id?: string | null, type: string, created_at?: string | null, updated_at?: string | null }> };


export const GetAllDocsDocument = gql`
    query GetAllDocs($workspaceId: uuid!) {
  blocks(
    where: {workspace_id: {_eq: $workspaceId}, type: {_eq: "page"}, deleted_at: {_is_null: true}}
    order_by: {updated_at: desc}
  ) {
    id
    content
    created_at
    updated_at
    folder {
      id
      name
    }
    sub_blocks(order_by: {position: asc}, limit: 10) {
      id
      type
      content
    }
  }
}
    `;

/**
 * __useGetAllDocsQuery__
 *
 * To run a query within a React component, call `useGetAllDocsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllDocsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllDocsQuery({
 *   variables: {
 *      workspaceId: // value for 'workspaceId'
 *   },
 * });
 */
export function useGetAllDocsQuery(baseOptions: Apollo.QueryHookOptions<GetAllDocsQuery, GetAllDocsQueryVariables> & ({ variables: GetAllDocsQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllDocsQuery, GetAllDocsQueryVariables>(GetAllDocsDocument, options);
      }
export function useGetAllDocsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllDocsQuery, GetAllDocsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllDocsQuery, GetAllDocsQueryVariables>(GetAllDocsDocument, options);
        }
export function useGetAllDocsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAllDocsQuery, GetAllDocsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAllDocsQuery, GetAllDocsQueryVariables>(GetAllDocsDocument, options);
        }
export type GetAllDocsQueryHookResult = ReturnType<typeof useGetAllDocsQuery>;
export type GetAllDocsLazyQueryHookResult = ReturnType<typeof useGetAllDocsLazyQuery>;
export type GetAllDocsSuspenseQueryHookResult = ReturnType<typeof useGetAllDocsSuspenseQuery>;
export type GetAllDocsQueryResult = Apollo.QueryResult<GetAllDocsQuery, GetAllDocsQueryVariables>;
export const GetDocumentBlocksDocument = gql`
    query GetDocumentBlocks($pageId: uuid!) {
  blocks(
    where: {_or: [{id: {_eq: $pageId}}, {page_id: {_eq: $pageId}}], deleted_at: {_is_null: true}}
    order_by: {position: asc}
  ) {
    id
    content
    position
    parent_id
    page_id
    type
    created_at
    updated_at
  }
}
    `;

/**
 * __useGetDocumentBlocksQuery__
 *
 * To run a query within a React component, call `useGetDocumentBlocksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDocumentBlocksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDocumentBlocksQuery({
 *   variables: {
 *      pageId: // value for 'pageId'
 *   },
 * });
 */
export function useGetDocumentBlocksQuery(baseOptions: Apollo.QueryHookOptions<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables> & ({ variables: GetDocumentBlocksQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>(GetDocumentBlocksDocument, options);
      }
export function useGetDocumentBlocksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>(GetDocumentBlocksDocument, options);
        }
export function useGetDocumentBlocksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>(GetDocumentBlocksDocument, options);
        }
export type GetDocumentBlocksQueryHookResult = ReturnType<typeof useGetDocumentBlocksQuery>;
export type GetDocumentBlocksLazyQueryHookResult = ReturnType<typeof useGetDocumentBlocksLazyQuery>;
export type GetDocumentBlocksSuspenseQueryHookResult = ReturnType<typeof useGetDocumentBlocksSuspenseQuery>;
export type GetDocumentBlocksQueryResult = Apollo.QueryResult<GetDocumentBlocksQuery, GetDocumentBlocksQueryVariables>;