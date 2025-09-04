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

export type UpdateBlockMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  input: Types.BlocksSetInput;
}>;


export type UpdateBlockMutation = { __typename?: 'mutation_root', update_blocks_by_pk?: { __typename?: 'blocks', id: string, content?: any | null, position?: number | null, parent_id?: string | null, page_id?: string | null, type: string, created_at?: string | null, updated_at?: string | null } | null };

export type DeleteBlockMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type DeleteBlockMutation = { __typename?: 'mutation_root', delete_blocks_by_pk?: { __typename?: 'blocks', id: string } | null };

export type InsertBlockAndUpdatePositionMutationVariables = Types.Exact<{
  pageId: Types.Scalars['uuid']['input'];
  position: Types.Scalars['Int']['input'];
  type: Types.Scalars['String']['input'];
  workspaceId: Types.Scalars['uuid']['input'];
  userId: Types.Scalars['uuid']['input'];
}>;


export type InsertBlockAndUpdatePositionMutation = { __typename?: 'mutation_root', update_blocks?: { __typename?: 'blocks_mutation_response', affected_rows: number } | null, insert_blocks_one?: { __typename?: 'blocks', id: string, content?: any | null, position?: number | null, parent_id?: string | null, page_id?: string | null, type: string, created_at?: string | null, updated_at?: string | null } | null };


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
export const UpdateBlockDocument = gql`
    mutation UpdateBlock($id: uuid!, $input: blocks_set_input!) {
  update_blocks_by_pk(pk_columns: {id: $id}, _set: $input) {
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
export type UpdateBlockMutationFn = Apollo.MutationFunction<UpdateBlockMutation, UpdateBlockMutationVariables>;

/**
 * __useUpdateBlockMutation__
 *
 * To run a mutation, you first call `useUpdateBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBlockMutation, { data, loading, error }] = useUpdateBlockMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBlockMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBlockMutation, UpdateBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBlockMutation, UpdateBlockMutationVariables>(UpdateBlockDocument, options);
      }
export type UpdateBlockMutationHookResult = ReturnType<typeof useUpdateBlockMutation>;
export type UpdateBlockMutationResult = Apollo.MutationResult<UpdateBlockMutation>;
export type UpdateBlockMutationOptions = Apollo.BaseMutationOptions<UpdateBlockMutation, UpdateBlockMutationVariables>;
export const DeleteBlockDocument = gql`
    mutation DeleteBlock($id: uuid!) {
  delete_blocks_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteBlockMutationFn = Apollo.MutationFunction<DeleteBlockMutation, DeleteBlockMutationVariables>;

/**
 * __useDeleteBlockMutation__
 *
 * To run a mutation, you first call `useDeleteBlockMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBlockMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBlockMutation, { data, loading, error }] = useDeleteBlockMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBlockMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBlockMutation, DeleteBlockMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBlockMutation, DeleteBlockMutationVariables>(DeleteBlockDocument, options);
      }
export type DeleteBlockMutationHookResult = ReturnType<typeof useDeleteBlockMutation>;
export type DeleteBlockMutationResult = Apollo.MutationResult<DeleteBlockMutation>;
export type DeleteBlockMutationOptions = Apollo.BaseMutationOptions<DeleteBlockMutation, DeleteBlockMutationVariables>;
export const InsertBlockAndUpdatePositionDocument = gql`
    mutation InsertBlockAndUpdatePosition($pageId: uuid!, $position: Int!, $type: String!, $workspaceId: uuid!, $userId: uuid!) {
  update_blocks(
    where: {page_id: {_eq: $pageId}, position: {_gte: $position}}
    _inc: {position: 1}
  ) {
    affected_rows
  }
  insert_blocks_one(
    object: {page_id: $pageId, position: $position, type: $type, workspace_id: $workspaceId, user_id: $userId, content: {text: ""}}
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
export type InsertBlockAndUpdatePositionMutationFn = Apollo.MutationFunction<InsertBlockAndUpdatePositionMutation, InsertBlockAndUpdatePositionMutationVariables>;

/**
 * __useInsertBlockAndUpdatePositionMutation__
 *
 * To run a mutation, you first call `useInsertBlockAndUpdatePositionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertBlockAndUpdatePositionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertBlockAndUpdatePositionMutation, { data, loading, error }] = useInsertBlockAndUpdatePositionMutation({
 *   variables: {
 *      pageId: // value for 'pageId'
 *      position: // value for 'position'
 *      type: // value for 'type'
 *      workspaceId: // value for 'workspaceId'
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useInsertBlockAndUpdatePositionMutation(baseOptions?: Apollo.MutationHookOptions<InsertBlockAndUpdatePositionMutation, InsertBlockAndUpdatePositionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertBlockAndUpdatePositionMutation, InsertBlockAndUpdatePositionMutationVariables>(InsertBlockAndUpdatePositionDocument, options);
      }
export type InsertBlockAndUpdatePositionMutationHookResult = ReturnType<typeof useInsertBlockAndUpdatePositionMutation>;
export type InsertBlockAndUpdatePositionMutationResult = Apollo.MutationResult<InsertBlockAndUpdatePositionMutation>;
export type InsertBlockAndUpdatePositionMutationOptions = Apollo.BaseMutationOptions<InsertBlockAndUpdatePositionMutation, InsertBlockAndUpdatePositionMutationVariables>;