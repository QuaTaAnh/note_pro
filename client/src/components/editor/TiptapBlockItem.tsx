"use client";

import { memo } from "react";
import { BlockType } from "@/types/types";
import { TiptapEditor } from "./TiptapEditor";

interface Props {
  blockId: string;
  value: string;
  isFocused: boolean;
  position: number;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (value: string) => void;
  onAddBlock: (
    position: number,
    type: BlockType,
    content?: Record<string, unknown>
  ) => Promise<void> | void;
  onSaveImmediate: () => void;
  onDeleteBlock?: () => void;
  onInsertAbove?: () => void;
  onInsertBelow?: () => void;
  dragHandle?: React.ReactNode;
  blockType?: string;
  task?: {
    id: string;
    status: string;
    block_id: string;
  } | null;
  editable?: boolean;
  onToggleUploading?: (isUploading: boolean) => void;
}

export const TiptapBlockItem = memo(
  function TiptapBlockItem({
    blockId,
    value,
    isFocused,
    position,
    onFocus,
    onBlur,
    onChange,
    onAddBlock,
    onSaveImmediate,
    onDeleteBlock,
    onInsertAbove,
    onInsertBelow,
    dragHandle,
    blockType,
    task,
    editable = true,
    onToggleUploading,
  }: Props) {
    return (
      <TiptapEditor
        blockId={blockId}
        value={value}
        onChange={onChange}
        onFocus={onFocus}
        onBlur={onBlur}
        onAddBlock={onAddBlock}
        onSaveImmediate={onSaveImmediate}
        onDeleteBlock={onDeleteBlock}
        onInsertAbove={onInsertAbove}
        onInsertBelow={onInsertBelow}
        isFocused={isFocused}
        position={position}
        editorClassName="prose prose-sm max-w-none focus:outline-none text-base break-words text-sm leading-relaxed"
        showBubbleMenu={true}
        dragHandle={dragHandle}
        isTask={blockType === BlockType.TASK}
        task={task}
        editable={editable}
        onToggleUploading={onToggleUploading}
      />
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.value === nextProps.value &&
      prevProps.isFocused === nextProps.isFocused &&
      prevProps.position === nextProps.position &&
      prevProps.editable === nextProps.editable &&
      prevProps.blockType === nextProps.blockType &&
      prevProps.task?.id === nextProps.task?.id &&
      prevProps.task?.status === nextProps.task?.status
    );
  }
);
