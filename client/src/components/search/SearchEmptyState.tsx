"use client";

import React from "react";
import { Search } from "lucide-react";

interface Props {
  message?: string;
}

export function SearchEmptyState({ message }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-3 mb-4">
        <Search className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
        {message || "No Results Found"}
      </h3>
    </div>
  );
}
