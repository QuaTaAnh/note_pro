import { GetAllDocsQuery } from "@/graphql/queries/__generated__/document.generated";
import { GetFoldersQuery } from "@/graphql/queries/__generated__/folder.generated";
import { GetTasksQuery } from "@/graphql/queries/__generated__/task.generated";

export type Document = GetAllDocsQuery["blocks"][0];
export type Folder = GetFoldersQuery["folders"][0]; 
export type Task = GetTasksQuery["tasks"][0];