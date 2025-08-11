"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import { PageLoading } from "@/components/ui/loading";
import { SidebarProvider } from "@/context/SidebarContext";
import { useWorkspace } from "@/hooks/use-workspace";
import { useBinCraftTitle } from "@/hooks/useBinCraftTitle";
import { ROUTES } from "@/lib/routes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  useBinCraftTitle();
  const { workspaceSlug, loading } = useWorkspace();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && workspaceSlug) {
      const currentSlug = pathname.split("/")[2];
      if (currentSlug && currentSlug !== workspaceSlug) {
        const newPath = pathname.replace(currentSlug, workspaceSlug);
        router.replace(newPath);
      }
    }
  }, [loading, workspaceSlug, pathname, router]);

  return pathname === ROUTES.LOGIN ? (
    <>{children}</>
  ) : (
    <AuthGuard>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col">
          {loading ? (
            <PageLoading />
          ) : (
            <>
              <Header workspaceSlug={workspaceSlug ?? ""} />
              <div className="flex flex-1">
                <Sidebar workspaceSlug={workspaceSlug ?? ""} />
                <main className="flex-1 p-4">{children}</main>
              </div>
            </>
          )}
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
