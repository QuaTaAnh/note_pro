import * as Types from "@/types/generated/graphql";

import { gql } from "@apollo/client";
import * as Apollo from "@apollo/client";
const defaultOptions = { ignoreResults: true } as const;
export type GetUnreadNotificationsCountQueryVariables = Types.Exact<{
  userId: Types.Scalars["uuid"]["input"];
}>;

export type GetUnreadNotificationsCountQuery = {
  __typename?: "query_root";
  notifications_aggregate: {
    __typename?: "notifications_aggregate";
    aggregate?: {
      __typename?: "notifications_aggregate_fields";
      count: number;
    } | null;
  };
};

export type NotificationSubscriptionSubscriptionVariables = Types.Exact<{
  userId: Types.Scalars["uuid"]["input"];
}>;

export type NotificationSubscriptionSubscription = {
  __typename?: "subscription_root";
  notifications: Array<{
    __typename?: "notifications";
    id: string;
    user_id: string;
    type: string;
    title: string;
    message?: string | null;
    data?: any | null;
    is_read?: boolean | null;
    created_at?: string | null;
  }>;
};

export const GetUnreadNotificationsCountDocument = gql`
  query GetUnreadNotificationsCount($userId: uuid!) {
    notifications_aggregate(
      where: { user_id: { _eq: $userId }, is_read: { _eq: false } }
    ) {
      aggregate {
        count
      }
    }
  }
`;

/**
 * __useGetUnreadNotificationsCountQuery__
 *
 * To run a query within a React component, call `useGetUnreadNotificationsCountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUnreadNotificationsCountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUnreadNotificationsCountQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUnreadNotificationsCountQuery(
  baseOptions: Apollo.QueryHookOptions<
    GetUnreadNotificationsCountQuery,
    GetUnreadNotificationsCountQueryVariables
  > &
    (
      | { variables: GetUnreadNotificationsCountQueryVariables; skip?: boolean }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useQuery<
    GetUnreadNotificationsCountQuery,
    GetUnreadNotificationsCountQueryVariables
  >(GetUnreadNotificationsCountDocument, options);
}
export function useGetUnreadNotificationsCountLazyQuery(
  baseOptions?: Apollo.LazyQueryHookOptions<
    GetUnreadNotificationsCountQuery,
    GetUnreadNotificationsCountQueryVariables
  >,
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useLazyQuery<
    GetUnreadNotificationsCountQuery,
    GetUnreadNotificationsCountQueryVariables
  >(GetUnreadNotificationsCountDocument, options);
}
export function useGetUnreadNotificationsCountSuspenseQuery(
  baseOptions?:
    | Apollo.SkipToken
    | Apollo.SuspenseQueryHookOptions<
        GetUnreadNotificationsCountQuery,
        GetUnreadNotificationsCountQueryVariables
      >,
) {
  const options =
    baseOptions === Apollo.skipToken
      ? baseOptions
      : { ...defaultOptions, ...baseOptions };
  return Apollo.useSuspenseQuery<
    GetUnreadNotificationsCountQuery,
    GetUnreadNotificationsCountQueryVariables
  >(GetUnreadNotificationsCountDocument, options);
}
export type GetUnreadNotificationsCountQueryHookResult = ReturnType<
  typeof useGetUnreadNotificationsCountQuery
>;
export type GetUnreadNotificationsCountLazyQueryHookResult = ReturnType<
  typeof useGetUnreadNotificationsCountLazyQuery
>;
export type GetUnreadNotificationsCountSuspenseQueryHookResult = ReturnType<
  typeof useGetUnreadNotificationsCountSuspenseQuery
>;
export type GetUnreadNotificationsCountQueryResult = Apollo.QueryResult<
  GetUnreadNotificationsCountQuery,
  GetUnreadNotificationsCountQueryVariables
>;
export const NotificationSubscriptionDocument = gql`
  subscription NotificationSubscription($userId: uuid!) {
    notifications(
      where: { user_id: { _eq: $userId } }
      order_by: { created_at: desc }
      limit: 20
    ) {
      id
      user_id
      type
      title
      message
      data
      is_read
      created_at
    }
  }
`;

/**
 * __useNotificationSubscriptionSubscription__
 *
 * To run a query within a React component, call `useNotificationSubscriptionSubscription` and pass it any options that fit your needs.
 * When your component renders, `useNotificationSubscriptionSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useNotificationSubscriptionSubscription({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useNotificationSubscriptionSubscription(
  baseOptions: Apollo.SubscriptionHookOptions<
    NotificationSubscriptionSubscription,
    NotificationSubscriptionSubscriptionVariables
  > &
    (
      | {
          variables: NotificationSubscriptionSubscriptionVariables;
          skip?: boolean;
        }
      | { skip: boolean }
    ),
) {
  const options = { ...defaultOptions, ...baseOptions };
  return Apollo.useSubscription<
    NotificationSubscriptionSubscription,
    NotificationSubscriptionSubscriptionVariables
  >(NotificationSubscriptionDocument, options);
}
export type NotificationSubscriptionSubscriptionHookResult = ReturnType<
  typeof useNotificationSubscriptionSubscription
>;
export type NotificationSubscriptionSubscriptionResult =
  Apollo.SubscriptionResult<NotificationSubscriptionSubscription>;
