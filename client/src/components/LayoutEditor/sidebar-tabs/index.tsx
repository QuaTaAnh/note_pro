import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle, Menu, Paperclip, Search } from "lucide-react";
import { Block } from "@/hooks";
import { ContentsTab } from "./ContentsTab";
import { TasksTab } from "./TasksTab";
import { AttachmentsTab } from "./AttachmentsTab";
import { SearchTab } from "./SearchTab";
import { SectionItem, SidebarAttachment, SidebarTask } from "./types";

interface SidebarTabsProps {
  sections: SectionItem[];
  tasks: SidebarTask[];
  attachments: SidebarAttachment[];
  blocks: Block[];
  pendingTaskIds: Set<string>;
  onScrollToBlock: (blockId: string) => void;
  onToggleTask: (taskId: string, completed: boolean) => void;
}

export function SidebarTabs({
  sections,
  tasks,
  attachments,
  blocks,
  pendingTaskIds,
  onScrollToBlock,
  onToggleTask,
}: SidebarTabsProps) {
  return (
    <Tabs defaultValue="contents" className="flex h-full flex-1 flex-col">
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
      <div className="flex-1 overflow-y-auto py-2">
        <TabsContent value="contents">
          <ContentsTab sections={sections} onScrollToBlock={onScrollToBlock} />
        </TabsContent>
        <TabsContent value="tasks">
          <TasksTab
            tasks={tasks}
            pendingTaskIds={pendingTaskIds}
            onToggleTask={onToggleTask}
          />
        </TabsContent>
        <TabsContent value="attachments">
          <AttachmentsTab attachments={attachments} />
        </TabsContent>
        <TabsContent value="find">
          <SearchTab blocks={blocks} onScrollToBlock={onScrollToBlock} />
        </TabsContent>
      </div>
    </Tabs>
  );
}

export type { SectionItem, SidebarTask, SidebarAttachment };
