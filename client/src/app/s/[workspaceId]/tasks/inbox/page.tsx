"use client";

import React, { useMemo } from "react";
import { PageLoading } from "@/components/ui/loading";
import {
  GetTodoTasksDocument,
  useGetTodoTasksQuery,
} from "@/graphql/queries/__generated__/task.generated";
import { useUpdateTaskMutation } from "@/graphql/mutations/__generated__/task.generated";
import { useWorkspace } from "@/hooks/use-workspace";
import { Task } from "@/types/app";
import { TaskItem } from "@/components/page/TaskItem";
import { showToast } from "@/lib/toast";
import { TASK_STATUS } from "@/consts";

export default function InboxPage() {
  const { workspace } = useWorkspace();

  const { loading, data } = useGetTodoTasksQuery({
    variables: { workspaceId: workspace?.id || "" },
    skip: !workspace?.id,
    fetchPolicy: "cache-and-network",
  });

  const [updateTask] = useUpdateTaskMutation();

  const tasks: Task[] = useMemo(() => {
    return data?.tasks || [];
  }, [data]);

  const handleToggleComplete = async (taskId: string, completed: boolean) => {
    try {
      await updateTask({
        variables: {
          id: taskId,
          input: {
            status: completed ? TASK_STATUS.COMPLETED : TASK_STATUS.TODO,
          },
        },
        refetchQueries: [GetTodoTasksDocument],
      });
      showToast.success(completed ? "Task completed" : "Task reopened");
    } catch (error) {
      console.error("Failed to update task:", error);
      showToast.error("Failed to update task");
    }
  };

  const handleMoreClick = (taskId: string) => {
    console.log("More options for task:", taskId);
  };

  return loading && tasks.length === 0 ? (
    <PageLoading />
  ) : (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-sm text-muted-foreground flex items-center justify-center w-full h-64">
          No tasks in inbox yet
        </div>
      ) : (
        <div className="space-y-1">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              id={task.id}
              title={task.block?.content?.title || "Untitled"}
              completed={task.status === "completed"}
              scheduleDate={task.schedule_date || undefined}
              dueDate={task.due_date || undefined}
              onToggleComplete={handleToggleComplete}
              onMoreClick={handleMoreClick}
            />
          ))}
        </div>
      )}
    </div>
  );
}
