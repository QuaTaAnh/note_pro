import React, { useCallback, useMemo } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
}

export const Textarea = React.memo(
  ({
    onFocus,
    onKeyDown,
    onBlur,
    value,
    onChange,
    className,
    placeholder,
  }: Props) => {
    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    const textareaClasses = useMemo(
      () =>
        `w-full bg-transparent border-none outline-none resize-none placeholder-gray-400 ${
          className || ""
        }`.trim(),
      [className]
    );

    return (
      <textarea
        onKeyDown={onKeyDown}
        onFocus={onFocus}
        value={value}
        onChange={handleChange}
        onBlur={onBlur}
        className={textareaClasses}
        placeholder={placeholder}
      />
    );
  }
);

Textarea.displayName = "Textarea";
