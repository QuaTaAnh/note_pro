import { FolderNode } from "@/lib/folder";
import { useState } from "react";
import { FiChevronRight, FiChevronDown } from "react-icons/fi";
import { iconMap } from "@/lib/icons";

export const FolderItem: React.FC<{ folder: FolderNode }> = ({ folder }) => {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = folder.children && folder.children.length > 0;

  const Icon =
    folder.icon && iconMap[folder.icon]
      ? iconMap[folder.icon]
      : iconMap["folder"];
  const iconColor = folder.color || "hsl(var(--color-picker-1))";

  return (
    <div>
      <div
        className="flex items-center gap-2 cursor-pointer hover:bg-muted/30 rounded-md p-1"
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {hasChildren ? (
          expanded ? (
            <FiChevronDown className="w-4 h-4" />
          ) : (
            <FiChevronRight className="w-4 h-4" />
          )
        ) : (
          <span className="w-4 h-4" />
        )}

        <Icon className="w-4 h-4" style={{ color: iconColor }} />
        <span className="text-sm">{folder.name}</span>
      </div>

      {expanded && hasChildren && (
        <div className="ml-5">
          {folder.children!.map((child) => (
            <FolderItem key={child.id} folder={child} />
          ))}
        </div>
      )}
    </div>
  );
};
