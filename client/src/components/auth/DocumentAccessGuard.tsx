"use client";

import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { useGetAccessRequestByDocumentQuery } from "@/graphql/queries/__generated__/access-request.generated";
import { useWorkspace } from "@/hooks/use-workspace";
import { useAuth, useUserId } from "@/hooks/use-auth";
import { useMemo, useEffect } from "react";
import { Loading } from "../ui/loading";
import { RequestAccessView } from "./RequestAccessView";
import { AccessRequestStatus, BlockType } from "@/types/types";
import { useDocumentAccess } from "@/context/DocumentAccessContext";

interface DocumentAccessGuardProps {
  documentId: string;
  children: React.ReactNode;
}

export function DocumentAccessGuard({
  documentId,
  children,
}: DocumentAccessGuardProps) {
  const { isAuthenticated } = useAuth();
  const userId = useUserId();
  const { workspace } = useWorkspace();
  const { setHasAccess } = useDocumentAccess();

  const { data, loading, error } = useGetDocumentBlocksQuery({
    variables: { pageId: documentId },
    skip: !documentId || !isAuthenticated,
    errorPolicy: "all",
  });

  const { data: accessRequestData, loading: accessRequestLoading } =
    useGetAccessRequestByDocumentQuery({
      variables: {
        documentId: documentId || "",
        requesterId: userId || "",
      },
      skip: !documentId || !userId,
      // Removed pollInterval - rely on cache and refetch when needed
      fetchPolicy: "cache-and-network",
    });

  const hasAccess = useMemo(() => {
    if (error) {
      return false;
    }

    if (!data?.blocks || !workspace?.id || !isAuthenticated) {
      return false;
    }

    const rootBlock = data.blocks.find(
      (block) => block.id === documentId && block.type === BlockType.PAGE
    );

    if (!rootBlock || !rootBlock.workspace_id) {
      return false;
    }

    if (rootBlock.workspace_id === workspace.id) {
      return true;
    }

    const accessRequest = accessRequestData?.access_requests?.[0];
    if (
      accessRequest &&
      accessRequest.status === AccessRequestStatus.APPROVED
    ) {
      return true;
    }

    return false;
  }, [
    data?.blocks,
    workspace?.id,
    documentId,
    isAuthenticated,
    error,
    accessRequestData,
  ]);

  useEffect(() => {
    setHasAccess(hasAccess);
  }, [hasAccess, setHasAccess]);

  if (loading || accessRequestLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!hasAccess || error) {
    return <RequestAccessView documentId={documentId} />;
  }

  return <>{children}</>;
}
