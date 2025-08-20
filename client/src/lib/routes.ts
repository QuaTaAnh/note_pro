export const ROUTES = {
  HOME: "/",
  DEMO: "/demo",
  LOGIN: "/login",
  WORKSPACE_ALL_DOCS: (workspaceSlug: string) => `/s/${workspaceSlug}/all`,
  WORKSPACE_TASKS: (workspaceSlug: string) => `/s/${workspaceSlug}/tasks`,
  WORKSPACE_CALENDAR: (workspaceSlug: string) => `/s/${workspaceSlug}/calendar`,
  WORKSPACE_TEMPLATES: (workspaceSlug: string) => `/s/${workspaceSlug}/templates`,
  WORKSPACE_DOCUMENT: (workspaceSlug: string, documentId: string) =>
    `/editor/d/${workspaceSlug}/${documentId}`,
  WORKSPACE_DOCUMENT_FOLDER: (workspaceSlug: string, folderId: string, documentId: string) =>
    `/editor/d/${workspaceSlug}/${folderId}/${documentId}`,
  WORKSPACE_FOLDER: (workspaceSlug: string, folderId: string) =>
    `/s/${workspaceSlug}/f/${folderId}`,
} as const;