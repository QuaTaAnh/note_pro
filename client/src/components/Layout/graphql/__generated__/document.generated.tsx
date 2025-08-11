import * as Types from 'generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type CreateUntitledPageMutationVariables = Types.Exact<{
  workspaceId: Types.Scalars['uuid']['input'];
  userId: Types.Scalars['uuid']['input'];
  folderId?: Types.InputMaybe<Types.Scalars['uuid']['input']>;
}>;


export type CreateUntitledPageMutation = { __typename?: 'mutation_root', insert_blocks_one?: { __typename?: 'blocks', id: string } | null };


export const CreateUntitledPageDocument = gql`
    mutation CreateUntitledPage($workspaceId: uuid!, $userId: uuid!, $folderId: uuid) {
  insert_blocks_one(
    object: {type: "page", workspace_id: $workspaceId, folder_id: $folderId, user_id: $userId, content: {title: "Untitled Page"}, position: 0}
  ) {
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
 *      workspaceId: // value for 'workspaceId'
 *      userId: // value for 'userId'
 *      folderId: // value for 'folderId'
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