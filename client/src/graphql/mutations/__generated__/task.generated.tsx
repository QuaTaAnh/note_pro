import * as Types from 'generated/graphql';

import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
const defaultOptions = {"ignoreResults":true} as const;
export type CreateTaskMutationVariables = Types.Exact<{
  input: Types.TasksInsertInput;
}>;


export type CreateTaskMutation = { __typename?: 'mutation_root', insert_tasks_one?: { __typename?: 'tasks', id: string, block_id?: string | null, user_id?: string | null, status?: string | null, due_date?: string | null, priority?: string | null, created_at?: string | null, updated_at?: string | null } | null };

export type UpdateTaskMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
  input: Types.TasksSetInput;
}>;


export type UpdateTaskMutation = { __typename?: 'mutation_root', update_tasks_by_pk?: { __typename?: 'tasks', id: string, block_id?: string | null, user_id?: string | null, status?: string | null, due_date?: string | null, priority?: string | null, created_at?: string | null, updated_at?: string | null } | null };

export type DeleteTaskMutationVariables = Types.Exact<{
  id: Types.Scalars['uuid']['input'];
}>;


export type DeleteTaskMutation = { __typename?: 'mutation_root', delete_tasks_by_pk?: { __typename?: 'tasks', id: string } | null };


export const CreateTaskDocument = gql`
    mutation CreateTask($input: tasks_insert_input!) {
  insert_tasks_one(object: $input) {
    id
    block_id
    user_id
    status
    due_date
    priority
    created_at
    updated_at
  }
}
    `;
export type CreateTaskMutationFn = Apollo.MutationFunction<CreateTaskMutation, CreateTaskMutationVariables>;

/**
 * __useCreateTaskMutation__
 *
 * To run a mutation, you first call `useCreateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTaskMutation, { data, loading, error }] = useCreateTaskMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTaskMutation(baseOptions?: Apollo.MutationHookOptions<CreateTaskMutation, CreateTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTaskMutation, CreateTaskMutationVariables>(CreateTaskDocument, options);
      }
export type CreateTaskMutationHookResult = ReturnType<typeof useCreateTaskMutation>;
export type CreateTaskMutationResult = Apollo.MutationResult<CreateTaskMutation>;
export type CreateTaskMutationOptions = Apollo.BaseMutationOptions<CreateTaskMutation, CreateTaskMutationVariables>;
export const UpdateTaskDocument = gql`
    mutation UpdateTask($id: uuid!, $input: tasks_set_input!) {
  update_tasks_by_pk(pk_columns: {id: $id}, _set: $input) {
    id
    block_id
    user_id
    status
    due_date
    priority
    created_at
    updated_at
  }
}
    `;
export type UpdateTaskMutationFn = Apollo.MutationFunction<UpdateTaskMutation, UpdateTaskMutationVariables>;

/**
 * __useUpdateTaskMutation__
 *
 * To run a mutation, you first call `useUpdateTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTaskMutation, { data, loading, error }] = useUpdateTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTaskMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTaskMutation, UpdateTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTaskMutation, UpdateTaskMutationVariables>(UpdateTaskDocument, options);
      }
export type UpdateTaskMutationHookResult = ReturnType<typeof useUpdateTaskMutation>;
export type UpdateTaskMutationResult = Apollo.MutationResult<UpdateTaskMutation>;
export type UpdateTaskMutationOptions = Apollo.BaseMutationOptions<UpdateTaskMutation, UpdateTaskMutationVariables>;
export const DeleteTaskDocument = gql`
    mutation DeleteTask($id: uuid!) {
  delete_tasks_by_pk(id: $id) {
    id
  }
}
    `;
export type DeleteTaskMutationFn = Apollo.MutationFunction<DeleteTaskMutation, DeleteTaskMutationVariables>;

/**
 * __useDeleteTaskMutation__
 *
 * To run a mutation, you first call `useDeleteTaskMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTaskMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTaskMutation, { data, loading, error }] = useDeleteTaskMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTaskMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTaskMutation, DeleteTaskMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTaskMutation, DeleteTaskMutationVariables>(DeleteTaskDocument, options);
      }
export type DeleteTaskMutationHookResult = ReturnType<typeof useDeleteTaskMutation>;
export type DeleteTaskMutationResult = Apollo.MutationResult<DeleteTaskMutation>;
export type DeleteTaskMutationOptions = Apollo.BaseMutationOptions<DeleteTaskMutation, DeleteTaskMutationVariables>;