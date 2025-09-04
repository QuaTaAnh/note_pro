"use client";

import { useDocumentBlocks } from "@/hooks";
import { BlockType } from "@/types/types";
import { Textarea } from "./Textarea";
import { TiptapBlockItem } from "./TiptapBlockItem";
import { TiptapWrapper } from "./TiptapWrapper";
import { PageLoading } from "./ui/loading";
import { Separator } from "./ui/separator";

interface Props {
  pageId: string;
  className?: string;
}

export default function TiptapBlockEditor({ pageId, className = "" }: Props) {
  const {
    loading,
    blocks,
    rootBlock,
    focusedBlock,
    handleAddBlock,
    handleUpdateBlockContent,
    handleUpdateTitle,
    handleBlockFocus,
    handleBlockBlur,
  } = useDocumentBlocks(pageId);

  return loading || !rootBlock ? (
    <PageLoading />
  ) : (
    <div className={`notion-like-editor max-w-5xl mx-auto ${className}`}>
      <Textarea
        className="text-2xl font-bold mt-8 h-8"
        value={(rootBlock.content?.title as string) || ""}
        onChange={handleUpdateTitle}
        placeholder="Untitled"
      />
      <Separator className="mb-4" />
      <TiptapWrapper>
        <div className="space-y-1">
          {blocks.map((block) => (
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

          {blocks.length === 0 && (
            <div className="flex justify-center py-4">
              <button
                onClick={() => handleAddBlock(0, BlockType.PARAGRAPH)}
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
