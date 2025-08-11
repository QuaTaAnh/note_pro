"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface Props {
  icon: React.ReactNode;
  label: string;
  href: string;
}

export function SidebarMenuItem({ icon, label, href }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-1 rounded-md px-2 py-1.5 text-xs transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground"
      )}
    >
      <div className="w-5 h-5 flex items-center justify-center">{icon}</div>
      <span>{label}</span>
    </Link>
  );
}
