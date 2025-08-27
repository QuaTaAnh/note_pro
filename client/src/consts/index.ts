import { ROUTES } from "@/lib/routes";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
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
  [ROUTES.DEMO]: "UI Demo",
};

// Navigation menu items
export const MENU_ITEMS = (workspaceSlug: string) => [
  {
    icon: FiFileText,
    label: "All Docs",
    href: ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug),
  },
  {
    icon: AiOutlineCheckCircle,
    label: "Tasks",
    href: ROUTES.WORKSPACE_TASKS(workspaceSlug),
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

  