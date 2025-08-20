import * as Types from 'generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type SoftDeleteDocumentMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type SoftDeleteDocumentMutation = { __typename?: 'mutation_root', update_blocks_by_pk?: { __typename?: 'blocks', id: string } | null };

export type CreateUntitledPageMutationVariables = Types.Exact<{
  input: Types.BlocksInsertInput;
}>;


export type CreateUntitledPageMutation = { __typename?: 'mutation_root', insert_blocks_one?: { __typename?: 'blocks', id: string } | null };


export const SoftDeleteDocumentDocument = gql`
    mutation SoftDeleteDocument($id: uuid!) {
  update_blocks_by_pk(pk_columns: {id: $id}, _set: {deleted_at: "now()"}) {
    id
  }
}
    `;
export type SoftDeleteDocumentMutationFn = Apollo.MutationFunction<SoftDeleteDocumentMutation, SoftDeleteDocumentMutationVariables>;

/**
 * __useSoftDeleteDocumentMutation__
 *
 * To run a mutation, you first call `useSoftDeleteDocumentMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSoftDeleteDocumentMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [softDeleteDocumentMutation, { data, loading, error }] = useSoftDeleteDocumentMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSoftDeleteDocumentMutation(baseOptions?: Apollo.MutationHookOptions<SoftDeleteDocumentMutation, SoftDeleteDocumentMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SoftDeleteDocumentMutation, SoftDeleteDocumentMutationVariables>(SoftDeleteDocumentDocument, options);
      }
export type SoftDeleteDocumentMutationHookResult = ReturnType<typeof useSoftDeleteDocumentMutation>;
export type SoftDeleteDocumentMutationResult = Apollo.MutationResult<SoftDeleteDocumentMutation>;
export type SoftDeleteDocumentMutationOptions = Apollo.BaseMutationOptions<SoftDeleteDocumentMutation, SoftDeleteDocumentMutationVariables>;
export const CreateUntitledPageDocument = gql`
    mutation CreateUntitledPage($input: blocks_insert_input!) {
  insert_blocks_one(object: $input) {
    id
  }
}
    `;
export type CreateUntitledPageMutationFn = Apollo.MutationFunction<CreateUntitledPageMutation, CreateUntitledPageMutationVariables>;

/**
 * __useCreateUntitledPageMutation__
 *
 * To run a mutation, you first call `useCreateUntitledPageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUntitledPageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUntitledPageMutation, { data, loading, error }] = useCreateUntitledPageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateUntitledPageMutation(baseOptions?: Apollo.MutationHookOptions<CreateUntitledPageMutation, CreateUntitledPageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUntitledPageMutation, CreateUntitledPageMutationVariables>(CreateUntitledPageDocument, options);
      }
export type CreateUntitledPageMutationHookResult = ReturnType<typeof useCreateUntitledPageMutation>;
export type CreateUntitledPageMutationResult = Apollo.MutationResult<CreateUntitledPageMutation>;
export type CreateUntitledPageMutationOptions = Apollo.BaseMutationOptions<CreateUntitledPageMutation, CreateUntitledPageMutationVariables>;