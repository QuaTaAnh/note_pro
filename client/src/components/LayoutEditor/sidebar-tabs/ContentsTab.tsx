import { useMemo, useState } from "react";
import { Menu } from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionItem } from "./types";
import { EmptyState } from "./EmptyState";

interface ContentsTabProps {
  sections: SectionItem[];
  onScrollToBlock: (blockId: string) => void;
}

export function ContentsTab({ sections, onScrollToBlock }: ContentsTabProps) {
  const [filter, setFilter] = useState("");

  const filteredSections = useMemo(() => {
    if (!filter.trim()) return sections;
    const query = filter.toLowerCase();
    return sections.filter((section) => section.title.toLowerCase().includes(query));
  }, [filter, sections]);

  return (
    <div className="text-sm space-y-3">
      <Input
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
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
              className="w-full rounded-lg border border-transparent px-2 py-1 text-left transition-colors hover:border-border hover:bg-muted/60"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {String(section.index).padStart(2, "0")}
                </span>
                <span className="text-xs font-semibold truncate">{section.title}</span>
              </div>
              <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground">
                {section.preview}
              </p>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
