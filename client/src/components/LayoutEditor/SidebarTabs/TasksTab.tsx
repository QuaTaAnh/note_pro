import { ListChecks } from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskItem } from "@/components/page/TaskItem";
import { TASK_STATUS } from "@/consts";
import { SidebarTask } from "./types";
import { EmptyState } from "./EmptyState";

interface TasksTabProps {
  tasks: SidebarTask[];
  pendingTaskIds: Set<string>;
  onToggleTask: (taskId: string, completed: boolean) => void;
}

export const TasksTab = ({
  tasks,
  pendingTaskIds,
  onToggleTask,
}: TasksTabProps) => {
  return tasks.length === 0 ? (
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
            onToggleTask(taskId, completed)
          }
          className={cn(
            "rounded-lg border",
            task && pendingTaskIds.has(task.id) && "opacity-70"
          )}
          variant="compact"
          scheduleDate={task?.schedule_date || undefined}
          deadlineDate={task?.deadline_date || undefined}
        />
      ))}
    </div>
  );
};
