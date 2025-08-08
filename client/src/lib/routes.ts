export const ROUTES = {
  HOME: "/",
  DEMO: "/demo",
  LOGIN: "/login",
  WORKSPACE_ROOT: (workspaceSlug: string) => `/s/${workspaceSlug}`,
  WORKSPACE_ALL_DOCS: (workspaceSlug: string) => `/s/${workspaceSlug}/all`,
  WORKSPACE_TASKS: (workspaceSlug: string) => `/s/${workspaceSlug}/tasks`,
} as const;