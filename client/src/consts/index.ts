import { ROUTES } from "@/lib/routes";
import { CiCalendar, CiCircleCheck } from "react-icons/ci";
import { FiFileText } from "react-icons/fi";
import { LuBookOpenText } from "react-icons/lu";
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
      icon: CiCircleCheck,
      label: "Tasks",
      href: ROUTES.WORKSPACE_TASKS(workspaceSlug),
    },
    {
      icon: CiCalendar,
      label: "Calendar",
      href: `/s/${workspaceSlug}/calendar`,
    },
    {
      icon: LuBookOpenText,
      label: "My Templates",
      href: `/s/${workspaceSlug}/templates`,
    },
  ];
  