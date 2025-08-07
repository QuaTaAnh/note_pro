"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";
import { ROUTES } from "@/lib/routes";
import { PAGE_TITLES } from "@/consts";
import AuthGuard from "@/components/auth/AuthGuard";
import { SidebarProvider } from "@/context/SidebarContext";
import Sidebar from "./Sidebar";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  useEffect(() => {
    const title = PAGE_TITLES[pathname] || "Bin Craft";
    document.title = title;
  }, [pathname]);

  return pathname === ROUTES.LOGIN ? (
    <>{children}</>
  ) : (
    <AuthGuard>
      <SidebarProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-4">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </AuthGuard>
  );
}
