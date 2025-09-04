"use client";

import { Textarea } from "@/components/Textarea";

interface Props {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function DocumentTitleInput({ value, onChange, className = "" }: Props) {
  return (
    <Textarea
      className={`text-2xl font-bold h-8 ${className}`}
      value={value}
      onChange={onChange}
      placeholder="Untitled"
    />
  );
}
