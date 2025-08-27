import { useAutoResize } from "@/hooks/useAutoResize";
import React from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const TitleTextarea = ({ value, onChange }: Props) => {
  const textareaRef = useAutoResize(value);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full text-4xl font-bold bg-transparent border-none outline-none resize-none placeholder-gray-400"
      placeholder="Untitled"
      style={{ minHeight: "auto" }}
    />
  );
};
