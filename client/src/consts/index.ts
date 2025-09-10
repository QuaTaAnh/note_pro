import { createElement } from "react";
import { ROUTES } from "@/lib/routes";
import { FolderColor, FolderHexColor } from "@/types/types";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import { LuBookOpenText, LuCalendarRange } from "react-icons/lu";
import { FiPlus } from "react-icons/fi";

// Authentication constants
export const AUTHENTICATED = "authenticated";
export const UNAUTHENTICATED = "unauthenticated";

// Layout constants
export const HEADER_HEIGHT = 48;
export const SIDEBAR_WIDTH = 288;

// API constants
export const LIMIT = 10;
export const DEFAULT_PAGE_SIZE = 20;

// Cache constants
export const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
export const STALE_TIME = 2 * 60 * 1000; // 2 minutes

// UI constants
export const DEBOUNCE_DELAY = 300;
export const TOAST_DURATION = 5000;

// Page titles
export const PAGE_TITLES: Record<string, string> = {
  [ROUTES.HOME]: "Home",
  [ROUTES.LOGIN]: "Login",
};

// Navigation menu items
export const MENU_ITEMS = (workspaceSlug: string, counts: { allDocs: number }) => [
  {
    icon: FiFileText,
    label: "All Docs",
    href: ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug),
    count: counts.allDocs,
  },
  {
    icon: AiOutlineCheckCircle,
    label: "Tasks",
    href: ROUTES.WORKSPACE_TASKS(workspaceSlug),
    action: createElement(FiPlus, { className: "w-3 h-3 cursor-pointer" }),
  },
  {
    icon: LuCalendarRange,
    label: "Calendar",
    href: ROUTES.WORKSPACE_CALENDAR(workspaceSlug),
  },
  {
    icon: LuBookOpenText,
    label: "My Templates",
    href: ROUTES.WORKSPACE_TEMPLATES(workspaceSlug),
  },
];

// File upload constants
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "text/plain",
];

// Validation constants
export const MIN_PASSWORD_LENGTH = 8;
export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

export const COLORS = [
  {
    name: "White",
    value: FolderColor.WHITE,
    hexColor: FolderHexColor.WHITE,
  },
  {
    name: "Blue",
    value: FolderColor.BLUE,
    hexColor: FolderHexColor.BLUE,
  },
  {
    name: "Green",
    value: FolderColor.GREEN,
    hexColor: FolderHexColor.GREEN,
  },
  {
    name: "Yellow",
    value: FolderColor.YELLOW,
    hexColor: FolderHexColor.YELLOW,
  },
  {
    name: "Red",
    value: FolderColor.RED,
    hexColor: FolderHexColor.RED,
  },
  {
    name: "Purple",
    value: FolderColor.PURPLE,
    hexColor: FolderHexColor.PURPLE,
  },
];
  