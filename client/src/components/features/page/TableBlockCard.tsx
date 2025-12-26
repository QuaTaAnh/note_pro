"use client";

import { Block } from "@/hooks";
import { ReactNode } from "react";
import { BlockActionMenu } from "./BlockActionMenu";

interface TableBlockCardProps {
  block: Block;
  dragHandle?: ReactNode;
  editable?: boolean;
  onDeleteBlock?: () => void;
  onInsertAbove?: () => void;
  onInsertBelow?: () => void;
}

export const TableBlockCard = ({
  block,
  dragHandle,
  editable = true,
  onDeleteBlock,
  onInsertAbove,
  onInsertBelow,
}: TableBlockCardProps) => {
  const tableHTML = block.content?.text || "";

  return (
    <div className="group relative">
      <div className="flex items-start gap-2">
        {editable && dragHandle && (
          <div className="flex-shrink-0 mt-2">{dragHandle}</div>
        )}
        <div
          className="flex-1 min-w-0 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: tableHTML }}
        />
        {editable && (
          <div className="ml-1 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
            <BlockActionMenu
              blockId={block.id}
              onDelete={onDeleteBlock}
              onInsertAbove={onInsertAbove}
              onInsertBelow={onInsertBelow}
            />
          </div>
        )}
      </div>
    </div>
  );
};
