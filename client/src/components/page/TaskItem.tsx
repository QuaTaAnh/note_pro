"use client";

import React from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { FiMoreHorizontal } from "react-icons/fi";
import { Button } from "../ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface TaskItemProps {
  id: string;
  title: string;
  completed?: boolean;
  scheduleDate?: string;
  dueDate?: string;
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
  dueDate,
  onToggleComplete,
  onMoreClick,
  className,
  variant = "default",
}: TaskItemProps) => {
  const getDateDisplay = () => {
    const targetDate = scheduleDate || dueDate;
    if (!targetDate) return null;

    try {
      const date = new Date(targetDate);
      const today = new Date();
      const tomorrow = new Date();
      tomorrow.setDate(today.getDate() + 1);

      today.setHours(0, 0, 0, 0);
      tomorrow.setHours(0, 0, 0, 0);
      date.setHours(0, 0, 0, 0);

      if (date.getTime() === today.getTime()) {
        return "Today";
      } else if (date.getTime() === tomorrow.getTime()) {
        return "Tomorrow";
      } else {
        return format(date, "MMM d");
      }
    } catch (error) {
      return null;
    }
  };

  const dateDisplay = getDateDisplay();

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

      {/* Task content */}
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
          {dateDisplay && variant === "compact" && (
            <span className="text-xs text-muted-foreground">{dateDisplay}</span>
          )}
        </div>
        {dateDisplay && variant === "default" && (
          <div className="text-xs text-muted-foreground mt-0.5">
            {scheduleDate ? "Scheduled for " : "Due "}
            {dateDisplay}
          </div>
        )}
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
