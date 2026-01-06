import * as Types from '@/types/generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type InsertFolderMutationVariables = Types.Exact<{
  input: Types.FoldersInsertInput;
}>;


export type InsertFolderMutation = { __typename?: 'mutation_root', insert_folders_one?: { __typename?: 'folders', id: string, name: string, description?: string | null, color?: string | null, icon?: string | null, created_at?: string | null } | null };


export const InsertFolderDocument = gql`
    mutation InsertFolder($input: folders_insert_input!) {
  insert_folders_one(object: $input) {
    id
    name
    description
    color
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