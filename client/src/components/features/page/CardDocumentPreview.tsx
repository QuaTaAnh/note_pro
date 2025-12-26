"use client";

import { BlockType } from "@/types/types";
import { Block } from "@/hooks";
import { getPlainText } from "./CardDocument";
import { Check, Calendar, Paperclip } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { TASK_STATUS } from "@/lib/constants";
import { formatFileSize } from "@/lib/fileUtils";
import Image from "next/image";

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
    default:
      return null;
  }
};

const ParagraphPreview = ({ block }: { block: Block }) => {
  const text = getPlainText(block.content?.text);
  if (!text) return null;

  return (
    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
      {text}
    </p>
  );
};

const TaskPreview = ({ block }: { block: Block }) => {
  const task = block.tasks?.[0];
  const text = getPlainText(block.content?.text) || "Untitled task";
  const isCompleted = task?.status === TASK_STATUS.COMPLETED;

  return (
    <div className="flex items-center gap-2 text-xs min-w-0">
      <div
        className={cn(
          "w-3 h-3 rounded border flex items-center justify-center flex-shrink-0",
          isCompleted
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300"
        )}
      >
        {isCompleted && <Check className="w-2 h-2" />}
      </div>
      <div className="flex items-center gap-1.5 min-w-0 flex-1">
        <span
          className={cn(
            "truncate text-muted-foreground flex-1",
            isCompleted && "line-through opacity-60"
          )}
        >
          {text}
        </span>
        {task?.schedule_date && (
          <span className="flex items-center gap-0.5 text-muted-foreground/60 flex-shrink-0">
            <Calendar className="w-2.5 h-2.5" />
            <span className="text-[10px]">
              {formatDate(task.schedule_date, { relative: true })}
            </span>
          </span>
        )}
      </div>
    </div>
  );
};

const FilePreview = ({ block }: { block: Block }) => {
  const content = block.content;
  const fileName = content.fileName;
  const fileType = content.fileType;
  const fileSize = content.fileSize ? formatFileSize(content.fileSize) : null;
  const fileUrl = content.fileUrl;

  const isImage = fileType?.toLowerCase().startsWith("image/");

  if (isImage && fileUrl) {
    return (
      <div className="relative w-full h-16 rounded overflow-hidden bg-muted">
        <Image
          src={fileUrl}
          alt={fileName || "Image"}
          fill
          className="object-cover"
          sizes="240px"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs bg-muted/30 rounded px-2 py-1">
      <Paperclip className="w-3 h-3 text-muted-foreground flex-shrink-0" />
      <span className="truncate text-muted-foreground flex-1">
        {fileName || "File"}
      </span>
      {fileSize && (
        <span className="text-muted-foreground/60 text-[10px] flex-shrink-0">
          {fileSize}
        </span>
      )}
    </div>
  );
};
