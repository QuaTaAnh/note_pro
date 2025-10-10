"use client";

import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { BlockType } from "@/types/types";
import { useMemo } from "react";
import { Block } from "./use-blocks";

export function useDocumentBlocksData(pageId: string) {
  const { data, loading } = useGetDocumentBlocksQuery({
    variables: { pageId },
    skip: !pageId,
    fetchPolicy: "cache-first",
  });

  const { processedBlocks, processedRootBlock } = useMemo(() => {
    if (!data?.blocks) return { processedBlocks: [], processedRootBlock: null };

    const allBlocks = data.blocks as Block[];
    const root =
      allBlocks.find(
        (block) => block.id === pageId && block.type === BlockType.PAGE
      ) || null;

    const childBlocksRaw = allBlocks
      .filter(
        (block) => block.page_id === pageId && block.type !== BlockType.PAGE
      )
      .sort((a, b) => {
        const positionA = a.position || 0;
        const positionB = b.position || 0;
        
        if (positionA !== positionB) {
          return positionA - positionB;
        }
        
        const isTaskA = a.type === BlockType.TASK;
        const isTaskB = b.type === BlockType.TASK;
        
        if (isTaskA && !isTaskB) return -1;
        if (!isTaskA && isTaskB) return 1;
        
        return 0;
      });

    const seen = new Set<string>();
    const childBlocks = childBlocksRaw.filter((b) => {
      if (seen.has(b.id)) return false;
      seen.add(b.id);
      return true;
    });

    return { processedBlocks: childBlocks, processedRootBlock: root };
  }, [data?.blocks, pageId]);

  return { loading, processedBlocks, processedRootBlock };
} 