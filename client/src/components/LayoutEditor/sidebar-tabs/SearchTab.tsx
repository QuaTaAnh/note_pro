import { Fragment, useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Block } from "@/hooks";
import { BlockType } from "@/types/types";
import { getPlainText } from "@/components/page/CardDocument";
import { EmptyState } from "./EmptyState";
import { Search, Sparkles } from "lucide-react";

interface SearchTabProps {
  blocks: Block[];
  onScrollToBlock: (blockId: string) => void;
}

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

export function SearchTab({ blocks, onScrollToBlock }: SearchTabProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilter, setSearchFilter] = useState<(typeof searchFilters)[number]["value"]>("all");

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [] as SearchResult[];
    const normalized = searchQuery.toLowerCase();

    return blocks
      .filter((block) => {
        if (searchFilter === "all") return true;
        if (searchFilter === "text") return block.type === BlockType.PARAGRAPH;
        if (searchFilter === "task") return block.type === BlockType.TASK;
        return block.type === BlockType.FILE;
      })
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
  }, [blocks, searchFilter, searchQuery]);

  return (
    <div className="text-sm space-y-3">
      <div className="space-y-2">
        <Input
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search in document"
          className="h-8 text-xs"
        />
        <div className="flex flex-wrap gap-1">
          {searchFilters.map((filter) => (
            <Button
              key={filter.value}
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setSearchFilter(filter.value)}
              className={cn(
                "h-6 rounded-full border px-2 text-[11px]",
                searchFilter === filter.value
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-transparent bg-muted/60 text-muted-foreground"
              )}
            >
              {filter.label}
            </Button>
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
              className="w-full rounded-lg border border-transparent px-2 py-1.5 text-left transition-colors hover:border-border hover:bg-muted/60"
            >
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-[10px] capitalize">
                  {result.type}
                </Badge>
                <span className="text-xs font-medium truncate">{result.text.slice(0, 60)}</span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                <Highlighted text={result.snippet} query={searchQuery} />
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function getBlockSearchValue(block: Block) {
  if (block.type === BlockType.FILE) {
    const content = block.content as { fileName?: string; fileUrl?: string };
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

function Highlighted({ text, query }: { text: string; query: string }) {
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
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
