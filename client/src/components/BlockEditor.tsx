"use client";

import { useEffect, useState, useRef } from "react";
import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { useBlocks } from "@/hooks/use-blocks";
import { Block } from "@/hooks/use-blocks";
import { useDebounce } from "@/hooks/use-debounce";
import { Plus, Trash2, Type, Heading1, List } from "lucide-react";

interface BlockEditorProps {
  pageId: string;
  className?: string;
}

const useAutoResize = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [value]);

  return textareaRef;
};

export default function BlockEditor({
  pageId,
  className = "",
}: BlockEditorProps) {
  const { data, loading, error } = useGetDocumentBlocksQuery({
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
        .sort((a, b) => a.position - b.position);

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
        updated.forEach((block, index) => {
          if (index >= position) {
            block.position = index;
          }
        });
        return updated;
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

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "heading":
        return <Heading1 className="w-4 h-4" />;
      case "list":
        return <List className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  const getBlockPlaceholder = (type: string) => {
    switch (type) {
      case "heading":
        return "Heading 1";
      case "list":
        return "List item";
      default:
        return 'Type "/" for commands';
    }
  };

  if (loading) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] ${className}`}
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] ${className}`}
      >
        <div className="text-red-500 text-center">
          <p className="text-lg font-medium">Error loading document</p>
          <p className="text-sm text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!rootBlock) {
    return (
      <div
        className={`flex items-center justify-center min-h-[400px] ${className}`}
      >
        <div className="text-gray-500 text-center">
          <p className="text-lg font-medium">Document not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`notion-like-editor max-w-4xl mx-auto ${className}`}>
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
        {blocks.map((block, index) => (
          <BlockItem
            key={block.id}
            block={block}
            value={localContent[block.id] || ""}
            isFocused={focusedBlock === block.id}
            onFocus={() => setFocusedBlock(block.id)}
            onBlur={() => setFocusedBlock(null)}
            onUpdate={(content) => handleUpdateBlock(block.id, content)}
            onDelete={() => handleDeleteBlock(block.id)}
            onAddBlock={(type) => handleAddBlock(block.position, type)}
            onKeyDown={(e) => handleKeyDown(e, block.id, block.position)}
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

      {blocks.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Type className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500 mb-4">Start writing your document</p>
          <button
            onClick={() => handleAddBlock(0, "paragraph")}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add your first block
          </button>
        </div>
      )}
    </div>
  );
}

function TitleTextarea({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const textareaRef = useAutoResize(value);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-4xl font-bold bg-transparent border-none outline-none resize-none placeholder-gray-400"
      placeholder="Untitled"
      style={{ minHeight: "auto" }}
    />
  );
}

function BlockItem({
  block,
  value,
  isFocused,
  onFocus,
  onBlur,
  onUpdate,
  onDelete,
  onAddBlock,
  onKeyDown,
  canDelete,
}: {
  block: Block;
  value: string;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onUpdate: (content: Record<string, unknown>) => void;
  onDelete: () => void;
  onAddBlock: (type: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  canDelete: boolean;
}) {
  const textareaRef = useAutoResize(value);

  const getBlockIcon = (type: string) => {
    switch (type) {
      case "heading":
        return <Heading1 className="w-4 h-4" />;
      case "list":
        return <List className="w-4 h-4" />;
      default:
        return <Type className="w-4 h-4" />;
    }
  };

  const getBlockPlaceholder = (type: string) => {
    switch (type) {
      case "heading":
        return "Heading 1";
      case "list":
        return "List item";
      default:
        return 'Type "/" for commands';
    }
  };

  return (
    <div
      className={`group relative flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
        isFocused ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity mt-1">
        <button
          onClick={() => onAddBlock("paragraph")}
          className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
          title="Add paragraph"
        >
          <Plus className="w-3 h-3" />
        </button>
        <button
          onClick={() => onAddBlock("heading")}
          className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
          title="Add heading"
        >
          <Heading1 className="w-3 h-3" />
        </button>
        <button
          onClick={() => onAddBlock("list")}
          className="p-1 hover:bg-gray-200 rounded text-gray-500 hover:text-gray-700"
          title="Add list"
        >
          <List className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-shrink-0 mt-1 text-gray-400">
        {getBlockIcon(block.type)}
      </div>

      <div className="flex-1 min-w-0">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onUpdate({ text: e.target.value })}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
          className={`w-full bg-transparent border-none outline-none resize-none placeholder-gray-400 ${
            block.type === "heading" ? "text-xl font-semibold" : "text-base"
          }`}
          placeholder={getBlockPlaceholder(block.type)}
          style={{ minHeight: "auto" }}
        />
      </div>

      {canDelete && (
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600 mt-1"
          title="Delete block"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}
