"use client";

import { Button } from "@/components/ui/button";
import { Block } from "@/hooks";
import { cn } from "@/lib/utils";
import { ExternalLink, FileText, Trash2 } from "lucide-react";
import { ReactNode, useCallback } from "react";

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

  return (
    <div className="group relative flex items-start gap-3 px-2 rounded-md hover:bg-accent/30 transition-colors my-1">
      {editable && <div className="pt-1">{dragHandle}</div>}
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
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}
