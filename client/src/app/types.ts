import { GetAllDocsQuery } from "@/graphql/queries/__generated__/document.generated";
import { GetFoldersQuery } from "@/graphql/queries/__generated__/folder.generated";

export type Document = GetAllDocsQuery["blocks"][0];

export type Folder = GetFoldersQuery["folders"][0];