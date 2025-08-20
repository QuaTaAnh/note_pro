"use client";

import { MENU_ITEMS, SIDEBAR_WIDTH } from "@/consts";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import NewDocumentButton from "./Presentational/NewDocumentButton";
import { SidebarButton } from "./Presentational/SidebarButton";
import { WorkspaceButton } from "./Presentational/WorkspaceButton";
import { FolderMenu } from "./Presentational/FolderMenu";
interface Props {
  workspaceSlug: string;
}

export default function Sidebar({ workspaceSlug }: Props) {
  const { isOpen } = useSidebar();

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out bg-background text-foreground fixed top-12 left-0 z-40 h-[calc(100vh-48px)]",
        isOpen ? "" : "w-0 overflow-hidden"
      )}
      style={{ width: isOpen ? SIDEBAR_WIDTH : 0 }}
    >
      <div className="flex h-full flex-col p-4 gap-2">
        <NewDocumentButton />
        <Separator />
        <WorkspaceButton />
        {/* Scrollable area starting from MENU_ITEMS */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col gap-2">
          {MENU_ITEMS(workspaceSlug).map((item) => (
            <SidebarButton
              key={item.href}
              icon={<item.icon className="w-4 h-4" />}
              label={item.label}
              href={item.href}
            />
          ))}
          <Separator />
          <FolderMenu />
        </div>
      </div>
    </aside>
  );
}
