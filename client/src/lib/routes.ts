export const ROUTES = {
  HOME: "/",
  DEMO: "/demo",
  LOGIN: "/login",
  WORKSPACE_ALL_DOCS: (workspaceSlug: string) => `/s/${workspaceSlug}/all`,
  WORKSPACE_TASKS: (workspaceSlug: string) => `/s/${workspaceSlug}/tasks`,
  WORKSPACE_CALENDAR: (workspaceSlug: string) => `/s/${workspaceSlug}/calendar`,
  WORKSPACE_TEMPLATES: (workspaceSlug: string) => `/s/${workspaceSlug}/templates`,
} as const;