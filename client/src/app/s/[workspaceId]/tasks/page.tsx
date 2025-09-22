"use client";

import React from "react";
import { useWorkspace } from "@/hooks/use-workspace";
import { useGetTasksQuery } from "@/graphql/queries/__generated__/task.generated";
import { Spinner } from "@/components/ui/spinner";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FiCalendar, FiFlag, FiClock } from "react-icons/fi";
import { AiOutlineCheckCircle } from "react-icons/ai";

const PRIORITY_COLORS = {
  low: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  high: "bg-red-100 text-red-800",
};

const STATUS_COLORS = {
  todo: "bg-gray-100 text-gray-800",
  in_progress: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
};

export default function TasksPage() {
  const { workspace } = useWorkspace();

  const { loading, data, error } = useGetTasksQuery({
    variables: { workspaceId: workspace?.id || "" },
    skip: !workspace?.id,
    fetchPolicy: "cache-and-network",
  });

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-red-500">Error loading tasks: {error.message}</p>
      </div>
    );
  }

  const tasks = data?.tasks || [];

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Tasks</h1>
        <div className="text-sm text-gray-600">
          {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <AiOutlineCheckCircle className="w-16 h-16 text-gray-300 mb-4" />
          <h2 className="text-lg font-medium text-gray-600 mb-2">
            No tasks yet
          </h2>
          <p className="text-gray-500">
            Create your first task using the + button in the sidebar
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {tasks.map((task) => {
            const taskContent = task.block?.content as any;
            const title = taskContent?.title || "Untitled Task";
            const description = taskContent?.description || "";

            return (
              <Card
                key={task.id}
                className="p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-medium truncate">{title}</h3>
                      {task.status && (
                        <Badge
                          className={`text-xs ${
                            STATUS_COLORS[
                              task.status as keyof typeof STATUS_COLORS
                            ] || STATUS_COLORS.todo
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </Badge>
                      )}
                    </div>

                    {description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {description}
                      </p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {task.due_date && (
                        <div className="flex items-center gap-1">
                          <FiCalendar className="w-3 h-3" />
                          <span>{formatDate(task.due_date)}</span>
                        </div>
                      )}

                      {task.priority && (
                        <div className="flex items-center gap-1">
                          <FiFlag className="w-3 h-3" />
                          <Badge
                            className={`text-xs ${
                              PRIORITY_COLORS[
                                task.priority as keyof typeof PRIORITY_COLORS
                              ] || "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {task.priority}
                          </Badge>
                        </div>
                      )}

                      <div className="flex items-center gap-1">
                        <FiClock className="w-3 h-3" />
                        <span>{formatDate(task.created_at)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
