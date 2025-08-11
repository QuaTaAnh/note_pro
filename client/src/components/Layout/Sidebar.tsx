"use client";

import { MENU_ITEMS } from "@/consts";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import NewDocumentButton from "./Presentational/NewDocumentButton";
import { SidebarMenuItem } from "./Presentational/SidebarMenuItem";
import { WorkspaceButton } from "./Presentational/WorkspaceButton";
interface Props {
  workspaceSlug: string;
}

export default function Sidebar({ workspaceSlug }: Props) {
  const { isOpen } = useSidebar();

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out bg-background text-foreground",
        isOpen ? "w-72" : "w-0 overflow-hidden"
      )}
    >
      <div className="flex flex-col justify-center p-4 gap-2">
        <NewDocumentButton />
        <Separator />
        <WorkspaceButton />

        {MENU_ITEMS(workspaceSlug).map((item) => (
          <SidebarMenuItem
            key={item.href}
            icon={<item.icon className="w-4 h-4" />}
            label={item.label}
            href={item.href}
          />
        ))}
      </div>
    </aside>
  );
}
