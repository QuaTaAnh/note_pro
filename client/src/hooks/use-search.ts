import {
  SearchAllQuery,
  useSearchAllLazyQuery
} from "@/graphql/queries/__generated__/search.generated";
import { useCallback, useEffect, useState } from "react";
import { useDebounce as useDebounceValue } from "use-debounce";
import { useWorkspace } from "./use-workspace";

export interface SearchResult {
  folders: SearchAllQuery["folders"];
  documents: SearchAllQuery["documents"];
  tasks: SearchAllQuery["tasks"];
  isLoading: boolean;
}

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 500);
  const { workspace } = useWorkspace();

  const [searchAll, { data: allData, loading: allLoading }] =
    useSearchAllLazyQuery();

  const executeSearch = useCallback(
    (term: string) => {
      if (!workspace?.id || !term) {
        return;
      }

      const searchPattern = `%${term.trim()}%`;

      searchAll({
        variables: {
          workspaceId: workspace.id,
          searchTerm: searchPattern,
        },
      });
    },
    [
      workspace?.id,
      searchAll,
    ]
  );

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim().length > 0) {
      executeSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, executeSearch]);

  const results: SearchResult = {
    folders: allData?.folders || [],
    documents:
      allData?.documents || [],
    tasks: allData?.tasks || [],
    isLoading:
      allLoading,
  };

  return {
    searchTerm,
    setSearchTerm,
    results,
    hasResults:
      results.folders.length > 0 ||
      results.documents.length > 0 ||
      results.tasks.length > 0,
  };
}
