"use client";

import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { Block, useBlocks } from "@/hooks/use-blocks";
import { useDebounce } from "@/hooks/use-debounce";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { BlockItem } from "./BlockItem";
import { TitleTextarea } from "./TitleTextarea";
import { PageLoading } from "./ui/loading";

interface Props {
  pageId: string;
  className?: string;
}

export default function BlockEditor({ pageId, className = "" }: Props) {
  const { data, loading } = useGetDocumentBlocksQuery({
    variables: { pageId },
    skip: !pageId,
  });

  const { createNewBlock, updateBlockContent, removeBlock } = useBlocks();
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [rootBlock, setRootBlock] = useState<Block | null>(null);
  const [focusedBlock, setFocusedBlock] = useState<string | null>(null);
  const [localContent, setLocalContent] = useState<Record<string, string>>({});

  useEffect(() => {
    if (data?.blocks) {
      const allBlocks = data.blocks as Block[];
      const root = allBlocks.find((block) => block.id === pageId);
      const childBlocks = allBlocks
        .filter((block) => block.page_id === pageId)
        .sort((a, b) => (a.position || 0) - (b.position || 0));

      setRootBlock(root || null);
      setBlocks(childBlocks);

      const initialContent: Record<string, string> = {};
      childBlocks.forEach((block) => {
        initialContent[block.id] = (block.content?.text as string) || "";
      });
      if (root) {
        initialContent[root.id] = (root.content?.title as string) || "";
      }
      setLocalContent(initialContent);
    }
  }, [data, pageId]);

  const debounce = useDebounce(500);

  const handleAddBlock = async (
    position: number,
    type: string = "paragraph"
  ) => {
    const newBlock = await createNewBlock({
      type,
      content: { text: "" },
      position,
      page_id: pageId,
    });

    if (newBlock) {
      setBlocks((prev) => {
        const updated = [...prev];
        updated.splice(position, 0, newBlock);
        return updated.map((block, index) => ({
          ...block,
          position: index >= position ? index : block.position,
        }));
      });
      setLocalContent((prev) => ({ ...prev, [newBlock.id]: "" }));
      setFocusedBlock(newBlock.id);
    }
  };

  const handleUpdateBlock = (
    blockId: string,
    content: Record<string, unknown>
  ) => {
    setLocalContent((prev) => ({ ...prev, [blockId]: content.text as string }));
    debounce(async () => {
      const updatedBlock = await updateBlockContent(blockId, content);
      if (updatedBlock) {
        setBlocks((prev) =>
          prev.map((block) => (block.id === blockId ? updatedBlock : block))
        );
      }
    });
  };

  const handleDeleteBlock = async (blockId: string) => {
    const success = await removeBlock(blockId);
    if (success) {
      setBlocks((prev) => prev.filter((block) => block.id !== blockId));
      setLocalContent((prev) => {
        const newContent = { ...prev };
        delete newContent[blockId];
        return newContent;
      });
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent,
    blockId: string,
    position: number
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleAddBlock(position + 1, "paragraph");
    } else if (
      e.key === "Backspace" &&
      (e.target as HTMLTextAreaElement).value === ""
    ) {
      e.preventDefault();
      if (blocks.length > 0) {
        handleDeleteBlock(blockId);
        const prevBlock = blocks.find((b) => b.position === position - 1);
        if (prevBlock) {
          setFocusedBlock(prevBlock.id);
        }
      }
    }
  };

  return loading || !rootBlock ? (
    <PageLoading />
  ) : (
    <div className={`notion-like-editor max-w-5xl mx-auto ${className}`}>
      <div className="mb-8">
        <TitleTextarea
          value={localContent[rootBlock.id] || ""}
          onChange={(value) => {
            setLocalContent((prev) => ({ ...prev, [rootBlock.id]: value }));
            debounce(async () => {
              await updateBlockContent(rootBlock.id, { title: value });
            });
          }}
        />
      </div>

      <div className="space-y-1">
        {blocks.map((block) => (
          <BlockItem
            key={block.id}
            block={block}
            value={localContent[block.id] || ""}
            isFocused={focusedBlock === block.id}
            onFocus={() => setFocusedBlock(block.id)}
            onBlur={() => setFocusedBlock(null)}
            onUpdate={(content) => handleUpdateBlock(block.id, content)}
            onDelete={() => handleDeleteBlock(block.id)}
            onAddBlock={(type) => handleAddBlock(block.position || 0, type)}
            onKeyDown={(e) => handleKeyDown(e, block.id, block.position || 0)}
            canDelete={blocks.length > 1}
          />
        ))}

        <div className="flex items-center gap-3 p-2 opacity-0 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleAddBlock(blocks.length, "paragraph")}
              className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
              title="Add paragraph"
            >
              <Plus className="w-3 h-3" />
            </button>
            <span className="text-xs text-gray-400">Add paragraph</span>
          </div>
        </div>
      </div>
    </div>
  );
}
