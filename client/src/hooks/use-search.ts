import {
  SearchAllQuery,
  useSearchAllLazyQuery,
} from "@/graphql/queries/__generated__/search.generated";
import { useCallback, useEffect, useState } from "react";
import { useDebounce as useDebounceValue } from "use-debounce";
import { useWorkspace } from "./use-workspace";
import { useAuth } from "./use-auth";

export interface SearchResult {
  folders: SearchAllQuery["folders"];
  documents: SearchAllQuery["documents"];
  sharedDocuments: SearchAllQuery["sharedDocuments"];
  tasks: SearchAllQuery["tasks"];
  isLoading: boolean;
}

export function useSearch() {
  const { userId } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounceValue(searchTerm, 700);
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
          userId: userId!,
        },
        fetchPolicy: "network-only",
      });
    },
    [workspace?.id, searchAll, userId],
  );

  useEffect(() => {
    if (debouncedSearchTerm) {
      executeSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm, executeSearch, setSearchTerm]);

  const results: SearchResult = {
    folders: allData?.folders || [],
    documents: allData?.documents || [],
    sharedDocuments: allData?.sharedDocuments || [],
    tasks: allData?.tasks || [],
    isLoading: allLoading,
  };

  return {
    searchTerm,
    setSearchTerm,
    results,
    hasResults:
      results.folders.length > 0 ||
      results.documents.length > 0 ||
      results.sharedDocuments.length > 0 ||
      results.tasks.length > 0,
  };
}
