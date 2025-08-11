"use client";

import { useSession } from "next-auth/react";
import { useGetWorkspaceByUserIdQuery } from "@/components/Layout/graphql/__generated__/workspace.generated";
import { getUserIdFromToken } from "@/lib/utils";
import { useMemo } from "react";
import slugify from "slugify";

export function useWorkspace() {
  const { data: session } = useSession();
  
  const userId = useMemo(() => {
    if (!session?.hasuraToken) {
      return null;
    }
    return getUserIdFromToken(session.hasuraToken);
  }, [session?.hasuraToken]);

  const { data, loading } = useGetWorkspaceByUserIdQuery({
    variables: { userId: userId! },
    skip: !userId,
  });

  const workspace = data?.workspaces?.[0];
  const workspaceSlug = workspace
  ? `${slugify(workspace.name ?? "", { strict: true })}--${workspace.id}`
  : null;

  return {
    workspace,
    workspaceSlug,
    loading,
    hasWorkspace: !!workspace,
  };
} 