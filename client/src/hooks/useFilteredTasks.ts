"use client";

import { useTaskSettings } from "@/contexts/TaskSettingsProvider";
import { Task } from "@/types/app";
import { useMemo } from "react";
import partition from "lodash/partition";

export interface FilteredTasksResult {
  filteredTasks: Task[];
  scheduledTasks: Task[];
  unscheduledTasks: Task[];
}

export function useFilteredTasks(tasks: Task[] = []): FilteredTasksResult {
  const { settings } = useTaskSettings();

  const result = useMemo(() => {
    const [scheduledTasks, unscheduledTasks] = partition(
      tasks,
      (task) => task.schedule_date && task.schedule_date.trim() !== "",
    );

    let filteredTasks = tasks;

    if (!settings.showScheduledTasks) {
      filteredTasks = unscheduledTasks;
    }

    return {
      filteredTasks,
      scheduledTasks,
      unscheduledTasks,
    };
  }, [tasks, settings.showScheduledTasks]);

  return result;
}

export function taskToDisplayFormat(task: Task) {
  const title = task.block?.content?.text || task.block?.content?.title;

  return {
    id: task.id,
    title,
    completed: task.status === "completed",
    scheduleDate: task.schedule_date || undefined,
    deadlineDate: task.deadline_date || undefined,
  };
}
