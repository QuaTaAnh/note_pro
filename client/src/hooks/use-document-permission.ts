"use client";

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
    // Removed pollInterval - rely on cache shared with DocumentAccessGuard
    fetchPolicy: "cache-first",
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

    const accessRequests = accessRequestData?.access_requests || [];
    
    // Find approved request
    const approvedRequest = accessRequests.find(
      (req) => req.status === AccessRequestStatus.APPROVED
    );
    
    // Check if user has pending write request (upgrading from read)
    const hasPendingWriteRequest = accessRequests.some(
      (req) => 
        req.status === AccessRequestStatus.PENDING && 
        req.permission_type === PermissionType.WRITE
    );
    
    if (approvedRequest) {
      const canEdit = approvedRequest.permission_type === PermissionType.WRITE;
      return { 
        canView: true, 
        canEdit, 
        permissionType: approvedRequest.permission_type 
      };
    }
    
    // If user has pending write request, they can view (but not edit)
    // This means they're upgrading from approved read to write
    if (hasPendingWriteRequest) {
      return {
        canView: true,
        canEdit: false,
        permissionType: PermissionType.READ
      };
    }

    return { canView: false, canEdit: false, permissionType: null };
  }, [documentData, userId, workspace, accessRequestData, documentId]);

  return permission;
} 