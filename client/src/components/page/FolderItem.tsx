import { FolderNode } from "@/lib/folder";
import { iconMap } from "@/lib/icons";
import { ROUTES } from "@/lib/routes";
import { FolderColor } from "@/types/types";
import { useState } from "react";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { SidebarButton } from "../Layout/Presentational/SidebarButton";
import { Button } from "../ui/button";

export const FolderItem: React.FC<{
  folder: FolderNode;
  workspaceSlug: string | null;
}> = ({ folder, workspaceSlug }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;

  const Icon =
    folder.icon && iconMap[folder.icon]
      ? iconMap[folder.icon]
      : iconMap["folder"];

  const handleMoreClick = () => {
    if (hasChildren) {
      setExpanded(!expanded);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center">
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className="w-5 h-5"
            onClick={handleMoreClick}
          >
            {expanded ? (
              <FiChevronDown className="w-4 h-4" />
            ) : (
              <FiChevronRight className="w-4 h-4" />
            )}
          </Button>
        ) : (
          <span className="w-4 h-4" />
        )}

        <SidebarButton
          className="min-w-0"
          label={folder.name}
          icon={
            <Icon
              className="w-4 h-4"
              style={{
                color: folder.color,
                filter:
                  folder.color === FolderColor.WHITE
                    ? "drop-shadow(0 0 1px rgba(0,0,0,0.9))"
                    : "none",
              }}
            />
          }
          href={
            workspaceSlug
              ? ROUTES.WORKSPACE_FOLDER(workspaceSlug, folder.id)
              : undefined
          }
        />
      </div>
      {expanded && hasChildren && (
        <div className="ml-5">
          {folder.children!.map((child) => (
            <FolderItem
              key={child.id}
              folder={child}
              workspaceSlug={workspaceSlug}
            />
          ))}
        </div>
      )}
    </div>
  );
};
