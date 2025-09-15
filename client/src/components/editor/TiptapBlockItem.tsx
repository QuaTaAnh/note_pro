"use client";

import { BlockType } from "@/types/types";
import { TiptapEditor } from "./TiptapEditor";

interface Props {
  value: string;
  isFocused: boolean;
  position: number;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (value: string) => void;
  onAddBlock: (position: number, type: BlockType) => void;
  onSaveImmediate: () => void;
  onDeleteBlock?: () => void;
  dragHandle?: React.ReactNode;
}

export const TiptapBlockItem = ({
  value,
  isFocused,
  position,
  onFocus,
  onBlur,
  onChange,
  onAddBlock,
  onSaveImmediate,
  onDeleteBlock,
  dragHandle,
}: Props) => {
  return (
    <TiptapEditor
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      onAddBlock={onAddBlock}
      onSaveImmediate={onSaveImmediate}
      onDeleteBlock={onDeleteBlock}
      isFocused={isFocused}
      position={position}
      placeholder='Type "/" for commands'
      editorClassName="prose prose-sm max-w-none focus:outline-none text-base break-words text-sm"
      showBubbleMenu={true}
      dragHandle={dragHandle}
    />
  );
};
