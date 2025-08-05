"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import { ROUTES } from "@/lib/routes";

export default function LayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return pathname === ROUTES.LOGIN ? (
    <>{children}</>
  ) : (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
    </div>
  );
}
