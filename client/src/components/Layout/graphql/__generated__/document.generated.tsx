import * as Types from 'generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type CreateUntitledPageMutationVariables = Types.Exact<{
  input: Types.BlocksInsertInput;
}>;


export type CreateUntitledPageMutation = { __typename?: 'mutation_root', insert_blocks_one?: { __typename?: 'blocks', id: string } | null };


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