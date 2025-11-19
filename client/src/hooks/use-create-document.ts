"use client";

import { useCreateUntitledPageMutation } from "@/graphql/mutations/__generated__/document.generated";
import { useUserId } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { ROUTES } from "@/lib/routes";
import { BlockType } from "@/types/types";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface CreateDocumentOptions {
  folderId?: string | null;
}

export function useCreateDocument(options: CreateDocumentOptions = {}) {
  const { folderId } = options;
  const { workspace } = useWorkspace();
  const router = useRouter();
  const userId = useUserId();
  const [createDocument] = useCreateUntitledPageMutation();
  const [isCreating, setIsCreating] = useState(false);

  const createNewDocument = async () => {
    if (isCreating || !workspace?.id || !userId) return;

    try {
      setIsCreating(true);

      const res = await createDocument({
        variables: {
          input: {
            type: BlockType.PAGE,
            workspace_id: workspace.id,
            user_id: userId,
            folder_id: folderId || null,
            content: {
              title: "Untitled Page",
            },
            position: 0,
            parent_id: null,
            page_id: null,
          },
        },
      });

      const docId = res.data?.insert_blocks_one?.id;
      if (!docId) {
        throw new Error("Failed to create document");
      }

      await createDocument({
        variables: {
          input: {
            type: BlockType.PARAGRAPH,
            workspace_id: workspace.id,
            user_id: userId,
            folder_id: null,
            content: {
              text: "",
            },
            position: 0,
            parent_id: null,
            page_id: docId,
          },
        },
      });

      const route = folderId
        ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(workspace.id, folderId, docId)
        : ROUTES.WORKSPACE_DOCUMENT(workspace.id, docId);
      
      router.push(route);
    } catch (err) {
      console.error("Failed to create document:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createNewDocument,
    isCreating,
    canCreate: Boolean(workspace?.id && userId),
  };
}
