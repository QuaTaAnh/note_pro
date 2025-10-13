"use client";

import React from "react";
import { Search } from "lucide-react";
import { InputField } from "@/components/ui/input-field";
import { SearchResults } from "./SearchResults";
import { useSearch } from "@/hooks/use-search";
import { cn } from "@/lib/utils";

interface SearchInputFieldProps {
  placeholder?: string;
  className?: string;
  onResultClick?: () => void;
}

export function SearchInputField({
  placeholder,
  className,
  onResultClick,
}: SearchInputFieldProps) {
  const { searchTerm, setSearchTerm, results } = useSearch();

  const handleResultClickInternal = () => {
    setSearchTerm("");
    onResultClick?.();
  };

  const popoverContent =
    searchTerm.length > 0 ? (
      <SearchResults
        results={results}
        onResultClick={handleResultClickInternal}
      />
    ) : null;

  return (
    <InputField
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder={placeholder}
      className={cn("w-full", className)}
      icon={<Search className="h-4 w-4" />}
      iconPosition="left"
      popoverHeight="auto"
      popoverClassName="max-w-3xl max-h-[60vh] overflow-hidden"
      popoverContent={popoverContent}
    />
  );
}
