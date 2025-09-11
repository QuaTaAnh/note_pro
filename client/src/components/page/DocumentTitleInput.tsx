"use client";

import { useCallback, useEffect, useRef } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  onBlur?: () => void;
  className?: string;
  placeholder?: string;
}

export function DocumentTitleInput({
  onFocus,
  onKeyDown,
  onBlur,
  value,
  onChange,
  className,
  placeholder,
}: Props) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  const resize = useCallback(() => {
    if (!ref.current) return;
    const el = ref.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, []);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onChange(e.target.value);
      resize();
    },
    [onChange, resize]
  );

  useEffect(() => {
    resize();
  }, [resize, value]);

  return (
    <textarea
      ref={ref}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      value={value}
      onChange={handleChange}
      onBlur={onBlur}
      className={`text-xl font-bold w-full bg-transparent border-none outline-none resize-none ${className}`}
      placeholder={placeholder}
      style={{
        overflow: "hidden",
        lineHeight: "1.2",
      }}
      rows={1}
    />
  );
}
