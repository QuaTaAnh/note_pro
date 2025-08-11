"use client";

import { ROUTES } from "@/lib/routes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { AUTHENTICATED } from "@/consts";
import { useWorkspace } from "@/hooks/use-workspace";
import { PageLoading } from "@/components/ui/loading";

export default function Home() {
  const { status } = useSession();
  const { workspaceSlug, loading } = useWorkspace();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading" || loading) return;

    if (status !== AUTHENTICATED) {
      router.replace(ROUTES.LOGIN);
      return;
    }

    if (workspaceSlug) {
      router.replace(ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug));
    }
  }, [status, workspaceSlug, loading, router]);

  return <PageLoading />;
}
