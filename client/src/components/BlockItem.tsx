import { Block } from "@/hooks/use-blocks";
import { useAutoResize } from "@/hooks";
import { Heading1, List, Plus, Trash2, Type } from "lucide-react";
import React from "react";

interface Props {
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
}

export const BlockItem = ({
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
}: Props) => {
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
      className={`group relative flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
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
};
