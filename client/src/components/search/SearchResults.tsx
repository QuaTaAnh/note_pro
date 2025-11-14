import { SearchResult } from "@/hooks/use-search";
import { useWorkspace } from "@/hooks/use-workspace";
import { useMemo } from "react";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchSection } from "./SearchSection";
import { SearchSkeleton } from "./SearchSkeleton";

interface Props {
  results: SearchResult;
  onResultClick: () => void;
}

export function SearchResults({ results, onResultClick }: Props) {
  const { folders, documents, tasks, sharedDocuments, isLoading } = results;
  const { workspace } = useWorkspace();

  const totalResults = useMemo(
    () =>
      folders.length + documents.length + tasks.length + sharedDocuments.length,
    [folders.length, documents.length, tasks.length, sharedDocuments.length],
  );

  if (isLoading) {
    return <SearchSkeleton />;
  }

  if (totalResults === 0) {
    return <SearchEmptyState message="No Results Found" />;
  }

  return (
    <div className="max-h-[calc(60vh-2rem)] overflow-y-auto">
      <div className="m-3">
        <SearchSection
          title="Documents"
          items={documents}
          type="document"
          workspaceId={workspace?.id ?? ""}
          onResultClick={onResultClick}
          renderSubtitle={(doc) => `In ${doc.workspace?.name ?? ""}`}
        />

        <SearchSection
          title="Tasks"
          items={tasks}
          type="task"
          workspaceId={workspace?.id ?? ""}
          onResultClick={onResultClick}
          renderSubtitle={(task) => `By ${task.user?.name ?? ""}`}
        />

        <SearchSection
          title="Folders"
          items={folders}
          type="folder"
          workspaceId={workspace?.id ?? ""}
          onResultClick={onResultClick}
          renderSubtitle={(folder) => `In ${folder.workspace?.name ?? ""}`}
        />

        <SearchSection
          title="Shared Documents"
          items={sharedDocuments}
          type="document"
          getWorkspaceId={(doc) => doc.workspace_id}
          onResultClick={onResultClick}
          renderSubtitle={(doc) => `By ${doc.user?.name ?? ""}`}
        />
      </div>
    </div>
  );
}
