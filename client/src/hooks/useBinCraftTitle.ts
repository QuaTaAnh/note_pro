"use client";

import { PAGE_TITLES } from "@/lib/constants";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import find from "lodash/find";
import debounce from "lodash/debounce";

interface TitleConfig {
  pathname: string;
  title: string;
}

interface UseBinCraftTitleOptions {
  defaultTitle?: string;
  titleTemplate?: string;
  customTitles?: TitleConfig[];
  dynamicTitle?: string | null;
}

const DEFAULT_TITLE_CONFIGS: TitleConfig[] = [
  { pathname: "/all", title: "All Docs" },
  { pathname: "/tasks", title: "Tasks" },
  { pathname: "/calendar", title: "Calendar" },
];

function getTitleFromPath(
  pathname: string,
  customTitles: TitleConfig[] = [],
): string {
  if (PAGE_TITLES[pathname]) {
    return PAGE_TITLES[pathname];
  }

  const customTitle = find(customTitles, (config) =>
    pathname.includes(config.pathname),
  );
  if (customTitle) {
    return customTitle.title;
  }

  const defaultTitle = find(DEFAULT_TITLE_CONFIGS, (config) =>
    pathname.includes(config.pathname),
  );
  if (defaultTitle) {
    return defaultTitle.title;
  }

  return "Bin Craft";
}

export function useBinCraftTitle(options: UseBinCraftTitleOptions = {}) {
  const {
    defaultTitle = "Bin Craft",
    titleTemplate = "%s",
    customTitles = [],
    dynamicTitle = null,
  } = options;

  const pathname = usePathname();
  const currentTitleRef = useRef<string>("");

  const title = useMemo(() => {
    if (dynamicTitle) {
      return dynamicTitle;
    }

    const baseTitle = getTitleFromPath(pathname, customTitles);
    return baseTitle === "Bin Craft" ? defaultTitle : baseTitle;
  }, [pathname, customTitles, defaultTitle, dynamicTitle]);

  const fullTitle = useMemo(() => {
    return titleTemplate.replace("%s", title);
  }, [title, titleTemplate]);

  // Use lodash debounce for better performance
  const updateDocumentTitle = useMemo(
    () =>
      debounce((newTitle: string) => {
        if (
          typeof document !== "undefined" &&
          document.title !== newTitle &&
          currentTitleRef.current !== newTitle
        ) {
          document.title = newTitle;
          currentTitleRef.current = newTitle;
        }
      }, 150),
    [],
  );

  useEffect(() => {
    updateDocumentTitle(fullTitle);

    return () => {
      updateDocumentTitle.cancel();
    };
  }, [fullTitle, updateDocumentTitle]);

  return {
    title,
    fullTitle,
    pathname,
  };
}
