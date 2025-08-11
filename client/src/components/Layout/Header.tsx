"use client";

import { InputField } from "@/components/ui/input-field";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useSidebar } from "@/context/SidebarContext";
import { ROUTES } from "@/lib/routes";
import { Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineViewSidebar } from "react-icons/md";
import { NotificationButton } from "./Presentational/NotificationButton";
import { SettingButton } from "./Presentational/SettingButton";

interface Props {
  workspaceSlug: string;
}

export default function Header({ workspaceSlug }: Props) {
  const { toggle } = useSidebar();

  return (
    workspaceSlug && (
      <header className="h-12 flex justify-between items-center mx-4">
        <div className="flex items-center gap-2">
          <Link href={ROUTES.WORKSPACE_ALL_DOCS(workspaceSlug)}>
            <Image
              src="/images/logo.png"
              alt="Bin Craft Logo"
              width={24}
              height={24}
            />
          </Link>
          <MdOutlineViewSidebar
            size={20}
            className="cursor-pointer"
            onClick={toggle}
          />
        </div>
        <div className="min-w-[480px] cursor-pointer">
          <InputField
            placeholder="Open"
            className="w-full h-8"
            popoverContent={
              <div className="p-4 text-sm text-muted-foreground"></div>
            }
            icon={<Search className="h-4 w-4" />}
          />
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <NotificationButton />
          <SettingButton />
        </div>
      </header>
    )
  );
}
