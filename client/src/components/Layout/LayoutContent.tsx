"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";
import { ROUTES } from "@/lib/routes";
import { PAGE_TITLES } from "@/consts";
import AuthGuard from "@/components/auth/AuthGuard";
import { SidebarProvider } from "@/context/SidebarContext";
import Sidebar from "./Sidebar";
import { useWorkspace } from "@/hooks/use-workspace";
import { PageLoading } from "@/components/ui/loading";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
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

  useEffect(() => {
    const title = PAGE_TITLES[pathname] || "Bin Craft";
    document.title = title;
  }, [pathname]);

  if (pathname === ROUTES.LOGIN) {
    return <>{children}</>;
  }

  return (
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
