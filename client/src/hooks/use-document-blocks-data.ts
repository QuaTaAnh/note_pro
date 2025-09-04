"use client";

import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { BlockType } from "@/types/types";
import { useMemo } from "react";
import { Block } from "./use-blocks";

export function useDocumentBlocksData(pageId: string) {
  const { data, loading } = useGetDocumentBlocksQuery({
    variables: { pageId },
    skip: !pageId,
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
      .sort((a, b) => (a.position || 0) - (b.position || 0));

    // Deduplicate by id to avoid duplicate keys in React
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