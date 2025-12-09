import * as Types from "generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = { ignoreResults: true } as const;
export type GetWorkspaceByUserIdQueryVariables = Types.Exact<{
  userId: Types.Scalars["uuid"]["input"];
}>;

export type GetWorkspaceByUserIdQuery = {
  __typename?: "query_root";
  workspaces: Array<{
    __typename?: "workspaces";
    id: string;
    name?: string | null;
    image_url?: string | null;
  }>;
};

export type GetWorkspaceByIdQueryVariables = Types.Exact<{
  id: Types.Scalars["uuid"]["input"];
}>;

export type GetWorkspaceByIdQuery = {
  __typename?: "query_root";
  workspaces_by_pk?: {
    __typename?: "workspaces";
    id: string;
    name?: string | null;
    image_url?: string | null;
  } | null;
};

export const GetWorkspaceByUserIdDocument = gql`
  query GetWorkspaceByUserId($userId: uuid!) {
    workspaces(where: { created_by: { _eq: $userId } }) {
      id
      name
      image_url
    }
  }
`;

/**
 * __useGetWorkspaceByUserIdQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceByUserIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceByUserIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceByUserIdQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetWorkspaceByUserIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetWorkspaceByUserIdQuery,
    GetWorkspaceByUserIdQueryVariables
  > &
    (
      | { variables: GetWorkspaceByUserIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetWorkspaceByUserIdQuery,
    GetWorkspaceByUserIdQueryVariables
  >(GetWorkspaceByUserIdDocument, options);
}
export function useGetWorkspaceByUserIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetWorkspaceByUserIdQuery,
    GetWorkspaceByUserIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetWorkspaceByUserIdQuery,
    GetWorkspaceByUserIdQueryVariables
  >(GetWorkspaceByUserIdDocument, options);
}
export function useGetWorkspaceByUserIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetWorkspaceByUserIdQuery,
        GetWorkspaceByUserIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetWorkspaceByUserIdQuery,
    GetWorkspaceByUserIdQueryVariables
  >(GetWorkspaceByUserIdDocument, options);
}
export type GetWorkspaceByUserIdQueryHookResult = ReturnType<
  typeof useGetWorkspaceByUserIdQuery
>;
export type GetWorkspaceByUserIdLazyQueryHookResult = ReturnType<
  typeof useGetWorkspaceByUserIdLazyQuery
>;
export type GetWorkspaceByUserIdSuspenseQueryHookResult = ReturnType<
  typeof useGetWorkspaceByUserIdSuspenseQuery
>;
export type GetWorkspaceByUserIdQueryResult = Apollo.QueryResult<
  GetWorkspaceByUserIdQuery,
  GetWorkspaceByUserIdQueryVariables
>;
export const GetWorkspaceByIdDocument = gql`
  query GetWorkspaceById($id: uuid!) {
    workspaces_by_pk(id: $id) {
      id
      name
      image_url
    }
  }
`;

/**
 * __useGetWorkspaceByIdQuery__
 *
 * To run a query within a React component, call `useGetWorkspaceByIdQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetWorkspaceByIdQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetWorkspaceByIdQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetWorkspaceByIdQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetWorkspaceByIdQuery,
    GetWorkspaceByIdQueryVariables
  > &
    (
      | { variables: GetWorkspaceByIdQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<GetWorkspaceByIdQuery, GetWorkspaceByIdQueryVariables>(
    GetWorkspaceByIdDocument,
    options,
  );
}
export function useGetWorkspaceByIdLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetWorkspaceByIdQuery,
    GetWorkspaceByIdQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetWorkspaceByIdQuery,
    GetWorkspaceByIdQueryVariables
  >(GetWorkspaceByIdDocument, options);
}
export function useGetWorkspaceByIdSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetWorkspaceByIdQuery,
        GetWorkspaceByIdQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetWorkspaceByIdQuery,
    GetWorkspaceByIdQueryVariables
  >(GetWorkspaceByIdDocument, options);
}
export type GetWorkspaceByIdQueryHookResult = ReturnType<
  typeof useGetWorkspaceByIdQuery
>;
export type GetWorkspaceByIdLazyQueryHookResult = ReturnType<
  typeof useGetWorkspaceByIdLazyQuery
>;
export type GetWorkspaceByIdSuspenseQueryHookResult = ReturnType<
  typeof useGetWorkspaceByIdSuspenseQuery
>;
export type GetWorkspaceByIdQueryResult = Apollo.QueryResult<
  GetWorkspaceByIdQuery,
  GetWorkspaceByIdQueryVariables
>;
