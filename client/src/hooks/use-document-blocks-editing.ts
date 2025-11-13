"use client";

import { Block, useBlocks, useDebounce } from "@/hooks";
import { BlockType } from "@/types/types";
import { useCallback, useEffect, useState } from "react";

const generateTempBlockId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (char) => {
    const rand = (Math.random() * 16) | 0;
    const value = char === "x" ? rand : (rand & 0x3) | 0x8;
    return value.toString(16);
  });
};

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
  const { createBlockWithPositionUpdate, updateBlockContent, updateBlocksPositionsBatch, removeBlock } = useBlocks();
  const { debounced, flush } = useDebounce(500);

  const [blocks, setBlocks] = useState<Block[]>(initialBlocks);
  const [rootBlock, setRootBlock] = useState<Block | null>(initialRootBlock);
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);

  // Sync incoming data from server when it changes
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
      content?: string
    ) => {
      flush();

      const tempId = generateTempBlockId();
      const optimisticBlock: Block = {
        id: tempId,
        position,
        type,
        content: content ? { text: content } : { text: "" },
        parent_id: rootBlock?.id || undefined,
        page_id: pageId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        tasks: [],
        __typename: "blocks",
      };

      setBlocks((prev) => {
        const insertIndex = prev.findIndex(
          (block) => (block.position ?? 0) >= position
        );
        const nextBlocks = [...prev];
        if (insertIndex === -1) {
          nextBlocks.push(optimisticBlock);
        } else {
          nextBlocks.splice(insertIndex, 0, optimisticBlock);
        }
        return nextBlocks;
      });

      setFocusedBlock(tempId);

      const newBlock = await createBlockWithPositionUpdate(pageId, position, type);
      if (!newBlock) {
        setBlocks((prev) => prev.filter((block) => block.id !== tempId));
        return;
      }

      setBlocks((prev) =>
        prev.map((block) => (block.id === tempId ? newBlock : block))
      );
      setFocusedBlock(newBlock.id);
    },
    [createBlockWithPositionUpdate, pageId, flush, rootBlock]
  );

  const handleUpdateBlockContent = useCallback(
    (blockId: string, content: string) => {
      const block = blocks.find((b) => b.id === blockId);
      if (block && block.type !== BlockType.PAGE) {
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === blockId ? { ...b, content: { ...b.content, text: content } } : b
          )
        );
        debounced(async () => {
          await updateBlockContent(blockId, { text: content });
        });
      }
    },
    [blocks, debounced, updateBlockContent]
  );

  const handleUpdateTitle = useCallback(
    (title: string) => {
      if (rootBlock) {
        setRootBlock((prev) => (prev ? { ...prev, content: { ...prev.content, title } } : null));
        debounced(async () => {
          await updateBlockContent(rootBlock.id, { title });
        });
      }
    },
    [rootBlock, debounced, updateBlockContent]
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
    [removeBlock]
  );

  const handleReorderBlocks = useCallback(
    async (newBlocks: Block[]) => {
      setBlocks(newBlocks);
      const updates = newBlocks
        .map((block, idx) => ({ id: block.id, position: idx }))
        .filter((block, idx) => block.position !== (blocks[idx]?.position ?? -1) || block.id !== (blocks[idx]?.id ?? ""));
      if (updates.length > 0) {
        await updateBlocksPositionsBatch(updates);
      }
    },
    [updateBlocksPositionsBatch, blocks]
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
  };
}