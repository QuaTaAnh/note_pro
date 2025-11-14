"use client";

import { useEffect, useState } from "react";
import { Block } from "@/hooks";
import { useDocumentBlocksData } from "@/hooks/use-document-blocks-data";
import { useDocumentBlocksEditing } from "@/hooks/use-document-blocks-editing";

export function useDocumentBlocks(pageId: string) {
  const { loading, processedBlocks, processedRootBlock } =
    useDocumentBlocksData(pageId);

  const [initialBlocks, setInitialBlocks] = useState<Block[]>([]);
  const [initialRootBlock, setInitialRootBlock] = useState<Block | null>(null);

  useEffect(() => {
    setInitialRootBlock((processedRootBlock as Block) ?? null);
    setInitialBlocks((processedBlocks as Block[]) ?? []);
  }, [processedBlocks, processedRootBlock]);

  const editing = useDocumentBlocksEditing({
    initialBlocks,
    initialRootBlock,
    pageId,
  });

  return {
    loading,
    ...editing,
  };
}
