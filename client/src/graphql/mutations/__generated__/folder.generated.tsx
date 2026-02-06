import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type InsertFolderMutationVariables = Types.Exact<{
  input: Types.FoldersInsertInput;
}>;


export type InsertFolderMutation = { __typename?: 'mutation_root', insert_folders_one?: { __typename?: 'folders', id: string, name: string, description?: string | null, icon?: string | null, created_at?: string | null } | null };

export type UpdateFolderMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  input: Types.FoldersSetInput;
}>;


export type UpdateFolderMutation = { __typename?: 'mutation_root', update_folders_by_pk?: { __typename?: 'folders', id: string, name: string, description?: string | null, icon?: string | null } | null };

export type DeleteFolderMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type DeleteFolderMutation = { __typename?: 'mutation_root', delete_folders_by_pk?: { __typename?: 'folders', id: string } | null };


export const InsertFolderDocument = gql`
    mutation InsertFolder($input: folders_insert_input!) {
  insert_folders_one(object: $input) {
    id
    name
    description
    icon
    created_at
  }
}
    `;
export type InsertFolderMutationFn = Apollo.MutationFunction<InsertFolderMutation, InsertFolderMutationVariables>;

/**
 * __useInsertFolderMutation__
 *
 * To run a mutation, you first call `useInsertFolderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertFolderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertFolderMutation, { data, loading, error }] = useInsertFolderMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useInsertFolderMutation(baseOptions?: Apollo.MutationHookOptions<InsertFolderMutation, InsertFolderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertFolderMutation, InsertFolderMutationVariables>(InsertFolderDocument, options);
      }
export type InsertFolderMutationHookResult = ReturnType<typeof useInsertFolderMutation>;
export type InsertFolderMutationResult = Apollo.MutationResult<InsertFolderMutation>;
export type InsertFolderMutationOptions = Apollo.BaseMutationOptions<InsertFolderMutation, InsertFolderMutationVariables>;
export const UpdateFolderDocument = gql`
    mutation UpdateFolder($id: uuid!, $input: folders_set_input!) {
  update_folders_by_pk(pk_columns: {id: $id}, _set: $input) {
    id
    name
    description
    icon
  }
}
    `;
export type UpdateFolderMutationFn = Apollo.MutationFunction<UpdateFolderMutation, UpdateFolderMutationVariables>;

/**
 * __useUpdateFolderMutation__
 *
 * To run a mutation, you first call `useUpdateFolderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateFolderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateFolderMutation, { data, loading, error }] = useUpdateFolderMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateFolderMutation(baseOptions?: Apollo.MutationHookOptions<UpdateFolderMutation, UpdateFolderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateFolderMutation, UpdateFolderMutationVariables>(UpdateFolderDocument, options);
      }
export type UpdateFolderMutationHookResult = ReturnType<typeof useUpdateFolderMutation>;
export type UpdateFolderMutationResult = Apollo.MutationResult<UpdateFolderMutation>;
export type UpdateFolderMutationOptions = Apollo.BaseMutationOptions<UpdateFolderMutation, UpdateFolderMutationVariables>;
export const DeleteFolderDocument = gql`
    mutation DeleteFolder($id: uuid!) {
  delete_folders_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteFolderMutationFn = Apollo.MutationFunction<DeleteFolderMutation, DeleteFolderMutationVariables>;

/**
 * __useDeleteFolderMutation__
 *
 * To run a mutation, you first call `useDeleteFolderMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteFolderMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteFolderMutation, { data, loading, error }] = useDeleteFolderMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteFolderMutation(baseOptions?: Apollo.MutationHookOptions<DeleteFolderMutation, DeleteFolderMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteFolderMutation, DeleteFolderMutationVariables>(DeleteFolderDocument, options);
      }
export type DeleteFolderMutationHookResult = ReturnType<typeof useDeleteFolderMutation>;
export type DeleteFolderMutationResult = Apollo.MutationResult<DeleteFolderMutation>;
export type DeleteFolderMutationOptions = Apollo.BaseMutationOptions<DeleteFolderMutation, DeleteFolderMutationVariables>;