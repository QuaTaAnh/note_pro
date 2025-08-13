import { GetAllDocsQuery } from "@/graphql/queries/__generated__/document.generated";

export type Document = GetAllDocsQuery["blocks"][0];