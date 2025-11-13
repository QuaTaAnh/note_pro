"use client";

import { useCreateUntitledPageMutation } from "@/graphql/mutations/__generated__/document.generated";
import {
  GetAllDocsDocument,
  GetAllDocsQuery,
  GetAllDocsQueryVariables,
  GetDocumentBlocksDocument,
} from "@/graphql/queries/__generated__/document.generated";
import { useUserId } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { BlockType } from "@/types/types";
import { useApolloClient } from "@apollo/client";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import { SidebarButton } from "./SidebarButton";

export default function NewDocumentButton() {
  const params = useParams();
  const router = useRouter();
  const client = useApolloClient();
  const userId = useUserId();
  const [createDocument] = useCreateUntitledPageMutation();
  const { workspace } = useWorkspace();
  const [isCreating, setIsCreating] = useState(false);
  const folderId = params.folderId as string | null;

  const handleClick = async () => {
    if (isCreating || !workspace?.id) return;

    try {
      setIsCreating(true);
      const newDocumentId = crypto.randomUUID();
      const nowIso = new Date().toISOString();
      const baseContent = { title: "Untitled Page" };
      const workspaceId = workspace.id;

      const newBlockForEditor = {
        __typename: "blocks" as const,
        id: newDocumentId,
        content: baseContent,
        position: 0,
        parent_id: null,
        page_id: null,
        type: BlockType.PAGE,
        workspace_id: workspaceId,
        user_id: userId || null,
        created_at: nowIso,
        updated_at: nowIso,
        tasks: [],
      };

      client.writeQuery({
        query: GetDocumentBlocksDocument,
        variables: { pageId: newDocumentId },
        data: { blocks: [newBlockForEditor] },
      });

      let existingDocs: GetAllDocsQuery | null = null;
      try {
        existingDocs =
          client.readQuery<GetAllDocsQuery, GetAllDocsQueryVariables>({
            query: GetAllDocsDocument,
            variables: { workspaceId },
          }) || null;
      } catch {
        existingDocs = null;
      }

      const newDocListEntry = {
        __typename: "blocks" as const,
        id: newDocumentId,
        content: baseContent,
        created_at: nowIso,
        updated_at: nowIso,
        workspace_id: workspaceId,
        folder: null,
        sub_blocks: [],
      };

      client.writeQuery({
        query: GetAllDocsDocument,
        variables: { workspaceId },
        data: {
          blocks: [
            newDocListEntry,
            ...(existingDocs?.blocks.filter(
              (doc) => doc.id !== newDocumentId
            ) || []),
          ],
        },
      });

      const targetRoute = folderId
        ? `/editor/d/${workspaceId}/${folderId}/${newDocumentId}`
        : `/editor/d/${workspaceId}/${newDocumentId}`;

      router.push(targetRoute);

      const res = await createDocument({
        variables: {
          input: {
            id: newDocumentId,
            type: "page",
            workspace_id: workspaceId,
            user_id: userId || "",
            folder_id: folderId,
            content: baseContent,
            position: 0,
            parent_id: null,
            page_id: null,
          },
        },
        optimisticResponse: {
          insert_blocks_one: {
            __typename: "blocks",
            id: newDocumentId,
          },
        },
      });

      const docId = res.data?.insert_blocks_one?.id;
      if (!docId) {
        console.error("Failed to receive document id from mutation response");
      }
    } catch (err) {
      console.error("Failed to create document:", err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <SidebarButton
      icon={<FiFilePlus className="w-4 h-4" />}
      label="New Document"
      onClick={handleClick}
      disabled={!workspace?.id || isCreating}
    />
  );
}
