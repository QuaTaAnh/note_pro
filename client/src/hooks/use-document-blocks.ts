"use client";

import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { Block, useBlocks, useDebounce } from "@/hooks";
import { BlockType } from "@/types/types";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useDocumentBlocks(pageId: string) {
  const { createNewBlock, updateBlockContent } = useBlocks();
  const debounce = useDebounce(500);

  const { data, loading } = useGetDocumentBlocksQuery({
    variables: { pageId },
    skip: !pageId,
  });

  const [blocks, setBlocks] = useState<Block[]>([]);
  const [rootBlock, setRootBlock] = useState<Block | null>(null);
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);

  const { processedBlocks, processedRootBlock } = useMemo(() => {
    if (!data?.blocks) return { processedBlocks: [], processedRootBlock: null };

    const allBlocks = data.blocks as Block[];
    const root = allBlocks.find(
      (block) => block.id === pageId && block.type === BlockType.PAGE
    );
    const childBlocks = allBlocks
      .filter(
        (block) => block.page_id === pageId && block.type !== BlockType.PAGE
      )
      .sort((a, b) => (a.position || 0) - (b.position || 0));

    return { processedBlocks: childBlocks, processedRootBlock: root };
  }, [data?.blocks, pageId]);

  useEffect(() => {
    if (processedRootBlock) {
      setRootBlock(processedRootBlock);
    }
    if (processedBlocks.length > 0) {
      setBlocks(processedBlocks);
    }
  }, [processedRootBlock, processedBlocks]);

  const handleAddBlock = useCallback(
    async (position: number, type: BlockType = BlockType.PARAGRAPH) => {
      const newBlock = await createNewBlock({
        type,
        content: { text: "" },
        position,
        page_id: pageId,
      });

      if (newBlock) {
        setFocusedBlock(newBlock.id);
      }
    },
    [createNewBlock, pageId]
  );

  const handleUpdateBlockContent = useCallback(
    (blockId: string, content: string) => {
      const block = blocks.find((b) => b.id === blockId);
      if (block && block.type !== BlockType.PAGE) {
        setBlocks((prev) =>
          prev.map((b) =>
            b.id === blockId
              ? { ...b, content: { ...b.content, text: content } }
              : b
          )
        );
        debounce(async () => {
          await updateBlockContent(blockId, { text: content });
        });
      }
    },
    [blocks, debounce, updateBlockContent]
  );

  const handleUpdateTitle = useCallback(
    (title: string) => {
      if (rootBlock) {
        setRootBlock((prev) =>
          prev ? { ...prev, content: { ...prev.content, title } } : null
        );
        debounce(async () => {
          await updateBlockContent(rootBlock.id, { title });
        });
      }
    },
    [rootBlock, debounce, updateBlockContent]
  );

  const handleBlockFocus = useCallback((blockId: string) => {
    setFocusedBlock(blockId);
  }, []);

  const handleBlockBlur = useCallback(() => {
    setFocusedBlock(null);
  }, []);

  return {
    loading,
    blocks,
    rootBlock,
    focusedBlock,
    handleAddBlock,
    handleUpdateBlockContent,
    handleUpdateTitle,
    handleBlockFocus,
    handleBlockBlur,
  };
}
