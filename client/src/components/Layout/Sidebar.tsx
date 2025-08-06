"use client";

import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";

export default function Sidebar() {
  const { isOpen } = useSidebar();

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out bg-background text-foreground",
        isOpen ? "w-72" : "w-0 overflow-hidden"
      )}
    >
      <div className="pl-2">
        <p className="text-lg font-semibold">Sidebar</p>
      </div>
    </aside>
  );
}
