import { useMemo, useState, Fragment } from "react";
import { Menu, CheckCircle, Paperclip, Search, ListChecks, Sparkles, ExternalLink } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { cn, formatDate } from "@/lib/utils";
import { TaskItem } from "../page/TaskItem";
import { TASK_STATUS } from "@/consts";
import { Block } from "@/hooks";
import { BlockType } from "@/types/types";
import { getPlainText } from "../page/CardDocument";

type SearchFilter = "all" | "text" | "task" | "attachment";

export type SectionItem = {
  id: string;
  index: number;
  title: string;
  preview: string;
};

export type SidebarTask = {
  blockId: string;
  task: NonNullable<Block["tasks"]>[0];
  title: string;
};

export type SidebarAttachment = {
  id: string;
  name: string;
  type: string;
  size: string | null;
  url: string | null;
  updatedAt: string | null;
};

interface Props {
  sections: SectionItem[];
  tasks: SidebarTask[];
  attachments: SidebarAttachment[];
  blocks: Block[];
  pendingTaskIds: Set<string>;
  onScrollToBlock: (blockId: string) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
}

export const SidebarTabs = ({
  sections,
  tasks,
  attachments,
  blocks,
  pendingTaskIds,
  onScrollToBlock,
  onToggleTask,
}: Props) => {
  const [sectionFilter, setSectionFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<SearchFilter>("all");

  const filteredSections = useMemo(() => {
    if (!sectionFilter.trim()) return sections;
    const query = sectionFilter.toLowerCase();
    return sections.filter((section) => section.title.toLowerCase().includes(query));
  }, [sectionFilter, sections]);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [] as SearchResult[];
    const normalized = searchQuery.toLowerCase();
    return blocks
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
      .filter((result) => result.text.toLowerCase().includes(normalized));
  }, [blocks, searchQuery, searchFilter]);

  return (
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
                  onClick={() => onScrollToBlock(section.id)}
                  className="w-full rounded-lg border border-transparent px-2 py-1 text-left hover:border-border hover:bg-muted/60 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium text-muted-foreground">
                      {String(section.index).padStart(2, "0")}
                    </span>
                    <span className="text-xs font-semibold truncate">{section.title}</span>
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
                  onToggleComplete={(taskId, completed) => onToggleTask(taskId, completed)}
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
                    <p className="text-xs font-semibold truncate">{file.name}</p>
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
                  onClick={() => onScrollToBlock(result.id)}
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
  );
};

const EmptyState = ({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
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

function getBlockSearchValue(block: Block) {
  if (block.type === BlockType.FILE) {
    const content = block.content as {
      fileName?: string;
      fileUrl?: string;
    };
    return content?.fileName || content?.fileUrl || "Untitled file";
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
              <mark className="bg-primary/20 text-foreground">{part}</mark>
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
