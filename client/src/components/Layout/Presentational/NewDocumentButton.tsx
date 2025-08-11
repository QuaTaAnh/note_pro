"use client";

import { Button } from "@/components/ui/button";
import { useUserId } from "@/hooks/use-auth";
import { useParams, useRouter } from "next/navigation";
import { useCreateUntitledPageMutation } from "../graphql/__generated__/document.generated";
import { useWorkspace } from "@/hooks/use-workspace";

export default function NewDocumentButton() {
  const params = useParams();
  const router = useRouter();
  const userId = useUserId();
  const [createDocument] = useCreateUntitledPageMutation();
  const { workspace } = useWorkspace();
  const folderId = params.folderId as string | null;

  const handleClick = async () => {
    try {
      const res = await createDocument({
        variables: {
          workspaceId: workspace?.id || "",
          userId: userId || "",
          folderId: folderId,
        },
      });
      const docId = res.data?.insert_blocks_one?.id;
      if (folderId) {
        router.push(`/editor/d/${workspace?.id}/${folderId}/${docId}`);
      } else {
        router.push(`/editor/d/${workspace?.id}/${docId}`);
      }
    } catch (err) {
      console.error("Failed to create document:", err);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      onClick={handleClick}
    >
      New Document
    </Button>
  );
}
