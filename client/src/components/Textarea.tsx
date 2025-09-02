import { useAutoResize } from "@/hooks";
import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  isTitleDocument?: boolean;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onBlur?: () => void;
  className?: string;
}

export const Textarea = ({
  isTitleDocument,
  onFocus,
  onKeyDown,
  onBlur,
  value,
  onChange,
  className,
}: Props) => {
  const textareaRef = useAutoResize(value);

  return (
    <textarea
      ref={textareaRef}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      className={`w-full text-4xl font-bold bg-transparent border-none outline-none resize-none placeholder-gray-400 ${className}`}
      placeholder={isTitleDocument ? "Untitled" : "Type '/' for commands"}
      style={{ minHeight: "auto" }}
    />
  );
};
