"use client";

import { PAGE_TITLES } from "@/consts";
import { usePathname } from "next/navigation";
import { useEffect, useMemo } from "react";

interface TitleConfig {
  pathname: string;
  title: string;
}

interface UseBinCraftTitleOptions {
  defaultTitle?: string;
  titleTemplate?: string;
  customTitles?: TitleConfig[];
}

const DEFAULT_TITLE_CONFIGS: TitleConfig[] = [
  { pathname: "/all", title: "All Docs" },
  { pathname: "/tasks", title: "Tasks" },
  { pathname: "/calendar", title: "Calendar" },
  { pathname: "/templates", title: "My Templates" },
];

function getTitleFromPath(
  pathname: string, 
  customTitles: TitleConfig[] = []
): string {
  // Check PAGE_TITLES first
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }

  const customTitle = customTitles.find(config => 
    pathname.includes(config.pathname)
  );
  if (customTitle) {
    return customTitle.title;
  }

  const defaultTitle = DEFAULT_TITLE_CONFIGS.find(config => 
    pathname.includes(config.pathname)
  );
  if (defaultTitle) {
    return defaultTitle.title;
  }

  return "Bin Craft";
}

export function useBinCraftTitle(options: UseBinCraftTitleOptions = {}) {
  const {
    defaultTitle = "Bin Craft",
    titleTemplate = "%s | Bin Craft",
    customTitles = [],
  } = options;

  const pathname = usePathname();

  const title = useMemo(() => {
    const baseTitle = getTitleFromPath(pathname, customTitles);
    return baseTitle === "Bin Craft" ? defaultTitle : baseTitle;
  }, [pathname, customTitles, defaultTitle]);

  const fullTitle = useMemo(() => {
    return titleTemplate.replace("%s", title);
  }, [title, titleTemplate]);

  useEffect(() => {
    document.title = fullTitle;
  }, [fullTitle]);

  return {
    title,
    fullTitle,
    pathname,
  };
}
