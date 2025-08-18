"use client";

import { InputField } from "@/components/ui/input-field";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HEADER_HEIGHT } from "@/consts";
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
  isEditorPage: boolean;
}

export default function Header({ workspaceSlug, isEditorPage }: Props) {
  const { toggle, toggleRight } = useSidebar();

  return (
    workspaceSlug && (
      <header
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center mx-4 bg-background"
        style={{ height: HEADER_HEIGHT }}
      >
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
          {isEditorPage && (
            <MdOutlineViewSidebar
              size={20}
              className="cursor-pointer"
              onClick={toggleRight}
            />
          )}
        </div>
      </header>
    )
  );
}
