"use client";

import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { useDebounce } from "@/hooks";
import { Block, useBlocks } from "@/hooks/use-blocks";
import { useCallback, useEffect, useMemo, useState } from "react";
import { TiptapBlockItem } from "./TiptapBlockItem";
import { TiptapWrapper } from "./TiptapWrapper";
import { Textarea } from "./Textarea";
import { PageLoading } from "./ui/loading";

interface Props {
  pageId: string;
  className?: string;
}

export default function TiptapBlockEditor({ pageId, className = "" }: Props) {
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
      (block) => block.id === pageId && block.type === "page"
    );
    const childBlocks = allBlocks
      .filter((block) => block.page_id === pageId && block.type !== "page")
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
    async (position: number, type: string = "paragraph") => {
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
      if (block && block.type !== "page") {
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
          prev
            ? {
                ...prev,
                content: { ...prev.content, title },
              }
            : null
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

  const memoizedBlocks = useMemo(() => blocks, [blocks]);

  if (loading || !rootBlock) {
    return <PageLoading />;
  }

  return (
    <div className={`notion-like-editor max-w-5xl mx-auto ${className}`}>
      <div className="mb-8">
        <Textarea
          value={(rootBlock.content?.title as string) || ""}
          isTitleDocument={true}
          onChange={handleUpdateTitle}
        />
      </div>

      <TiptapWrapper>
        <div className="space-y-1">
          {memoizedBlocks.map((block) => (
            <TiptapBlockItem
              key={block.id}
              value={(block.content?.text as string) || ""}
              position={block.position || 0}
              isFocused={focusedBlock === block.id}
              onFocus={() => handleBlockFocus(block.id)}
              onBlur={handleBlockBlur}
              onChange={(value) => handleUpdateBlockContent(block.id, value)}
              onAddBlock={handleAddBlock}
            />
          ))}

          {memoizedBlocks.length === 0 && (
            <div className="flex justify-center py-4">
              <button
                onClick={() => handleAddBlock(0, "paragraph")}
                className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
              >
                + Add content
              </button>
            </div>
          )}
        </div>
      </TiptapWrapper>
    </div>
  );
}
