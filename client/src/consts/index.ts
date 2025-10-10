import { ROUTES } from "@/lib/routes";
import { HexColor } from "@/types/types";
import { createElement } from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FiFileText, FiPlus } from "react-icons/fi";
import { LuBookOpenText, LuCalendarRange } from "react-icons/lu";

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

// Modal types for sidebar actions
export enum ModalType {
  TASK = "task",
  DOCUMENT = "document", 
  FOLDER = "folder"
}

// Navigation menu items
export const MENU_ITEMS = (workspaceSlug: string, counts: { allDocs: number | undefined }) => [
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
    modalType: ModalType.TASK,
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

const COLORS = [{ name: "Yellow", color: HexColor.YELLOW, value: HexColor.YELLOW },
  { name: "Green", color: HexColor.GREEN, value: HexColor.GREEN },
  { name: "Sky", color: HexColor.SKY, value: HexColor.SKY },
  { name: "Blue", color: HexColor.BLUE, value: HexColor.BLUE },
  { name: "Purple", color: HexColor.PURPLE, value: HexColor.PURPLE },
  { name: "Pink", color: HexColor.PINK, value: HexColor.PINK },
  { name: "Rose", color: HexColor.ROSE, value: HexColor.ROSE },
  { name: "Orange", color: HexColor.ORANGE, value: HexColor.ORANGE },
  { name: "Gray", color: HexColor.GRAY, value: HexColor.GRAY },
  { name: "Dark Blue", color: HexColor.DARK_BLUE, value:  HexColor.DARK_BLUE },
  { name: "Dark Purple", color: HexColor.DARK_PURPLE, value: HexColor.DARK_PURPLE },
  { name: "Dark Pink", color: HexColor.DARK_PINK, value: HexColor.DARK_PINK },
  { name: "Dark Orange", color: HexColor.DARK_ORANGE, value:  HexColor.DARK_ORANGE },
  { name: "Brown", color: HexColor.BROWN, value: HexColor.BROWN }
]

export const FOLDER_COLORS = [
  { name: "White", color: HexColor.WHITE, value: HexColor.WHITE },
  ...COLORS
]

export const HIGHLIGHT_COLORS = [
  { name: "None", color: HexColor.TRANSPARENT, value: null },
  ...COLORS
];

export const TASK_STATUS = {
  TODO: "todo",
  COMPLETED: "completed",
};
  