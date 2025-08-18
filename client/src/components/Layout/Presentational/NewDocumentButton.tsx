"use client";

import { useUserId } from "@/hooks/use-auth";
import { useParams, useRouter } from "next/navigation";
import { useCreateUntitledPageMutation } from "../graphql/__generated__/document.generated";
import { useWorkspace } from "@/hooks/use-workspace";
import { useState } from "react";
import { SidebarButton } from "./SidebarButton";
import { FiFilePlus } from "react-icons/fi";
import { ROUTES } from "@/lib/routes";

export default function NewDocumentButton() {
  const params = useParams();
  const router = useRouter();
  const userId = useUserId();
  const [createDocument] = useCreateUntitledPageMutation();
  const { workspace } = useWorkspace();
  const [isCreating, setIsCreating] = useState(false);
  const folderId = params.folderId as string | null;

  const handleClick = async () => {
    if (isCreating || !workspace?.id) return;

    try {
      setIsCreating(true);
      const res = await createDocument({
        variables: {
          input: {
            type: "page",
            workspace_id: workspace.id,
            user_id: userId || "",
            folder_id: folderId,
            content: {
              title: "Untitled Page",
            },
            position: 0,
          },
        },
      });

      const docId = res.data?.insert_blocks_one?.id;
      if (docId) {
        if (folderId) {
          router.push(
            ROUTES.WORKSPACE_DOCUMENT_FOLDER(workspace.id, folderId, docId)
          );
        } else {
          router.push(ROUTES.WORKSPACE_DOCUMENT(workspace.id, docId));
        }
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
