"use client";

import AuthGuard from "@/components/auth/AuthGuard";
import { PageLoading } from "@/components/ui/loading";
import { SidebarProvider, useSidebar } from "@/context/SidebarContext";
import { useWorkspace } from "@/hooks/use-workspace";
import { useBinCraftTitle } from "@/hooks/useBinCraftTitle";
import { ROUTES } from "@/lib/routes";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { HEADER_HEIGHT, SIDEBAR_WIDTH } from "@/consts";

function LayoutMain({ children }: { children: React.ReactNode }) {
  const { workspaceSlug, loading } = useWorkspace();
  const { isOpen } = useSidebar();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (!loading && workspaceSlug && pathname.startsWith("/s/")) {
      const currentSlug = pathname.split("/")[2];
      if (currentSlug && currentSlug !== workspaceSlug) {
        const newPath = pathname.replace(currentSlug, workspaceSlug);
        router.replace(newPath);
      }
    }
  }, [loading, workspaceSlug, pathname, router]);
  const editorPage = Boolean(pathname.startsWith("/editor/"));

  return pathname === ROUTES.LOGIN ? (
    <>{children}</>
  ) : (
    <AuthGuard>
      <div className="min-h-screen flex flex-col">
        {loading ? (
          <PageLoading />
        ) : (
          <>
            <Header workspaceSlug={workspaceSlug ?? ""} />
            <div className="flex flex-1 pt-[var(--header-height)]">
              {!editorPage && (
                <div
                  className={`transition-all duration-300 overflow-hidden`}
                  style={{
                    width: isOpen ? SIDEBAR_WIDTH : 0,
                  }}
                >
                  <Sidebar workspaceSlug={workspaceSlug ?? ""} />
                </div>
              )}

              <main
                className={`flex-1 transition-all duration-300 flex justify-center ${
                  editorPage ? "p-0" : "p-4"
                }`}
                style={{
                  paddingTop: HEADER_HEIGHT,
                }}
              >
                <div
                  className={`w-full ${
                    editorPage ? "max-w-full mt-1" : "max-w-7xl"
                  }`}
                >
                  {children}
                </div>
              </main>
            </div>
          </>
        )}
      </div>
    </AuthGuard>
  );
}

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  useBinCraftTitle();
  return (
    <SidebarProvider>
      <LayoutMain>{children}</LayoutMain>
    </SidebarProvider>
  );
}
