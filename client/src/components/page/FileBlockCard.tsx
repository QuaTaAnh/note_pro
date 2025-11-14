"use client";

import { Button } from "@/components/ui/button";
import { IMAGE_EXTENSIONS } from "@/consts";
import { Block } from "@/hooks";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText, Trash2 } from "lucide-react";
import Image from "next/image";
import { ReactNode, useCallback, useMemo } from "react";

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
    <div className="group relative flex items-start gap-3 px-2 rounded-md hover:bg-accent/30 transition-colors my-1">
      {editable && <div className="pt-1">{dragHandle}</div>}
      {isImageFile ? (
        <button
          type="button"
          onClick={handleOpen}
          className={cn(
            "flex-1 min-w-0 overflow-hidden rounded-lg border bg-muted/40",
            !fileUrl && "cursor-not-allowed opacity-70"
          )}
          disabled={!fileUrl}
        >
          {fileUrl && (
            <div className="relative w-full bg-background">
              <Image
                src={fileUrl}
                alt={fileName}
                width={1200}
                height={675}
                className="h-auto w-full object-contain"
              />
            </div>
          )}
          <div className="flex items-center justify-between gap-3 border-t px-4 py-2 text-left">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{fileName}</p>
              <p className="truncate text-xs text-muted-foreground">
                {fileType}
                {fileSize ? ` · ${fileSize}` : ""}
              </p>
            </div>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </div>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleOpen}
          className={cn(
            "flex-1 min-w-0 border rounded-lg px-4 py-3 text-left bg-muted/40 hover:bg-muted/60 transition-colors",
            !fileUrl && "cursor-not-allowed opacity-70"
          )}
          disabled={!fileUrl}
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-md bg-primary/10 text-primary flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{fileName}</p>
              <p className="text-xs text-muted-foreground truncate">
                {fileType}
                {fileSize ? ` · ${fileSize}` : ""}
              </p>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
      )}
      {onDeleteBlock && editable && (
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 mt-0.5"
          onClick={onDeleteBlock}
        >
          <Trash2 size={14} />
        </Button>
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
