"use client";

import {
  useDeleteBlockMutation,
  useInsertBlockAndUpdatePositionMutation,
  useUpdateBlockMutation,
  useUpdateBlocksPositionsMutation,
} from "@/graphql/mutations/__generated__/document.generated";
import {
  GetDocumentBlocksDocument,
  GetDocumentBlocksQuery,
} from "@/graphql/queries/__generated__/document.generated";
import { useUserId } from "@/hooks/useAuth";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useState } from "react";

export type Block = GetDocumentBlocksQuery["blocks"][number];

export interface CreateBlockInput {
  type: string;
  content: Record<string, unknown>;
  position: number;
  parent_id?: string;
  page_id?: string;
}

export function useBlocks() {
  const [insertBlockAndUpdatePosition] =
    useInsertBlockAndUpdatePositionMutation();
  const [updateBlock] = useUpdateBlockMutation();
  const [deleteBlock] = useDeleteBlockMutation();
  const [updateBlocksPositions] = useUpdateBlocksPositionsMutation();
  const userId = useUserId();
  const { workspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(false);

  const updateBlockContent = async (
    id: string,
    content: Record<string, unknown>,
  ): Promise<Block | null> => {
    try {
      setIsLoading(true);
      const res = await updateBlock({
        variables: {
          id,
          input: {
            content,
            updated_at: new Date().toISOString(),
          },
        },
        update: (cache, { data }) => {
          const updatedBlock = data?.update_blocks_by_pk;
          if (!updatedBlock) return;

          cache.modify({
            id: cache.identify({ __typename: "blocks", id }),
            fields: {
              content: () => updatedBlock.content,
              updated_at: () => updatedBlock.updated_at,
            },
          });

          cache.modify({
            fields: {
              blocks(existingBlocks = []) {
                return existingBlocks.map((block: any) => {
                  if (block.id === id) {
                    return {
                      ...block,
                      content: updatedBlock.content,
                      updated_at: updatedBlock.updated_at,
                    };
                  }
                  return block;
                });
              },
            },
          });
        },
      });

      const result = res.data?.update_blocks_by_pk;
      if (!result) return null;

      return {
        id: result.id,
        content: result.content || {},
        position: result.position || 0,
        parent_id: result.parent_id || undefined,
        page_id: result.page_id || undefined,
        type: result.type,
        created_at: result.created_at || new Date().toISOString(),
        updated_at: result.updated_at || new Date().toISOString(),
        tasks: [],
      };
    } catch (error) {
      console.error("Failed to update block:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const removeBlock = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      await deleteBlock({
        variables: { id },
        update: (cache) => {
          // Remove the entity itself
          cache.evict({ id: cache.identify({ __typename: "blocks", id }) });
          // Also remove from any cached lists named 'blocks'
          cache.modify({
            fields: {
              blocks(existingRefs = [], { readField }) {
                return existingRefs.filter(
                  (ref: any) => readField("id", ref) !== id,
                );
              },
            },
          });
          cache.gc();
        },
      });
      return true;
    } catch (error) {
      console.error("Failed to delete block:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const createBlockWithPositionUpdate = async (
    pageId: string,
    position: number,
    type: string,
    content: Record<string, unknown> = { text: "" },
  ): Promise<Block | null> => {
    if (!workspace?.id || !userId) return null;

    try {
      setIsLoading(true);
      const res = await insertBlockAndUpdatePosition({
        variables: {
          pageId,
          position,
          type,
          workspaceId: workspace.id,
          userId: userId,
          content,
        },
        refetchQueries: [
          { query: GetDocumentBlocksDocument, variables: { pageId } },
        ],
        awaitRefetchQueries: true,
      });

      const result = res.data?.insert_blocks_one;
      if (!result) return null;

      return {
        id: result.id,
        content: result.content || {},
        position: result.position || 0,
        parent_id: result.parent_id || undefined,
        page_id: result.page_id || undefined,
        type: result.type,
        created_at: result.created_at || new Date().toISOString(),
        updated_at: result.updated_at || new Date().toISOString(),
        tasks: [],
      };
    } catch (error) {
      console.error("Failed to create block with position update:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBlocksPositionsBatch = async (
    updates: { id: string; position: number }[],
  ) => {
    if (!updates.length) return;
    setIsLoading(true);
    try {
      await updateBlocksPositions({
        variables: {
          updates: updates.map(({ id, position }) => ({
            where: { id: { _eq: id } },
            _set: { position, updated_at: new Date().toISOString() },
          })),
        },
      });
    } catch (error) {
      console.error("Failed to batch update block positions:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateBlockType = async (
    id: string,
    type: string,
  ): Promise<Block | null> => {
    try {
      setIsLoading(true);
      const res = await updateBlock({
        variables: {
          id,
          input: {
            type,
            updated_at: new Date().toISOString(),
          },
        },
        update: (cache, { data }) => {
          const updatedBlock = data?.update_blocks_by_pk;
          if (!updatedBlock) return;

          cache.modify({
            id: cache.identify({ __typename: "blocks", id }),
            fields: {
              type: () => updatedBlock.type,
              updated_at: () => updatedBlock.updated_at,
            },
          });
        },
      });

      const result = res.data?.update_blocks_by_pk;
      if (!result) return null;

      return {
        id: result.id,
        content: result.content || {},
        position: result.position || 0,
        parent_id: result.parent_id || undefined,
        page_id: result.page_id || undefined,
        type: result.type,
        created_at: result.created_at || new Date().toISOString(),
        updated_at: result.updated_at || new Date().toISOString(),
        tasks: [],
      };
    } catch (error) {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createBlockWithPositionUpdate,
    updateBlockContent,
    updateBlocksPositionsBatch,
    updateBlockType,
    removeBlock,
    isLoading,
  };
}
