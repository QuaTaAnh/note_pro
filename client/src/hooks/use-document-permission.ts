"use client";

import { useParams } from "next/navigation";
import { useUserId } from "./use-auth";
import { useGetAccessRequestByDocumentQuery } from "@/graphql/queries/__generated__/access-request.generated";
import { useWorkspace } from "./use-workspace";
import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { useMemo } from "react";
import { AccessRequestStatus, BlockType, PermissionType } from "@/types/types";

export function useDocumentPermission(documentId: string) {
  const userId = useUserId();
  const { workspace } = useWorkspace();

  const { data: documentData } = useGetDocumentBlocksQuery({
    variables: { pageId: documentId },
    skip: !documentId,
    errorPolicy: "all",
  });

  const { data: accessRequestData } = useGetAccessRequestByDocumentQuery({
    variables: { 
      documentId: documentId || "",
      requesterId: userId || ""
    },
    skip: !documentId || !userId,
    pollInterval: 3000,
  });

  const permission = useMemo(() => {
    if (!documentData?.blocks || !userId) {
      return { canView: false, canEdit: false, permissionType: null };
    }

    const rootBlock = documentData.blocks.find(
      (block) => block.id === documentId && block.type === BlockType.PAGE
    );

    if (!rootBlock) {
      return { canView: false, canEdit: false, permissionType: null };
    }

    if (rootBlock.workspace_id === workspace?.id) {
      return { canView: true, canEdit: true, permissionType: PermissionType.OWNER };
    }

    const accessRequest = accessRequestData?.access_requests?.[0];
    if (accessRequest && accessRequest.status === AccessRequestStatus.APPROVED) {
      const canEdit = accessRequest.permission_type === PermissionType.WRITE;
      return { 
        canView: true, 
        canEdit, 
        permissionType: accessRequest.permission_type 
      };
    }

    return { canView: false, canEdit: false, permissionType: null };
  }, [documentData, userId, workspace, accessRequestData, documentId]);

  return permission;
} 