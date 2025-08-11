"use client";

import { PAGE_TITLES } from "@/consts";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";


function getTitleFromPath(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];

  if (pathname.includes("/all")) return "All Docs";
  if (pathname.includes("/tasks")) return "Tasks";
  if (pathname.includes("/calendar")) return "Calendar";
  if (pathname.includes("/templates")) return "My Templates";

  return "Bin Craft";
}

export function useBinCraftTitle() {
  const pathname = usePathname();

  const title = useMemo(() => getTitleFromPath(pathname), [pathname]);

  useEffect(() => {
    document.title = `${title} | Bin Craft`;
  }, [title]);
}
