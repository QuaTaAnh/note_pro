"use client";

import { Button } from "@/components/ui/button";
import { useUserId } from "@/hooks/use-auth";
import { useParams } from "next/navigation";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";
import { useGetAccessRequestByDocumentQuery } from "@/graphql/queries/__generated__/access-request.generated";
import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { useCreateAccessRequestMutation } from "@/graphql/mutations/__generated__/access-request.generated";
import { useCreateNotificationMutation } from "@/graphql/mutations/__generated__/notification.generated";
import { useSession } from "next-auth/react";
import { showToast } from "@/lib/toast";
import { BlockType } from "@/types/types";

export function RequestEditButton() {
  const userId = useUserId();
  const { data: session } = useSession();
  const params = useParams();
  const [isRequesting, setIsRequesting] = useState(false);

  // Get document ID from URL params
  const documentId = params.params?.[params.params.length - 1] as string;

  // Check current access request
  const { data: accessRequestData, refetch } =
    useGetAccessRequestByDocumentQuery({
      variables: {
        documentId: documentId || "",
        requesterId: userId || "",
      },
      skip: !documentId || !userId,
    });

  // Get document data to get owner
  const { data: documentData } = useGetDocumentBlocksQuery({
    variables: { pageId: documentId || "" },
    skip: !documentId,
    errorPolicy: "all",
  });

  const [createAccessRequest] = useCreateAccessRequestMutation();
  const [createNotification] = useCreateNotificationMutation();

  const existingRequest = accessRequestData?.access_requests?.[0];

  // Only show button if user has READ permission but NOT WRITE
  const hasReadPermission =
    existingRequest?.status === "approved" &&
    existingRequest?.permission_type === "read";
  const hasWriteRequest = existingRequest?.permission_type === "write";

  if (!hasReadPermission || hasWriteRequest) {
    return null;
  }

  const handleRequestEdit = async () => {
    if (!userId || !documentData?.blocks || isRequesting) return;

    const rootBlock = documentData.blocks.find(
      (block) => block.id === documentId && block.type === BlockType.PAGE
    );

    if (!rootBlock || !rootBlock.user_id) {
      showToast.error("Cannot determine document owner");
      return;
    }

    const ownerId = rootBlock.user_id;
    const documentTitle =
      (rootBlock.content as { title?: string })?.title || "Untitled";

    try {
      setIsRequesting(true);

      // Create write access request
      const accessRequestResult = await createAccessRequest({
        variables: {
          input: {
            document_id: documentId,
            requester_id: userId,
            owner_id: ownerId,
            message: `${session?.user?.email} requested edit access to "${documentTitle}"`,
            permission_type: "write",
          },
        },
      });

      const requestId =
        accessRequestResult.data?.insert_access_requests_one?.id;

      // Create notification for owner
      await createNotification({
        variables: {
          input: {
            user_id: ownerId,
            type: "access_request",
            title: "Edit access request",
            message: `${session?.user?.email} requested edit access to "${documentTitle}"`,
            data: {
              request_id: requestId,
              document_id: documentId,
              requester_id: userId,
              requester_email: session?.user?.email,
              document_title: documentTitle,
              permission_type: "write",
            },
          },
        },
      });

      showToast.success("Edit access request sent successfully");
      refetch();
    } catch (error: any) {
      console.error("Failed to request edit access:", error);
      if (error?.message?.includes("Uniqueness violation")) {
        showToast.error("You have already requested edit access");
      } else {
        showToast.error("Failed to send edit access request");
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="gap-2"
      onClick={handleRequestEdit}
      disabled={isRequesting}
    >
      <FiEdit className="h-4 w-4" />
      {isRequesting ? "Requesting..." : "Request Edit Access"}
    </Button>
  );
}
