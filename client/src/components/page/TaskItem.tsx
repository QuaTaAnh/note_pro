"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { FiMoreHorizontal } from "react-icons/fi";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskItemProps {
  id: string;
  title: string;
  completed?: boolean;
  scheduleDate?: string;
  deadlineDate?: string;
  onToggleComplete?: (id: string, completed: boolean) => void;
  onMoreClick?: (id: string) => void;
  className?: string;
  variant?: "default" | "compact";
}

export const TaskItem = ({
  id,
  title,
  completed = false,
  scheduleDate,
  deadlineDate,
  onToggleComplete,
  onMoreClick,
  className,
  variant = "default",
}: TaskItemProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md group transition-colors",
        variant === "compact" ? "px-2 py-1.5" : "px-3 py-2",
        className
      )}
    >
      <Checkbox
        checked={completed}
        onCheckedChange={(checked) => onToggleComplete?.(id, !!checked)}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div
            className={cn(
              variant === "compact" ? "text-xs" : "text-sm",
              "font-medium truncate",
              completed && "line-through text-muted-foreground"
            )}
          >
            {title}
          </div>
        </div>
      </div>

      {onMoreClick && (
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onMoreClick(id)}
        >
          <FiMoreHorizontal className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
};
