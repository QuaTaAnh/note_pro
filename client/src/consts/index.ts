import { ROUTES } from "@/lib/routes";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { FiFileText } from "react-icons/fi";
import { LuBookOpenText, LuCalendarRange } from "react-icons/lu";
export const AUTHENTICATED = "authenticated";
export const UNAUTHENTICATED = "unauthenticated";
export const PAGE_TITLES: Record<string, string> = {
    [ROUTES.HOME]: "Home | Bin Craft",
    [ROUTES.LOGIN]: "Login | Bin Craft",
    [ROUTES.DEMO]: "UI Demo | Bin Craft",
  };

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
  