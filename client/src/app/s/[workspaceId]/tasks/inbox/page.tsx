"use client";

import React, { useMemo } from "react";
import { PageLoading } from "@/components/ui/loading";
import { useGetTasksQuery } from "@/graphql/queries/__generated__/task.generated";
import { useWorkspace } from "@/hooks/use-workspace";
import { Task } from "@/types/app";

export default function InboxPage() {
  const { workspace } = useWorkspace();

  const { loading, data } = useGetTasksQuery({
    variables: { workspaceId: workspace?.id || "" },
    skip: !workspace?.id,
    fetchPolicy: "cache-and-network",
  });

  const tasks: Task[] = useMemo(() => data?.tasks || [], [data]);

  return loading && tasks.length === 0 ? (
    <PageLoading />
  ) : (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <div className="text-sm text-muted-foreground flex items-center justify-center w-full h-64">
          No tasks in inbox yet
        </div>
      ) : (
        <div className="space-y-2">
          {tasks.map((task) => (
            <div key={task.id} className="p-3 border rounded-lg">
              <div className="font-medium">
                {task.block?.content?.title || "Untitled"}
              </div>
              <div className="text-sm text-muted-foreground">
                Status: {task.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
