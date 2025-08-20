import * as Types from 'generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type RenameWorkspaceMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  name: Types.Scalars['String']['input'];
}>;


export type RenameWorkspaceMutation = { __typename?: 'mutation_root', update_workspaces_by_pk?: { __typename?: 'workspaces', id: string, name?: string | null } | null };


export const RenameWorkspaceDocument = gql`
    mutation RenameWorkspace($id: uuid!, $name: String!) {
  update_workspaces_by_pk(pk_columns: {id: $id}, _set: {name: $name}) {
    id
    name
  }
}
    `;
export type RenameWorkspaceMutationFn = Apollo.MutationFunction<RenameWorkspaceMutation, RenameWorkspaceMutationVariables>;

/**
 * __useRenameWorkspaceMutation__
 *
 * To run a mutation, you first call `useRenameWorkspaceMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRenameWorkspaceMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [renameWorkspaceMutation, { data, loading, error }] = useRenameWorkspaceMutation({
 *   variables: {
 *      id: // value for 'id'
 *      name: // value for 'name'
 *   },
 * });
 */
export function useRenameWorkspaceMutation(baseOptions?: Apollo.MutationHookOptions<RenameWorkspaceMutation, RenameWorkspaceMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RenameWorkspaceMutation, RenameWorkspaceMutationVariables>(RenameWorkspaceDocument, options);
      }
export type RenameWorkspaceMutationHookResult = ReturnType<typeof useRenameWorkspaceMutation>;
export type RenameWorkspaceMutationResult = Apollo.MutationResult<RenameWorkspaceMutation>;
export type RenameWorkspaceMutationOptions = Apollo.BaseMutationOptions<RenameWorkspaceMutation, RenameWorkspaceMutationVariables>;