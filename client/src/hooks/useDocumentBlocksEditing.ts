"use client";

import { Block, useBlocks, useDebounce } from "@/hooks";
import { BlockType } from "@/types/types";
import { useCallback, useEffect, useState } from "react";
import { useCreateTaskMutation } from "@/graphql/mutations/__generated__/task.generated";
import { TASK_STATUS } from "@/lib/constants";
import { useUserId } from "@/hooks/useAuth";
import { gql } from "@apollo/client";

interface UseDocumentBlocksEditingParams {
  initialBlocks: Block[];
  initialRootBlock: Block | null;
  pageId: string;
}

export function useDocumentBlocksEditing({
  initialBlocks,
  initialRootBlock,
  pageId,
}: UseDocumentBlocksEditingParams) {
  const {
    createBlockWithPositionUpdate,
    updateBlockContent,
    updateBlocksPositionsBatch,
    updateBlockType,
    removeBlock,
  } = useBlocks();
  const { debounced, flush } = useDebounce(500);
  const [createTask] = useCreateTaskMutation();
  const userId = useUserId();

  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [rootBlock, setRootBlock] = useState<Block | null>(initialRootBlock);
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);

  useEffect(() => {
    setBlocks(initialBlocks);
  }, [initialBlocks]);

  useEffect(() => {
    setRootBlock(initialRootBlock);
  }, [initialRootBlock]);

  const handleAddBlock = useCallback(
    async (
      position: number,
      type: BlockType = BlockType.PARAGRAPH,
      content: Record<string, unknown> = { text: "" },
    ) => {
      flush();
      const newBlock = await createBlockWithPositionUpdate(
        pageId,
        position,
        type,
        content,
      );
      if (newBlock) {
        setFocusedBlock(newBlock.id);
      }
    },
    [createBlockWithPositionUpdate, pageId, flush],
  );

  const handleUpdateBlockContent = useCallback(
    (blockId: string, content: string) => {
      setBlocks((prev) => {
        const block = prev.find((b) => b.id === blockId);
        if (!block || block.type === BlockType.PAGE) {
          return prev;
        }

        if (block.content?.text === content) {
          return prev;
        }

        return prev.map((b) =>
          b.id === blockId
            ? { ...b, content: { ...b.content, text: content } }
            : b,
        );
      });

      debounced(async () => {
        await updateBlockContent(blockId, { text: content });
      }, `block-${blockId}`);
    },
    [debounced, updateBlockContent],
  );

  const handleUpdateTitle = useCallback(
    (title: string) => {
      if (rootBlock) {
        setRootBlock((prev) =>
          prev ? { ...prev, content: { ...prev.content, title } } : null,
        );
        debounced(async () => {
          await updateBlockContent(rootBlock.id, { title });
        }, `title-${rootBlock.id}`);
      }
    },
    [rootBlock, debounced, updateBlockContent],
  );

  const handleBlockFocus = useCallback((blockId: string) => {
    setFocusedBlock(blockId);
  }, []);

  const handleBlockBlur = useCallback(() => {
    setFocusedBlock(null);
  }, []);

  const handleSaveImmediate = useCallback(() => {
    flush();
  }, [flush]);

  const handleDeleteBlock = useCallback(
    async (blockId: string) => {
      const success = await removeBlock(blockId);
      if (success) {
        setBlocks((prev) => prev.filter((b) => b.id !== blockId));
      }
    },
    [removeBlock],
  );

  const handleReorderBlocks = useCallback(
    async (newBlocks: Block[]) => {
      setBlocks((prevBlocks) => {
        const updates = newBlocks
          .map((block, idx) => ({ id: block.id, position: idx }))
          .filter(
            (block, idx) =>
              block.position !== (prevBlocks[idx]?.position ?? -1) ||
              block.id !== (prevBlocks[idx]?.id ?? ""),
          );

        if (updates.length > 0) {
          updateBlocksPositionsBatch(updates);
        }

        return newBlocks;
      });
    },
    [updateBlocksPositionsBatch],
  );

  const handleConvertToTask = useCallback(
    async (blockId: string) => {
      if (!userId) {
        return;
      }

      flush();

      try {
        const updatedBlock = await updateBlockType(blockId, BlockType.TASK);
        if (!updatedBlock) {
          return;
        }

        const taskResult = await createTask({
          variables: {
            input: {
              block_id: blockId,
              user_id: userId,
              status: TASK_STATUS.TODO,
            },
          },
          update: (cache, { data }) => {
            if (!data?.insert_tasks_one) return;

            // Update the block in cache to include the new task
            cache.modify({
              id: cache.identify({ __typename: "blocks", id: blockId }),
              fields: {
                tasks(existingTasks = []) {
                  const newTaskRef = cache.writeFragment({
                    data: data.insert_tasks_one,
                    fragment: gql`
                      fragment NewTask on tasks {
                        id
                        status
                        deadline_date
                        schedule_date
                        priority
                        user_id
                        block_id
                      }
                    `,
                  });
                  return [...existingTasks, newTaskRef];
                },
                type() {
                  return BlockType.TASK;
                },
              },
            });
          },
        });

        if (taskResult.data?.insert_tasks_one) {
          setBlocks((prev) =>
            prev.map((b) =>
              b.id === blockId
                ? {
                    ...b,
                    type: BlockType.TASK,
                    tasks: [taskResult.data!.insert_tasks_one!],
                  }
                : b,
            ),
          );
        }
      } catch (error) {
        console.error("Failed to convert block to task:", error);
      }
    },
    [updateBlockType, createTask, userId, flush],
  );

  const handleConvertToFile = useCallback(
    async (blockId: string, fileData: Record<string, unknown>) => {
      flush();

      try {
        // Update block type to FILE
        const updatedBlock = await updateBlockType(blockId, BlockType.FILE);
        if (!updatedBlock) {
          return;
        }

        // Update block content with file data
        await updateBlockContent(blockId, fileData);

        // Update local state
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === blockId
              ? {
                  ...b,
                  type: BlockType.FILE,
                  content: fileData,
                }
              : b,
          ),
        );
      } catch (error) {
        console.error("Failed to convert block to file:", error);
      }
    },
    [updateBlockType, updateBlockContent, flush],
  );

  const handleConvertToTable = useCallback(
    async (blockId: string, tableHTML: string) => {
      flush();

      try {
        // Update block type to TABLE
        const updatedBlock = await updateBlockType(blockId, BlockType.TABLE);
        if (!updatedBlock) {
          return;
        }

        // Update block content with table HTML
        await updateBlockContent(blockId, { text: tableHTML });

        // Update local state
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === blockId
              ? {
                  ...b,
                  type: BlockType.TABLE,
                  content: { text: tableHTML },
                }
              : b,
          ),
        );
      } catch (error) {
        console.error("Failed to convert block to table:", error);
      }
    },
    [updateBlockType, updateBlockContent, flush],
  );

  return {
    blocks,
    rootBlock,
    focusedBlock,
    handleAddBlock,
    handleUpdateBlockContent,
    handleUpdateTitle,
    handleBlockFocus,
    handleBlockBlur,
    handleSaveImmediate,
    handleDeleteBlock,
    handleReorderBlocks,
    handleConvertToTask,
    handleConvertToFile,
    handleConvertToTable,
  };
}
