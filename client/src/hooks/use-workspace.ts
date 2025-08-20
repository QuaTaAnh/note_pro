"use client";

import { useGetWorkspaceByUserIdQuery } from "@/graphql/queries/__generated__/workspace.generated";
import slugify from "slugify";
import { useAuth } from "@/hooks/use-auth";

export function useWorkspace() {
  const { userId, isLoading: authLoading } = useAuth();

  const { data, loading } = useGetWorkspaceByUserIdQuery({
    variables: { userId: userId! },
    skip: !userId,
    fetchPolicy: "cache-first",
  });

  const workspace = data?.workspaces?.[0];
  const workspaceSlug = workspace
  ? `${slugify(workspace.name ?? "", { strict: true })}--${workspace.id}`
  : null;

  return {
    workspace,
    workspaceSlug,
    loading: authLoading || loading,
    hasWorkspace: !!workspace,
  };
} 