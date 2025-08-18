import type { OperationVariables, WatchQueryFetchPolicy } from '@apollo/client';
import type { NextFetchPolicyContext } from '@apollo/client/core/watchQueryOptions';

/**
 * @see https://www.apollographql.com/docs/react/data/queries/#nextfetchpolicy
 */
export function nextFetchPolicy(
    currentFetchPolicy: WatchQueryFetchPolicy,
    { reason, initialFetchPolicy }: Context
): WatchQueryFetchPolicy {
    if ('variables-changed' === reason) {
        // Preserve < 3.11.0 behavior in which fetchPolicy resets when variables change:
        // https://github.com/apollographql/apollo-client/blob/main/CHANGELOG.md#3110
        //
        // This also matches Apollo's documented default behavior when this nextFetchPolicy
        // function is not defined:
        // https://www.apollographql.com/docs/react/data/queries/#nextfetchpolicy-functions
        return initialFetchPolicy;
    }

    if (
        'cache-and-network' === currentFetchPolicy ||
        'network-only' === currentFetchPolicy
    ) {
        return 'cache-first';
    }

    return currentFetchPolicy;
}

type Context = Pick<
    NextFetchPolicyContext<unknown, OperationVariables>,
    'reason' | 'initialFetchPolicy'
>;
