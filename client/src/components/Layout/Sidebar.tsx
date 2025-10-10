"use client";

import { MENU_ITEMS, SIDEBAR_WIDTH, ModalType } from "@/consts";
import { useSidebar } from "@/context/SidebarContext";
import { cn } from "@/lib/utils";
import { Separator } from "../ui/separator";
import NewDocumentButton from "./Presentational/NewDocumentButton";
import { SidebarButton } from "./Presentational/SidebarButton";
import { WorkspaceButton } from "./Presentational/WorkspaceButton";
import { FolderMenu } from "./Presentational/FolderMenu";
import { usePathname } from "next/navigation";
import { useGetDocsCountQuery } from "@/graphql/queries/__generated__/document.generated";
import { NewTaskModal } from "./Presentational/NewTaskModal";
import { ROUTES } from "@/lib/routes";
import { IoShareOutline } from "react-icons/io5";
interface Props {
  workspaceSlug: string;
  workspaceId: string;
}

export default function Sidebar({ workspaceSlug, workspaceId }: Props) {
  const { isOpen } = useSidebar();
  const pathname = usePathname();

  const { data: docsCount, loading: docsCountLoading } = useGetDocsCountQuery({
    variables: { workspaceId },
    skip: !workspaceId,
  });

  const renderModalWrapper = (
    modalType: ModalType,
    action: React.ReactElement
  ) => {
    switch (modalType) {
      case ModalType.TASK:
        return <NewTaskModal>{action}</NewTaskModal>;
      default:
        return action;
    }
  };

  return (
    <aside
      className={cn(
        "transition-all duration-300 ease-in-out bg-background text-foreground fixed top-12 left-0 z-40 h-[calc(100vh-48px)]",
        isOpen ? "" : "w-0 overflow-hidden"
      )}
      style={{ width: isOpen ? SIDEBAR_WIDTH : 0 }}
    >
      <div className="flex h-full flex-col p-4 gap-2">
        <NewDocumentButton />
        <SidebarButton
          icon={<IoShareOutline className="w-4 h-4" />}
          label="Shared with me"
          href={ROUTES.SHARED_WITH_ME}
        />
        <Separator />
        <WorkspaceButton />
        {/* Scrollable area starting from MENU_ITEMS */}
        <div className="flex-1 min-h-0 overflow-y-auto overscroll-contain flex flex-col gap-2 group">
          {MENU_ITEMS(workspaceSlug, {
            allDocs: docsCountLoading
              ? undefined
              : docsCount?.blocks_aggregate?.aggregate?.count || 0,
          }).map((item) => {
            return (
              <SidebarButton
                key={item.href}
                icon={<item.icon className="w-4 h-4" />}
                label={item.label}
                href={item.href}
                isActive={pathname === item.href}
                count={item.count}
                action={
                  item.modalType && item.action
                    ? renderModalWrapper(item.modalType, item.action)
                    : item.action
                }
              />
            );
          })}
          <Separator />
          <FolderMenu />
        </div>
      </div>
    </aside>
  );
}
