"use client";

import { NewTaskModal } from "@/components/Layout/components/NewTaskModal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/hooks/use-workspace";
import { ROUTES } from "@/lib/routes";
import { PlusIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { FiInbox } from "react-icons/fi";
import { HiOutlineClipboardList } from "react-icons/hi";
import { PiSunHorizonBold } from "react-icons/pi";
import { Setting } from "./Setting";
import { TaskSettingsProvider } from "@/context/TaskSettingsProvider";
import { useLoading } from "@/context/LoadingContext";

interface TasksLayoutProps {
  children: React.ReactNode;
}

export default function TasksLayout({ children }: TasksLayoutProps) {
  const { workspaceSlug } = useWorkspace();
  const router = useRouter();
  const pathname = usePathname();
  const { startLoading } = useLoading();

  const NAV_ITEMS = [
    {
      id: "inbox",
      label: "Inbox",
      icon: FiInbox,
      href: ROUTES.WORKSPACE_TASKS_INBOX(workspaceSlug || ""),
      active: pathname.includes("/inbox"),
    },
    {
      id: "today",
      label: "Today",
      icon: PiSunHorizonBold,
      href: ROUTES.WORKSPACE_TASKS_TODAY(workspaceSlug || ""),
      active: pathname.includes("/today"),
    },
    {
      id: "all",
      label: "All Tasks",
      icon: HiOutlineClipboardList,
      href: ROUTES.WORKSPACE_TASKS_ALL(workspaceSlug || ""),
      active: pathname.includes("/all"),
    },
  ];

  const navigateTo = (href: string) => {
    if (workspaceSlug) {
      startLoading();
      router.push(href);
    }
  };

  return (
    <TaskSettingsProvider>
      <div className="p-0 w-full h-full">
        <div className="flex flex-col items-start justify-start mx-auto w-full h-full min-h-0 max-w-screen-2xl gap-6">
          <div className="w-full pt-4 px-6 flex items-center justify-between">
            <div className="flex items-center gap-2 h-full">
              <NewTaskModal>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-8 h-8 rounded-full"
                >
                  <PlusIcon className="w-5 h-5" />
                </Button>
              </NewTaskModal>
              <Separator orientation="vertical" />
              <h1 className="text-xl font-medium">Tasks</h1>
            </div>
            <Setting />
          </div>

          <div className="w-full px-6">
            <div className="flex items-center gap-2">
              {NAV_ITEMS.map(({ id, label, icon: Icon, href, active }) => (
                <Button
                  key={id}
                  variant={active ? "default" : "outline"}
                  size="sm"
                  className="gap-2 text-xs rounded-xl"
                  onClick={() => navigateTo(href)}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Button>
              ))}
            </div>
          </div>

          <div className="flex-1 w-full px-6 overflow-hidden">{children}</div>
        </div>
      </div>
    </TaskSettingsProvider>
  );
}
