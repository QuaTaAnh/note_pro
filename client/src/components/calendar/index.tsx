import dynamic from "next/dynamic";
import React, { useMemo } from "react";
import { SchedulerAppointment } from "@/types/app";
import { DEFAULT_CURRENT_VIEW, VIEWS } from "./defaults";

// Dynamically import Scheduler to avoid SSR issues
const Scheduler = dynamic(
  () => import("devextreme-react/scheduler").then((mod) => mod.Scheduler),
  { ssr: false }
);

interface Props {
  appointments: SchedulerAppointment[];
}

export const Calendar = ({ appointments }: Props) => {
  const currentDate = useMemo(() => new Date(), []);

  return (
    <Scheduler
      dataSource={appointments}
      defaultCurrentView={DEFAULT_CURRENT_VIEW}
      defaultCurrentDate={currentDate}
      height="100%"
      startDayHour={0}
      endDayHour={24}
      showAllDayPanel={true}
      editing={false}
      views={VIEWS}
    />
  );
};
