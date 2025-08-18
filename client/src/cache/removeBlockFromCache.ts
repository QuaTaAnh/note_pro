import type { ApolloCache, Reference } from "@apollo/client";

export function removeBlockFromCache(cache: ApolloCache<unknown>, blockId: string) {
	cache.modify({
		fields: {
			blocks(existingRefs: readonly Reference[] = [], { readField }) {
				return existingRefs.filter((ref) => readField("id", ref) !== blockId);
			},
		},
	});
	cache.evict({ id: cache.identify({ __typename: "blocks", id: blockId }) });
	cache.gc();
} 