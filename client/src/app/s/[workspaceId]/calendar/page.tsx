"use client";

import { Calendar } from "@/components/calendar";
import { getPlainText } from "@/components/page/CardDocument";
import { PageLoading } from "@/components/ui/loading";
import { TASK_STATUS } from "@/consts";
import { useGetAllScheduledTasksQuery } from "@/graphql/queries/__generated__/task.generated";
import { useWorkspace } from "@/hooks/use-workspace";
import { SchedulerAppointment } from "@/types/app";
import { useMemo } from "react";

export default function CalendarPage() {
  const { workspace } = useWorkspace();

  const { loading, data } = useGetAllScheduledTasksQuery({
    variables: {
      workspaceId: workspace?.id || "",
    },
    skip: !workspace?.id,
    fetchPolicy: "cache-and-network",
  });

  const tasks = useMemo(() => data?.tasks || [], [data]);

  const appointments: SchedulerAppointment[] = useMemo(() => {
    return tasks.map((task) => {
      const scheduleDate = task.schedule_date
        ? new Date(task.schedule_date + "T00:00:00")
        : new Date();

      const endDate = new Date(scheduleDate);
      endDate.setHours(23, 59, 59);

      const taskTitle = task.block?.content?.text || "Untitled Task";
      const documentTitle = getPlainText(task.block?.page?.content?.title);

      const displayText = documentTitle
        ? `${taskTitle} (${documentTitle})`
        : taskTitle;

      return {
        text: displayText,
        startDate: scheduleDate,
        endDate: endDate,
        allDay: true,
        taskId: task.id,
        status: task.status || TASK_STATUS.TODO,
        priority: task.priority,
        deadlineDate: task.deadline_date,
      };
    });
  }, [tasks]);

  return loading && tasks.length === 0 ? (
    <PageLoading />
  ) : (
    <div className="p-0 w-full h-full">
      <div className="flex flex-col items-start justify-start mx-auto w-full h-full min-h-0 max-w-screen-2xl gap-6">
        <div className="w-full pt-4 px-6 flex items-center justify-between">
          <h1 className="text-xl font-medium">Calendar</h1>
        </div>
        <div className="h-[calc(100%-5rem)] w-full px-6">
          <Calendar appointments={appointments} />
        </div>
      </div>
    </div>
  );
}
