"use client";

import { useLogout } from "@/hooks";
import { useBinCraftTitle } from "@/hooks/use-bin-craft-title";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";
import { FiLock, FiClock, FiXCircle } from "react-icons/fi";
import { Button } from "../ui/button";
import { useUserId } from "@/hooks/use-auth";
import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { useGetAccessRequestByDocumentQuery } from "@/graphql/queries/__generated__/access-request.generated";
import { useCreateAccessRequestMutation } from "@/graphql/mutations/__generated__/access-request.generated";
import { useCreateNotificationMutation } from "@/graphql/mutations/__generated__/notification.generated";
import { useState } from "react";
import { showToast } from "@/lib/toast";
import { BlockType } from "@/types/types";

interface RequestAccessViewProps {
  documentId: string;
}

export function RequestAccessView({ documentId }: RequestAccessViewProps) {
  const { logout, isLoggingOut } = useLogout();
  const { data: session } = useSession();
  const userId = useUserId();
  const [isRequesting, setIsRequesting] = useState(false);

  const { data: documentData } = useGetDocumentBlocksQuery({
    variables: { pageId: documentId },
    errorPolicy: "all",
  });

  const { data: accessRequestData, refetch } =
    useGetAccessRequestByDocumentQuery({
      variables: {
        documentId: documentId || "",
        requesterId: userId || "",
      },
      skip: !documentId || !userId,
      // Removed pollInterval - will refetch after request is sent
      fetchPolicy: "cache-and-network",
    });

  const [createAccessRequest] = useCreateAccessRequestMutation();
  const [createNotification] = useCreateNotificationMutation();

  useBinCraftTitle({
    dynamicTitle: "Bin Craft Document",
  });

  const existingRequest = accessRequestData?.access_requests?.[0];
  const requestStatus = existingRequest?.status;

  const handleRequestAccess = async (
    permissionType: "read" | "write" = "read"
  ) => {
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

      const accessRequestResult = await createAccessRequest({
        variables: {
          input: {
            document_id: documentId,
            requester_id: userId,
            owner_id: ownerId,
            message: `${session?.user?.email} requested ${permissionType} access to "${documentTitle}"`,
            permission_type: permissionType,
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
            title: "New access request",
            message: `${session?.user?.email} requested access to "${documentTitle}"`,
            data: {
              request_id: requestId,
              document_id: documentId,
              requester_id: userId,
              requester_email: session?.user?.email,
              document_title: documentTitle,
            },
          },
        },
      });

      showToast.success("Access request sent successfully");
      // Refetch to update UI with new request status
      await refetch();
    } catch (error: any) {
      if (error?.message?.includes("Uniqueness violation")) {
        showToast.error("You have already requested access to this document");
      } else {
        showToast.error("Failed to send access request");
      }
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="flex justify-center">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${
              requestStatus === "pending"
                ? "bg-yellow-100 dark:bg-yellow-900/20"
                : requestStatus === "rejected"
                ? "bg-red-100 dark:bg-red-900/20"
                : "bg-gray-100 dark:bg-gray-800"
            }`}
          >
            {requestStatus === "pending" ? (
              <FiClock className="w-8 h-8 text-yellow-600 dark:text-yellow-400" />
            ) : requestStatus === "rejected" ? (
              <FiXCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            ) : (
              <FiLock className="w-8 h-8 text-gray-400" />
            )}
          </div>
        </div>

        <h1 className="text-xl font-medium text-foreground">
          {requestStatus === "pending"
            ? "Access request pending"
            : requestStatus === "rejected"
            ? "Access request denied"
            : "Request access to this document"}
        </h1>

        <p className="text-muted-foreground">
          {requestStatus === "pending"
            ? "Your request is waiting for approval. You'll be notified once it's reviewed."
            : requestStatus === "rejected"
            ? "Your access request was denied by the document owner."
            : "You can view this document once your request is approved."}
        </p>

        {!requestStatus && (
          <Button
            variant="default"
            size="sm"
            className="gap-2 text-sm rounded-xl w-full"
            onClick={() => handleRequestAccess("read")}
            disabled={isRequesting}
          >
            <FiLock />
            {isRequesting ? "Sending request..." : "Request Access"}
          </Button>
        )}

        {requestStatus === "pending" && (
          <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
              <FiClock className="w-5 h-5" />
              <p className="text-sm font-medium">Waiting for approval...</p>
            </div>
          </div>
        )}

        {requestStatus === "rejected" && (
          <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
              <FiXCircle className="w-5 h-5" />
              <p className="text-sm font-medium">Request was denied</p>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500 dark:text-gray-400 space-y-2">
          <p>
            You are logged in as{" "}
            <span className="font-medium">{session?.user?.email}</span>
          </p>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-sm rounded-xl"
            onClick={logout}
            disabled={isLoggingOut}
          >
            <LogOut />
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
}
