"use client";

import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
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
        <WorkspaceButton workspaceSlug={workspaceSlug} />
      </div>
    </aside>
  );
}
