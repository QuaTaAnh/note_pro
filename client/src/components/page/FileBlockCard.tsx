"use client";

import { IMAGE_EXTENSIONS } from "@/consts";
import { Block } from "@/hooks";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText } from "lucide-react";
import Image from "next/image";
import { ReactNode, useCallback, useMemo } from "react";
import { BlockActionMenu } from "./BlockActionMenu";

type FileContent = {
  fileUrl?: string;
  fileName?: string;
  fileType?: string;
  fileSize?: number;
};

interface FileBlockCardProps {
  block: Block;
  dragHandle?: ReactNode;
  editable?: boolean;
  onDeleteBlock?: () => void;
}

export function FileBlockCard({
  block,
  dragHandle,
  editable = true,
  onDeleteBlock,
}: FileBlockCardProps) {
  const content = (block.content as FileContent) || {};
  const fileUrl = content.fileUrl || "";
  const fileName = content.fileName || content.fileUrl || "Untitled file";
  const fileType = content.fileType || "Unknown type";
  const fileSize = content.fileSize ? formatFileSize(content.fileSize) : null;

  const handleOpen = useCallback(() => {
    if (!fileUrl) return;
    window.open(fileUrl, "_blank", "noopener,noreferrer");
  }, [fileUrl]);

  const isImageFile = useMemo(() => {
    if (!fileUrl) return false;
    if (fileType?.toLowerCase().startsWith("image/")) return true;
    const extension = fileUrl.split("?")[0]?.split(".").pop()?.toLowerCase();
    return extension ? IMAGE_EXTENSIONS.has(extension) : false;
  }, [fileType, fileUrl]);

  return (
    <div className="group relative flex items-start gap-3 py-1">
      {editable && <div className="pt-2 text-muted-foreground">{dragHandle}</div>}
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "flex-1 min-w-0 rounded-2xl border border-border/60 bg-card px-4 py-4 text-left shadow-sm transition-all duration-200 hover:shadow-md focus-visible:outline-none",
          !fileUrl && "cursor-not-allowed opacity-70"
        )}
        disabled={!fileUrl}
      >
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <FileText className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate">{fileName}</p>
            <p className="text-xs text-muted-foreground truncate">
              {fileType}
              {fileSize ? ` · ${fileSize}` : ""}
            </p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </div>

        {isImageFile && fileUrl && (
          <div className="mt-4 overflow-hidden rounded-2xl border border-dashed border-muted bg-muted/30">
            <Image
              src={fileUrl}
              alt={fileName}
              width={1200}
              height={675}
              className="h-auto w-full object-contain"
            />
          </div>
        )}
      </button>
      {editable && (
        <div className="ml-1 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <BlockActionMenu
            onDelete={onDeleteBlock}
            downloadUrl={fileUrl}
            downloadFileName={fileName}
          />
        </div>
      )}
    </div>
  );
}

function formatFileSize(bytes: number) {
  if (!bytes || bytes <= 0) return null;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
