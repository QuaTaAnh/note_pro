import {
  useMemo,
  useState,
  useCallback,
  Fragment,
  type ReactNode,
} from "react";
import Image from "next/image";
import {
  CheckCircle,
  Menu,
  Paperclip,
  Search,
  FileText,
  ListChecks,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { formatDate, cn } from "@/lib/utils";
import { getPlainText } from "../page/CardDocument";
import { Block, useDocumentBlocksData } from "@/hooks";
import { BlockType } from "@/types/types";
import { TaskItem } from "../page/TaskItem";
import { TASK_STATUS } from "@/consts";
import { showToast } from "@/lib/toast";
import { useUpdateTaskMutation } from "@/graphql/mutations/__generated__/task.generated";
import { GetDocumentBlocksDocument } from "@/graphql/queries/__generated__/document.generated";

interface Props {
  pageId: string;
}

type AttachmentContent = {
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
};

export const LeftSidebar = ({ pageId }: Props) => {
  const { processedRootBlock: rootBlock, processedBlocks: blocks, loading } =
    useDocumentBlocksData(pageId);
  const [sectionFilter, setSectionFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<
    "all" | "text" | "task" | "attachment"
  >("all");
  const [pendingTaskIds, setPendingTaskIds] = useState<Set<string>>(
    () => new Set(),
  );
  const [updateTask] = useUpdateTaskMutation();

  const textBlocks = useMemo(
    () =>
      (blocks || []).filter((block) => block.type === BlockType.PARAGRAPH),
    [blocks],
  );

  const taskBlocks = useMemo(
    () =>
      (blocks || []).filter(
        (block) => block.type === BlockType.TASK && block.tasks?.length,
      ),
    [blocks],
  );

  const attachmentBlocks = useMemo(
    () =>
      (blocks || []).filter((block) => block.type === BlockType.FILE),
    [blocks],
  );

  const wordCount = useMemo(
    () =>
      textBlocks.reduce((total, block) => {
        const text = getPlainText(block.content?.text);
        if (!text) return total;
        const words = text.trim().split(/\s+/).filter(Boolean).length;
        return total + words;
      }, 0),
    [textBlocks],
  );

  const sectionItems = useMemo(() => {
    return textBlocks.map((block, index) => {
      const plain = getPlainText(block.content?.text) || "";
      return {
        id: block.id,
        index: index + 1,
        title: plain || `Section ${index + 1}`,
        preview: plain.slice(0, 120).trim() || "No text",
      };
    });
  }, [textBlocks]);

  const filteredSections = useMemo(() => {
    if (!sectionFilter.trim()) return sectionItems;
    const query = sectionFilter.toLowerCase();
    return sectionItems.filter((section) =>
      section.title.toLowerCase().includes(query),
    );
  }, [sectionFilter, sectionItems]);

  const tasks = useMemo(() => {
    return taskBlocks
      .map((block) => {
        const task = block.tasks?.[0];
        if (!task) return null;
        return {
          blockId: block.id,
          task,
          title: getPlainText(block.content?.text) || "Untitled task",
        };
      })
      .filter(Boolean) as {
      blockId: string;
      task: NonNullable<Block["tasks"]>[0];
      title: string;
    }[];
  }, [taskBlocks]);

  const attachments = useMemo(() => {
    return attachmentBlocks.map((block) => {
      const content = (block.content as AttachmentContent) || {};
      const sizeLabel = content.fileSize
        ? formatFileSize(content.fileSize)
        : null;
      return {
        id: block.id,
        name: content.fileName || content.fileUrl || "Untitled file",
        type: content.fileType || "Unknown type",
        size: sizeLabel,
        url: content.fileUrl || null,
        updatedAt: block.updated_at || block.created_at || null,
      };
    });
  }, [attachmentBlocks]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [] as SearchResult[];
    const normalized = searchQuery.toLowerCase();
    return (blocks || [])
      .filter((block) =>
        searchFilter === "all"
          ? true
          : searchFilter === "text"
            ? block.type === BlockType.PARAGRAPH
            : searchFilter === "task"
              ? block.type === BlockType.TASK
              : block.type === BlockType.FILE,
      )
      .map((block) => {
        const text = getBlockSearchValue(block);
        return {
          id: block.id,
          type: block.type,
          text,
          snippet: createSnippet(text, normalized),
        } as SearchResult;
      })
      .filter((result) =>
        result.text.toLowerCase().includes(normalized),
      );
  }, [blocks, searchQuery, searchFilter]);

  const handleScrollToBlock = useCallback((blockId: string) => {
    if (typeof window === "undefined") return;
    const el = document.querySelector<HTMLElement>(
      `[data-block-id="${blockId}"]`,
    );
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "center" });
    const highlightClasses = [
      "ring-2",
      "ring-primary/50",
      "bg-primary/5",
      "transition",
    ];
    el.classList.add(...highlightClasses);
    window.setTimeout(() => {
      el.classList.remove(...highlightClasses);
    }, 1200);
  }, []);

  const handleToggleTask = useCallback(
    async (taskId: string, completed: boolean) => {
      if (!taskId) return;
      setPendingTaskIds((prev) => {
        const next = new Set(prev);
        next.add(taskId);
        return next;
      });
      try {
        await updateTask({
          variables: {
            id: taskId,
            input: {
              status: completed ? TASK_STATUS.COMPLETED : TASK_STATUS.TODO,
            },
          },
          refetchQueries: [
            { query: GetDocumentBlocksDocument, variables: { pageId } },
          ],
          awaitRefetchQueries: true,
        });
        showToast.success(
          completed ? "Marked task complete" : "Task reopened",
        );
      } catch (error) {
        console.error("Failed to update task status", error);
        showToast.error("Unable to update task");
      } finally {
        setPendingTaskIds((prev) => {
          const next = new Set(prev);
          next.delete(taskId);
          return next;
        });
      }
    },
    [updateTask, pageId],
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-2 h-full flex flex-col">
        <div className="flex flex-row items-center gap-2 mb-3">
          <Image
            src="/images/document-icon.png"
            alt="Document"
            width={36}
            height={36}
            className="h-9 w-9 shrink-0"
          />

          <div className="flex flex-col flex-1 min-w-0">
            {loading ? (
              <>
                <span className="text-sm font-medium truncate animate-pulse">
                  Loading...
                </span>
                <span className="text-xs text-muted-foreground truncate animate-pulse">
                  ...
                </span>
              </>
            ) : (
              <>
                <span className="text-sm font-medium truncate">
                  {getPlainText(rootBlock?.content?.title) || "Untitled"}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {formatDate(rootBlock?.updated_at || "", { relative: true })}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3">
          <StatCard
            label="Sections"
            value={textBlocks.length}
            icon={<Menu className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Tasks"
            value={tasks.length}
            description={`${tasks.filter((t) =>
              t.task?.status === TASK_STATUS.COMPLETED,
            ).length} done`}
            icon={<CheckCircle className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Attachments"
            value={attachments.length}
            icon={<Paperclip className="h-3.5 w-3.5" />}
          />
          <StatCard
            label="Words"
            value={wordCount}
            icon={<FileText className="h-3.5 w-3.5" />}
          />
        </div>

        <Tabs defaultValue="contents" className="w-full flex-1 flex flex-col">
          <TabsList className="grid grid-cols-4 gap-1">
            <TabsTrigger value="contents">
              <Menu className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <CheckCircle className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="attachments">
              <Paperclip className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="find">
              <Search className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>
          <div className="flex-1 py-2 overflow-y-auto">
            <TabsContent value="contents" className="text-sm space-y-3">
              <Input
                value={sectionFilter}
                onChange={(event) => setSectionFilter(event.target.value)}
                placeholder="Filter sections"
                className="h-8 text-xs"
              />
              <div className="space-y-1.5">
                {filteredSections.length === 0 ? (
                  <EmptyState
                    icon={<Menu className="h-4 w-4" />}
                    title="No sections"
                    description="Add text blocks to build an outline"
                  />
                ) : (
                  filteredSections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => handleScrollToBlock(section.id)}
                      className="w-full rounded-lg border border-transparent px-2 py-1 text-left hover:border-border hover:bg-muted/60 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-medium text-muted-foreground">
                          {String(section.index).padStart(2, "0")}
                        </span>
                        <span className="text-xs font-semibold truncate">
                          {section.title}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                        {section.preview}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </TabsContent>
            <TabsContent value="tasks" className="text-sm space-y-3">
              {tasks.length === 0 ? (
                <EmptyState
                  icon={<ListChecks className="h-4 w-4" />}
                  title="No tasks"
                  description="Convert blocks to tasks to track progress"
                />
              ) : (
                <div className="space-y-2">
                  {tasks.map(({ blockId, task, title }) => (
                    <TaskItem
                      key={blockId}
                      id={task?.id || blockId}
                      title={title}
                      completed={task?.status === TASK_STATUS.COMPLETED}
                      onToggleComplete={(taskId, completed) =>
                        handleToggleTask(taskId, completed)
                      }
                      className={cn(
                        "border rounded-lg",
                        pendingTaskIds.has(task.id) && "opacity-70",
                      )}
                      variant="compact"
                      scheduleDate={task?.schedule_date || undefined}
                      deadlineDate={task?.deadline_date || undefined}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="attachments" className="text-sm space-y-3">
              {attachments.length === 0 ? (
                <EmptyState
                  icon={<Paperclip className="h-4 w-4" />}
                  title="No attachments"
                  description="Upload files right from the editor"
                />
              ) : (
                <div className="space-y-2">
                  {attachments.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center gap-3 rounded-lg border px-2 py-2 hover:bg-muted/50"
                    >
                      <div className="h-8 w-8 rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                        <Paperclip className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">
                          {file.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {file.type}
                          {file.size ? ` · ${file.size}` : ""}
                        </p>
                      </div>
                      {file.updatedAt && (
                        <Badge variant="secondary" className="text-[10px]">
                          {formatDate(file.updatedAt, { relative: true })}
                        </Badge>
                      )}
                      {file.url && (
                        <Button variant="ghost" size="icon" asChild>
                          <a
                            href={file.url}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="text-muted-foreground"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
            <TabsContent value="find" className="text-sm space-y-3">
              <div className="space-y-2">
                <Input
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search in document"
                  className="h-8 text-xs"
                />
                <div className="flex gap-1 flex-wrap">
                  {searchFilters.map((filter) => (
                    <button
                      key={filter.value}
                      type="button"
                      onClick={() => setSearchFilter(filter.value)}
                      className={cn(
                        "text-[11px] rounded-full border px-2 py-1",
                        searchFilter === filter.value
                          ? "bg-primary/10 border-primary text-primary"
                          : "border-transparent bg-muted/60 text-muted-foreground",
                      )}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              {!searchQuery && (
                <EmptyState
                  icon={<Sparkles className="h-4 w-4" />}
                  title="Search anything"
                  description="Look up text, tasks or attachments"
                />
              )}
              {searchQuery && searchResults.length === 0 && (
                <EmptyState
                  icon={<Search className="h-4 w-4" />}
                  title="No matches"
                  description="Try a different keyword"
                />
              )}
              {searchResults.length > 0 && (
                <div className="space-y-2">
                  {searchResults.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleScrollToBlock(result.id)}
                      className="w-full rounded-lg border border-transparent px-2 py-1.5 text-left hover:border-border hover:bg-muted/60"
                    >
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[10px] capitalize">
                          {result.type}
                        </Badge>
                        <span className="text-xs font-medium truncate">
                          {result.text.slice(0, 60)}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 mt-0.5">
                        <Highlighted text={result.snippet} query={searchQuery} />
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

interface StatCardProps {
  label: string;
  value: number;
  description?: string;
  icon: ReactNode;
}

const StatCard = ({ label, value, description, icon }: StatCardProps) => {
  return (
    <div className="rounded-lg border px-2 py-2 text-left">
      <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <div className="text-base font-semibold leading-tight">
        {value}
      </div>
      {description && (
        <p className="text-[10px] text-muted-foreground">{description}</p>
      )}
    </div>
  );
};

const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) => (
  <div className="flex flex-col items-center justify-center rounded-md border border-dashed px-3 py-6 text-center">
    <div className="mb-2 text-muted-foreground">{icon}</div>
    <p className="text-xs font-semibold">{title}</p>
    <p className="text-[11px] text-muted-foreground">{description}</p>
  </div>
);

type SearchResult = {
  id: string;
  type: BlockType;
  text: string;
  snippet: string;
};

const searchFilters = [
  { label: "All", value: "all" as const },
  { label: "Text", value: "text" as const },
  { label: "Tasks", value: "task" as const },
  { label: "Files", value: "attachment" as const },
];

function formatFileSize(bytes: number) {
  if (!bytes || bytes <= 0) return null;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

function getBlockSearchValue(block: Block) {
  if (block.type === BlockType.FILE) {
    const content = (block.content as AttachmentContent) || {};
    return content.fileName || content.fileUrl || "Untitled file";
  }
  return getPlainText(block.content?.text) || "";
}

function createSnippet(text: string, query: string) {
  if (!text) return "";
  const normalizedText = text.trim();
  const lower = normalizedText.toLowerCase();
  const index = lower.indexOf(query);
  if (index === -1) return normalizedText.slice(0, 120);
  const start = Math.max(0, index - 20);
  const end = Math.min(normalizedText.length, index + query.length + 40);
  const prefix = start > 0 ? "…" : "";
  const suffix = end < normalizedText.length ? "…" : "";
  return `${prefix}${normalizedText.slice(start, end)}${suffix}`;
}

const Highlighted = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <>{text}</>;
  const regex = new RegExp(`(${escapeRegExp(query)})`, "gi");
  const parts = text.split(regex);
  const normalized = query.toLowerCase();
  return (
    <>
      {parts.map((part, index) => {
        const isMatch = part.toLowerCase() === normalized;
        return (
          <Fragment key={`${part}-${index}`}>
            {isMatch ? (
              <mark className="bg-primary/20 text-foreground">
                {part}
              </mark>
            ) : (
              part
            )}
          </Fragment>
        );
      })}
    </>
  );
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
