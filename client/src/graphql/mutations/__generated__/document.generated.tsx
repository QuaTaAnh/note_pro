import * as Types from 'generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type SoftDeleteDocumentMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type SoftDeleteDocumentMutation = { __typename?: 'mutation_root', update_blocks?: { __typename?: 'blocks_mutation_response', affected_rows: number, returning: Array<{ __typename?: 'blocks', id: string }> } | null };


export const SoftDeleteDocumentDocument = gql`
    mutation SoftDeleteDocument($id: uuid!) {
  update_blocks(where: {id: {_eq: $id}}, _set: {deleted_at: "now()"}) {
    affected_rows
    returning {
      id
    }
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