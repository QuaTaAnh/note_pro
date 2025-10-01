import { GetAllDocsQuery } from "@/graphql/queries/__generated__/document.generated";
import { GetFoldersQuery } from "@/graphql/queries/__generated__/folder.generated";
import { GetNotificationsQuery } from "@/graphql/queries/__generated__/notification.generated";
import { GetTasksQuery } from "@/graphql/queries/__generated__/task.generated";

export type Document = GetAllDocsQuery["blocks"][0];
export type Folder = GetFoldersQuery["folders"][0]; 
export type Task = GetTasksQuery["tasks"][0];
export type Notification = GetNotificationsQuery["notifications"][0];