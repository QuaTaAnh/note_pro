"use client";

import { SearchInputField } from "@/components/search";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { HEADER_HEIGHT } from "@/consts";
import { useDocumentAccess } from "@/context/DocumentAccessContext";
import { useSidebar } from "@/context/SidebarContext";
import { ROUTES } from "@/lib/routes";
import Image from "next/image";
import Link from "next/link";
import { MdOutlineViewSidebar } from "react-icons/md";
import { NotificationButton } from "./components/NotificationButton";
import { RequestEditButton } from "./components/RequestEditButton";
import { SettingButton } from "./components/SettingButton";
import { ShareExportButton } from "./components/ShareExportButton";

interface Props {
  workspaceSlug: string;
  isEditorPage: boolean;
}

export default function Header({ workspaceSlug, isEditorPage }: Props) {
  const { toggle, toggleRight } = useSidebar();
  const { documentId } = useDocumentAccess();

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
        <div className="min-w-[480px]">
          <SearchInputField placeholder="Search..." />
        </div>
        <div className="flex items-center gap-2">
          {isEditorPage && documentId && (
            <>
              <RequestEditButton documentId={documentId} />
              <ShareExportButton documentId={documentId} />
            </>
          )}
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
