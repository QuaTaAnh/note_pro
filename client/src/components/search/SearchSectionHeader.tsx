"use client";

import React from "react";

interface SearchSectionHeaderProps {
  title: string;
  count?: number;
}

export function SearchSectionHeader({
  title,
  count,
}: SearchSectionHeaderProps) {
  return (
    <div className="px-3 py-2 text-xs font-medium text-gray-500">
      {title}
      {count !== undefined && count > 0 && ` (${count})`}
    </div>
  );
}
