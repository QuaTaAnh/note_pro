"use client";

import { TiptapBlockItem } from "@/components/features/editor/TiptapBlockItem";
import { FileBlockCard } from "@/components/features/page/FileBlockCard";
import { SeparatorBlock } from "@/components/features/page/SeparatorBlock";
import { Block } from "@/hooks";
import { BlockType } from "@/types/types";
import { SortableBlockItemProps } from "./types";
import type { SeparatorStyle } from "@/components/features/page/SeparatorBlock";

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
  if (block.type === BlockType.FILE) {
    return (
      <FileBlockCard
        block={block}
        dragHandle={dragHandle}
        editable={editable}
        onDeleteBlock={commonDeleteHandler}
        {...commonInsertHandlers}
      />
    );
  }

  if (block.type === BlockType.SEPARATOR) {
    const style = (block.content?.style as SeparatorStyle) || "regular";
    return (
      <SeparatorBlock
        style={style}
        dragHandle={dragHandle}
        editable={editable}
        onDeleteBlock={commonDeleteHandler}
        {...commonInsertHandlers}
      />
    );
  }

  return (
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
