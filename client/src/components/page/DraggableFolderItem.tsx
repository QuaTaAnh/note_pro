import { FolderNode } from "@/lib/folder";
import { iconMap } from "@/lib/icons";
import { ROUTES } from "@/lib/routes";
import { FolderColor } from "@/types/types";
import { useState } from "react";
import {
  FiChevronDown,
  FiChevronRight,
  FiMoreHorizontal,
} from "react-icons/fi";
import { SidebarButton } from "../Layout/Presentational/SidebarButton";
import { Button } from "../ui/button";
import { Draggable } from "../ui/draggable";

export const DraggableFolderItem: React.FC<{
  folder: FolderNode;
  workspaceSlug: string | null;
  isDragOver?: boolean;
  dragPosition?: "before" | "after" | "inside" | null;
}> = ({ folder, workspaceSlug, isDragOver = false, dragPosition = null }) => {
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
      <Draggable
        id={folder.id}
        data={{
          type: "folder",
          folder,
        }}
        dropId={`drop-${folder.id}`}
        dropData={{
          type: "folder-drop",
          folderId: folder.id,
        }}
        isDragOver={isDragOver}
        dragPosition={dragPosition}
        className="flex items-center rounded-md group hover:bg-folder-hover"
      >
        {hasChildren ? (
          <Button
            variant="ghost"
            size="icon"
            className="w-5 h-5 flex-shrink-0"
            onClick={handleMoreClick}
          >
            {expanded ? (
              <FiChevronDown className="w-4 h-4" />
            ) : (
              <FiChevronRight className="w-4 h-4" />
            )}
          </Button>
        ) : (
          <span className="w-5 h-5 flex-shrink-0" />
        )}

        <div className="flex-1 min-w-0">
          <SidebarButton
            label={folder.name}
            icon={
              <Icon
                className="w-4 h-4 flex-shrink-0"
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
            className="transition-colors duration-200"
          />
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <FiMoreHorizontal className="w-3 h-3" />
        </Button>
      </Draggable>

      {expanded && hasChildren && (
        <div className="ml-5 space-y-1">
          {folder.children!.map((child) => (
            <DraggableFolderItem
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
