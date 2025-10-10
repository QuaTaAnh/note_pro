"use client";

import { TiptapEditor } from "../editor/TiptapEditor";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
  editable?: boolean;
}

export function DocumentTitleInput({
  onFocus,
  onKeyDown,
  onBlur,
  value,
  onChange,
  className,
  placeholder = "Untitled",
  editable = true,
}: Props) {
  return (
    <TiptapEditor
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onKeyDown={onKeyDown}
      onBlur={onBlur}
      className={className}
      placeholder={placeholder}
      editorClassName="prose prose-sm max-w-none focus:outline-none text-xl font-bold break-words"
      isTitle={true}
      showBubbleMenu={true}
      editable={editable}
    />
  );
}
