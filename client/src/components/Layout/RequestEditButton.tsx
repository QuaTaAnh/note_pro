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
      // Use network-only to always get fresh data
      fetchPolicy: "network-only",
    });

  // Get document data to get owner
  const { data: documentData } = useGetDocumentBlocksQuery({
    variables: { pageId: documentId || "" },
    skip: !documentId,
    errorPolicy: "all",
  });

  const [createAccessRequest] = useCreateAccessRequestMutation();
  const [createNotification] = useCreateNotificationMutation();

  const accessRequests = accessRequestData?.access_requests || [];

  // Check if there's an approved read request
  const hasApprovedReadAccess = accessRequests.some(
    (req) => req.status === "approved" && req.permission_type === "read"
  );

  // Check if there's already a write request (pending or approved)
  const hasWriteRequest = accessRequests.some(
    (req) =>
      req.permission_type === "write" &&
      (req.status === "pending" || req.status === "approved")
  );

  // Only show button if user has approved READ permission but no pending/approved WRITE request
  if (!hasApprovedReadAccess || hasWriteRequest) {
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

      // Create write access request (or update existing read request to write)
      const accessRequestResult = await createAccessRequest({
        variables: {
          input: {
            document_id: documentId,
            requester_id: userId,
            owner_id: ownerId,
            message: `${session?.user?.email} requested edit access to "${documentTitle}"`,
            permission_type: "write",
            status: "pending", // Reset to pending when upgrading from read to write
            updated_at: new Date().toISOString(),
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
    } catch (error) {
      console.error("Failed to request edit access:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage.includes("Uniqueness violation")) {
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
