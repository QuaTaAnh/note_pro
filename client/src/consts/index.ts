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

export const HIGHLIGHT_COLORS = [
  { name: "None", color: "transparent", value: null },
  { name: "Yellow", color: "#fef08a", value: "#fef08a" },
  { name: "Green", color: "#bbf7d0", value: "#bbf7d0" },
  { name: "Cyan", color: "#a7f3d0", value: "#a7f3d0" },
  { name: "Sky", color: "#7dd3fc", value: "#7dd3fc" },
  { name: "Blue", color: "#93c5fd", value: "#93c5fd" },
  { name: "Purple", color: "#c4b5fd", value: "#c4b5fd" },
  { name: "Pink", color: "#f9a8d4", value: "#f9a8d4" },
  { name: "Rose", color: "#fda4af", value: "#fda4af" },
  { name: "Orange", color: "#fed7aa", value: "#fed7aa" },
  { name: "Gray", color: "#d1d5db", value: "#d1d5db" },
  { name: "Dark Blue", color: "#3b82f6", value: "#3b82f6" },
  { name: "Dark Purple", color: "#8b5cf6", value: "#8b5cf6" },
  { name: "Dark Pink", color: "#ec4899", value: "#ec4899" },
  { name: "Dark Orange", color: "#f97316", value: "#f97316" },
  { name: "Brown", color: "#a3744a", value: "#a3744a" },
];
  