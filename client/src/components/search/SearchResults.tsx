"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { SearchResult } from "@/hooks/use-search";
import { useWorkspace } from "@/hooks/use-workspace";
import { getPlainText } from "../page/CardDocument";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchItem } from "./SearchItem";
import { SearchSectionHeader } from "./SearchSectionHeader";

interface Props {
  results: SearchResult;
  onResultClick?: () => void;
}

export function SearchResults({ results, onResultClick }: Props) {
  const { folders, documents, tasks, isLoading } = results;
  const { workspace } = useWorkspace();

  const totalResults = folders.length + documents.length + tasks.length;

  if (isLoading) {
    return (
      <div className="py-2">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-2">
            <Skeleton className="h-5 w-5 rounded" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return totalResults === 0 ? (
    <SearchEmptyState message="No Results Found" />
  ) : (
    <div className="max-h-[calc(60vh-2rem)] overflow-y-auto">
      <div className="py-1">
        {documents.length > 0 && (
          <div>
            <SearchSectionHeader title="Documents" count={documents.length} />
            {documents.map((document) => (
              <SearchItem
                key={document.id}
                type="document"
                id={document.id}
                title={getPlainText(document.content.title)}
                href={`/editor/d/${workspace?.id}/${document.id}`}
                onClick={onResultClick}
                avatarUrl={document.user?.avatar_url ?? ""}
              />
            ))}
          </div>
        )}

        {tasks.length > 0 && (
          <div className={documents.length > 0 ? "mt-2" : ""}>
            <SearchSectionHeader title="Tasks" count={tasks.length} />
            {tasks.map((task) => {
              return (
                <SearchItem
                  key={task.id}
                  type="task"
                  id={task.id}
                  title={task.block?.content?.text}
                  href={`/s/${workspace?.id}/tasks`}
                  onClick={onResultClick}
                  avatarUrl={task.user?.avatar_url ?? ""}
                />
              );
            })}
          </div>
        )}

        {folders.length > 0 && (
          <div
            className={documents.length > 0 || tasks.length > 0 ? "mt-2" : ""}
          >
            <SearchSectionHeader title="Folders" count={folders.length} />
            {folders.map((folder) => (
              <SearchItem
                key={folder.id}
                type="folder"
                id={folder.id}
                title={folder.name}
                href={`/s/${workspace?.id}/f/${folder.id}`}
                onClick={onResultClick}
                avatarUrl={folder.user?.avatar_url ?? ""}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
