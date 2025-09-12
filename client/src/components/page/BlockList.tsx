"use client";

import { TiptapBlockItem } from "@/components/editor/TiptapBlockItem";
import { BlockType } from "@/types/types";
import { Block } from "@/hooks";

interface Props {
  blocks: Block[];
  focusedBlockId: string | null;
  onFocus: (blockId: string) => void;
  onBlur: () => void;
  onChange: (blockId: string, value: string) => void;
  onAddBlock: (position: number, type: BlockType) => void;
  onSaveImmediate: () => void;
  onDeleteBlock?: (blockId: string) => void;
}

export function BlockList({
  blocks,
  focusedBlockId,
  onFocus,
  onBlur,
  onChange,
  onAddBlock,
  onSaveImmediate,
  onDeleteBlock,
}: Props) {
  return (
    <div className="space-y-1">
      {blocks.map((block) => (
        <TiptapBlockItem
          key={block.id}
          value={(block.content?.text as string) || ""}
          position={block.position || 0}
          isFocused={focusedBlockId === block.id}
          onFocus={() => onFocus(block.id)}
          onBlur={onBlur}
          onChange={(value) => onChange(block.id, value)}
          onAddBlock={onAddBlock}
          onSaveImmediate={onSaveImmediate}
          onDeleteBlock={
            onDeleteBlock ? () => onDeleteBlock(block.id) : undefined
          }
        />
      ))}

      {blocks.length === 0 && (
        <div className="flex justify-center py-4">
          <button
            onClick={() => onAddBlock(0, BlockType.PARAGRAPH)}
            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
          >
            + Add content
          </button>
        </div>
      )}
    </div>
  );
}
