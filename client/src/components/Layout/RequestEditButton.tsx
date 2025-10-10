"use client";

import { Button } from "@/components/ui/button";
import { useCreateAccessRequestMutation } from "@/graphql/mutations/__generated__/access-request.generated";
import { useCreateNotificationMutation } from "@/graphql/mutations/__generated__/notification.generated";
import { useGetAccessRequestByDocumentQuery } from "@/graphql/queries/__generated__/access-request.generated";
import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { useUserId } from "@/hooks/use-auth";
import { showToast } from "@/lib/toast";
import { AccessRequestStatus, BlockType, PermissionType } from "@/types/types";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { FiEdit } from "react-icons/fi";

export function RequestEditButton({ documentId }: { documentId: string }) {
  const userId = useUserId();
  const { data: session } = useSession();
  const [isRequesting, setIsRequesting] = useState(false);

  const {
    data: accessRequestData,
    loading: accessRequestLoading,
    refetch,
  } = useGetAccessRequestByDocumentQuery({
    variables: {
      documentId: documentId || "",
      requesterId: userId || "",
    },
    skip: !documentId || !userId,
    fetchPolicy: "network-only",
  });

  const { data: documentData, loading: documentLoading } =
    useGetDocumentBlocksQuery({
      variables: { pageId: documentId || "" },
      skip: !documentId,
      errorPolicy: "all",
    });

  const [createAccessRequest] = useCreateAccessRequestMutation();
  const [createNotification] = useCreateNotificationMutation();

  const accessRequests = accessRequestData?.access_requests || [];

  const hasApprovedReadAccess = accessRequests.some(
    (req) =>
      req.status === AccessRequestStatus.APPROVED &&
      req.permission_type === PermissionType.READ
  );

  const hasWriteRequest = accessRequests.some(
    (req) =>
      req.permission_type === PermissionType.WRITE &&
      (req.status === AccessRequestStatus.PENDING ||
        req.status === AccessRequestStatus.APPROVED)
  );

  // Don't show button while loading data
  if (accessRequestLoading || documentLoading) {
    return null;
  }

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

    try {
      setIsRequesting(true);

      const accessRequestResult = await createAccessRequest({
        variables: {
          input: {
            document_id: documentId,
            requester_id: userId,
            owner_id: ownerId,
            message: `${session?.user?.email} requested edit access`,
            permission_type: PermissionType.WRITE,
            status: AccessRequestStatus.PENDING,
            updated_at: new Date().toISOString(),
          },
        },
      });

      const requestId =
        accessRequestResult.data?.insert_access_requests_one?.id;

      await createNotification({
        variables: {
          input: {
            user_id: ownerId,
            type: "access_request",
            title: "Edit access request",
            message: `${session?.user?.email} requested edit access`,
            data: {
              request_id: requestId,
              document_id: documentId,
              requester_id: userId,
              requester_email: session?.user?.email,
              permission_type: PermissionType.WRITE,
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
