"use client";

import { useGetDocumentBlocksQuery } from "@/graphql/queries/__generated__/document.generated";
import { useWorkspace } from "@/hooks/use-workspace";
import { useAuth } from "@/hooks/use-auth";
import { useMemo, useEffect } from "react";
import { Loading } from "../ui/loading";
import { RequestAccessView } from "./RequestAccessView";
import { BlockType } from "@/types/types";
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
  const { workspace } = useWorkspace();
  const { setHasAccess } = useDocumentAccess();

  const { data, loading, error } = useGetDocumentBlocksQuery({
    variables: { pageId: documentId },
    skip: !documentId || !isAuthenticated,
    errorPolicy: "all",
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

    return rootBlock.workspace_id === workspace.id;
  }, [data?.blocks, workspace?.id, documentId, isAuthenticated, error]);

  // Update access status in context
  useEffect(() => {
    setHasAccess(hasAccess);
  }, [hasAccess, setHasAccess]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loading />
      </div>
    );
  }

  if (!hasAccess || error) {
    return <RequestAccessView />;
  }

  return <>{children}</>;
}
