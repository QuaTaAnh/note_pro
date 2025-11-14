import React from "react";
import { SearchSectionHeader } from "./SearchSectionHeader";
import { getPlainText } from "../page/CardDocument";
import { SearchItem } from "./SearchItem";
import { SearchItemType } from "@/types/app";

interface Props {
  title: string;
  items: any[];
  type: SearchItemType;
  workspaceId?: string;
  onResultClick: () => void;
  renderSubtitle: (item: any) => string;
  getWorkspaceId?: (item: any) => string;
}

export const SearchSection = ({
  title,
  items,
  type,
  workspaceId,
  onResultClick,
  renderSubtitle,
  getWorkspaceId,
}: Props) => {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="mb-2">
      <SearchSectionHeader title={title} count={items.length} />
      {items.map((item) => {
        let href = "";
        let itemTitle = "";
        let subtitle = "";

        // Get workspace ID for this specific item
        const itemWorkspaceId = getWorkspaceId
          ? getWorkspaceId(item)
          : (workspaceId ?? "");

        if (type === "document" || type === "sharedDocument") {
          href = `/editor/d/${itemWorkspaceId}/${item.id}`;
          itemTitle = getPlainText(item.content.title);
          subtitle = renderSubtitle?.(item) ?? "";
        } else if (type === "task") {
          href = `/s/${itemWorkspaceId}/tasks`;
          itemTitle = item.block?.content?.text ?? "";
        } else if (type === "folder") {
          href = `/s/${itemWorkspaceId}/f/${item.id}`;
          itemTitle = item.name;
          subtitle = `In ${item.workspace?.name ?? ""}`;
        }

        return (
          <SearchItem
            key={item.id}
            type={type}
            id={item.id}
            title={itemTitle}
            subtitle={subtitle}
            href={href}
            onClick={onResultClick}
            avatarUrl={item.user?.avatar_url ?? ""}
          />
        );
      })}
    </div>
  );
};
