"use client";

import { BlockType } from "@/types/types";
import { Block } from "@/hooks";
import {
  ParagraphPreview,
  TaskPreview,
  FilePreview,
  TablePreview,
} from "./preview";

interface Props {
  blocks: Block[];
}

export const CardDocumentPreview = ({ blocks }: Props) => {
  return (
    <div className="space-y-1 h-full overflow-hidden">
      {blocks.map((block) => (
        <BlockPreviewItem key={block.id} block={block} />
      ))}
    </div>
  );
};

const BlockPreviewItem = ({ block }: { block: Block }) => {
  switch (block.type) {
    case BlockType.PARAGRAPH:
      return <ParagraphPreview block={block} />;
    case BlockType.TASK:
      return <TaskPreview block={block} />;
    case BlockType.FILE:
      return <FilePreview block={block} />;
    case BlockType.TABLE:
      return <TablePreview block={block} />;
    default:
      return null;
  }
};
