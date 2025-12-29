"use client";

import { TiptapBlockItem } from "@/components/features/editor/TiptapBlockItem";
import { FileBlockCard } from "@/components/features/page/FileBlockCard";
import { Block } from "@/hooks";
import { BlockType } from "@/types/types";
import { SortableBlockItemProps } from "./types";

interface BlockRendererProps extends Omit<SortableBlockItemProps, "block"> {
  block: Block;
  dragHandle: React.ReactNode;
  task: {
    id: string;
    status: string;
    block_id: string;
  } | null;
  commonDeleteHandler?: () => void;
  commonInsertHandlers: {
    onInsertAbove: () => void;
    onInsertBelow: () => void;
  };
}

export function BlockRenderer({
  block,
  dragHandle,
  task,
  commonDeleteHandler,
  commonInsertHandlers,
  focusedBlockId,
  onFocus,
  onBlur,
  onChange,
  onAddBlock,
  onSaveImmediate,
  editable,
  onConvertToTask,
  onConvertToFile,
  onConvertToTable,
}: BlockRendererProps) {
  return block.type === BlockType.FILE ? (
    <FileBlockCard
      block={block}
      dragHandle={dragHandle}
      editable={editable}
      onDeleteBlock={commonDeleteHandler}
      {...commonInsertHandlers}
    />
  ) : (
    <TiptapBlockItem
      blockId={block.id}
      value={block.content?.text || ""}
      position={block.position || 0}
      isFocused={focusedBlockId === block.id}
      onFocus={() => onFocus(block.id)}
      onBlur={onBlur}
      onChange={(value: string) => onChange(block.id, value)}
      onAddBlock={onAddBlock}
      onSaveImmediate={onSaveImmediate}
      onDeleteBlock={commonDeleteHandler}
      {...commonInsertHandlers}
      blockType={block.type}
      task={task}
      editable={editable}
      dragHandle={dragHandle}
      onConvertToTask={onConvertToTask}
      onConvertToFile={onConvertToFile}
      onConvertToTable={onConvertToTable}
    />
  );
}
