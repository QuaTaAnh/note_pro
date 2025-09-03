"use client";

import { useCreateBlockMutation, useDeleteBlockMutation, useUpdateBlockMutation } from "@/graphql/mutations/__generated__/document.generated";
import { GetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { useUserId } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
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
  const [createBlock] = useCreateBlockMutation();
  const [updateBlock] = useUpdateBlockMutation();
  const [deleteBlock] = useDeleteBlockMutation();
  const userId = useUserId();
  const { workspace } = useWorkspace();
  const [isLoading, setIsLoading] = useState(false);

  const createNewBlock = async (input: CreateBlockInput): Promise<Block | null> => {
    if (!workspace?.id || !userId) return null;

    try {
      setIsLoading(true);
      const res = await createBlock({
        variables: {
          input: {
            ...input,
            workspace_id: workspace.id,
            user_id: userId,
          },
        },
        update: (cache, { data }) => {
          const newBlock = data?.insert_blocks_one;
          if (!newBlock) return;

          cache.modify({
            fields: {
              blocks(existingBlocks = []) {
                return [...existingBlocks, newBlock];
              }
            }
          });
        }
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
      };
    } catch (error) {
      console.error("Failed to create block:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBlockContent = async (id: string, content: Record<string, unknown>): Promise<Block | null> => {
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

          // Update the specific block in cache
          cache.modify({
            id: cache.identify({ __typename: 'blocks', id }),
            fields: {
              content: () => updatedBlock.content,
              updated_at: () => updatedBlock.updated_at,
            }
          });

          // Also update the blocks array in the query to ensure consistency
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
              }
            }
          });
        }
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
      };
    } catch (error) {
      console.error("Failed to update block:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateBlockPosition = async (id: string, position: number): Promise<Block | null> => {
    try {
      setIsLoading(true);
      const res = await updateBlock({
        variables: {
          id,
          input: {
            position,
            updated_at: new Date().toISOString(),
          },
        },
        update: (cache, { data }) => {
          const updatedBlock = data?.update_blocks_by_pk;
          if (!updatedBlock) return;

          cache.modify({
            id: cache.identify({ __typename: 'blocks', id }),
            fields: {
              position: () => updatedBlock.position,
              updated_at: () => updatedBlock.updated_at,
            }
          });
        }
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
      };
    } catch (error) {
      console.error("Failed to update block position:", error);
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
          cache.evict({ id: cache.identify({ __typename: 'blocks', id }) });
          cache.gc();
        }
      });
      return true;
    } catch (error) {
      console.error("Failed to delete block:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createNewBlock,
    updateBlockContent,
    updateBlockPosition,
    removeBlock,
    isLoading,
  };
} 