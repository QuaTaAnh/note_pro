import { Trash2 } from "lucide-react";
import React from "react";
import { Textarea } from "./Textarea";

interface Props {
  value: string;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onUpdate: (content: Record<string, unknown>) => void;
  onDelete: () => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  canDelete: boolean;
}

export const BlockItem = ({
  value,
  isFocused,
  onFocus,
  onBlur,
  onUpdate,
  onDelete,
  onKeyDown,
  canDelete,
}: Props) => {
  return (
    <div
      className={`group relative flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 transition-colors ${
        isFocused ? "bg-blue-50" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <Textarea
          value={value}
          onChange={(value) => onUpdate({ text: value })}
          onKeyDown={onKeyDown}
          onFocus={onFocus}
          onBlur={onBlur}
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
