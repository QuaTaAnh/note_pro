"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Header from "./Header";
import { ROUTES } from "@/lib/routes";
import { PAGE_TITLES } from "@/consts";

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
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
