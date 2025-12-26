import { ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskItem } from "@/components/features/page/TaskItem";
import { TASK_STATUS } from "@/lib/constants";
import { SidebarTask } from "./types";
import { EmptyState } from "./EmptyState";

interface TasksTabProps {
  tasks: SidebarTask[];
  pendingTaskIds: Set<string>;
  onToggleTask: (taskId: string, completed: boolean) => void;
  onScrollToBlock?: (blockId: string) => void;
  activeBlockId?: string;
}

export const TasksTab = ({
  tasks,
  pendingTaskIds,
  onToggleTask,
  onScrollToBlock,
  activeBlockId,
}: TasksTabProps) => {
  return (
    <div className="flex flex-col h-full">
      <h3 className="text-xs text-muted-foreground mb-2">Tasks</h3>
      <div className="text-sm space-y-1.5">
        {tasks.length === 0 ? (
          <h3 className="text-xs text-muted-foreground mt-2">
            Tasks inside this document will appear here.
          </h3>
        ) : (
          tasks.map(({ blockId, task, title }) => (
            <TaskItem
              key={blockId}
              id={task?.id || blockId}
              title={title}
              completed={task?.status === TASK_STATUS.COMPLETED}
              onToggleComplete={(taskId, completed) =>
                onToggleTask(taskId, completed)
              }
              onItemClick={
                onScrollToBlock ? () => onScrollToBlock(blockId) : undefined
              }
              isActive={blockId === activeBlockId}
              className={cn(
                "rounded-lg border",
                task && pendingTaskIds.has(task.id) && "opacity-70",
              )}
              variant="compact"
              scheduleDate={task?.schedule_date || undefined}
              deadlineDate={task?.deadline_date || undefined}
            />
          ))
        )}
      </div>
    </div>
  );
};
