"use client";

import { SearchResult } from "@/hooks/useSearch";
import { useWorkspace } from "@/hooks/useWorkspace";
import { useMemo, useState } from "react";
import { SearchEmptyState } from "./SearchEmptyState";
import { SearchSection } from "./SearchSection";
import { SearchSkeleton } from "./SearchSkeleton";
import { cn } from "@/lib/utils";

interface Props {
  results: SearchResult;
  onResultClick: () => void;
}

type TabType = "all" | "documents" | "tasks" | "folders" | "shared";

export function SearchResults({ results, onResultClick }: Props) {
  const { folders, documents, tasks, sharedDocuments, isLoading } = results;
  const { workspace } = useWorkspace();
  const [activeTab, setActiveTab] = useState<TabType>("all");

  const counts = useMemo(
    () => ({
      all:
        folders.length +
        documents.length +
        tasks.length +
        sharedDocuments.length,
      documents: documents.length,
      tasks: tasks.length,
      folders: folders.length,
      shared: sharedDocuments.length,
    }),
    [folders.length, documents.length, tasks.length, sharedDocuments.length]
  );

  if (isLoading) {
    return <SearchSkeleton />;
  }

  if (counts.all === 0) {
    return <SearchEmptyState message="No Results Found" />;
  }

  const tabs: { label: string; value: TabType }[] = [
    { label: `All (${counts.all})`, value: "all" },
    { label: `Documents (${counts.documents})`, value: "documents" },
    { label: `Tasks (${counts.tasks})`, value: "tasks" },
    { label: `Folders (${counts.folders})`, value: "folders" },
    { label: `Shared (${counts.shared})`, value: "shared" },
  ];

  return (
    <div className="flex flex-col">
      {/* Tabs */}
      <div className="border-b border-soft-border px-4 pt-3">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                "pb-3 text-sm font-medium transition-colors relative",
                activeTab === tab.value
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {activeTab === tab.value && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="max-h-[calc(60vh-4rem)] overflow-y-auto">
        <div className="p-4">
          {(activeTab === "all" || activeTab === "documents") &&
            documents.length > 0 && (
              <SearchSection
                title="Documents"
                items={documents}
                type="document"
                workspaceId={workspace?.id ?? ""}
                onResultClick={onResultClick}
                renderSubtitle={(doc) => `In ${doc.workspace?.name ?? ""}`}
              />
            )}

          {(activeTab === "all" || activeTab === "tasks") &&
            tasks.length > 0 && (
              <SearchSection
                title="Tasks"
                items={tasks}
                type="task"
                workspaceId={workspace?.id ?? ""}
                onResultClick={onResultClick}
                renderSubtitle={(task) => `By ${task.user?.name ?? ""}`}
              />
            )}

          {(activeTab === "all" || activeTab === "folders") &&
            folders.length > 0 && (
              <SearchSection
                title="Folders"
                items={folders}
                type="folder"
                workspaceId={workspace?.id ?? ""}
                onResultClick={onResultClick}
                renderSubtitle={(folder) =>
                  `In ${folder.workspace?.name ?? ""}`
                }
              />
            )}

          {(activeTab === "all" || activeTab === "shared") &&
            sharedDocuments.length > 0 && (
              <SearchSection
                title="Shared Documents"
                items={sharedDocuments}
                type="document"
                getWorkspaceId={(doc) => doc.workspace_id}
                onResultClick={onResultClick}
                renderSubtitle={(doc) => `By ${doc.user?.name ?? ""}`}
              />
            )}
        </div>
      </div>
    </div>
  );
}
