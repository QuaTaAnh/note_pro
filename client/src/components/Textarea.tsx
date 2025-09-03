import { useAutoResize } from "@/hooks";
import React, { useCallback, useMemo } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  isTitleDocument?: boolean;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onBlur?: () => void;
  className?: string;
}

export const Textarea = React.memo(
  ({
    isTitleDocument,
    onFocus,
    onKeyDown,
    onBlur,
    value,
    onChange,
    className,
  }: Props) => {
    const textareaRef = useAutoResize(value);

    // Memoize change handler
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    // Memoize styles and classes
    const textareaStyles = useMemo(
      () => ({
        minHeight: "auto",
      }),
      []
    );

    const textareaClasses = useMemo(
      () =>
        `w-full text-4xl font-bold bg-transparent border-none outline-none resize-none placeholder-gray-400 ${
          className || ""
        }`.trim(),
      [className]
    );

    const placeholder = useMemo(
      () => (isTitleDocument ? "Untitled" : "Type '/' for commands"),
      [isTitleDocument]
    );

    return (
      <textarea
        ref={textareaRef}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        className={textareaClasses}
        placeholder={placeholder}
        style={textareaStyles}
      />
    );
  }
);

Textarea.displayName = "Textarea";
