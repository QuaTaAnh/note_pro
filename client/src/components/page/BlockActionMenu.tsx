"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Download, MoreVertical, Trash2 } from "lucide-react";
import { useCallback } from "react";

interface BlockActionMenuProps {
  onDelete?: () => void;
  downloadUrl?: string | null;
  downloadFileName?: string | null;
  className?: string;
}

export function BlockActionMenu({
  onDelete,
  downloadUrl,
  downloadFileName,
  className,
}: BlockActionMenuProps) {
  const hasActions = Boolean(onDelete) || Boolean(downloadUrl);
  const handleDownload = useCallback(async () => {
    if (!downloadUrl) return;

    const inferredFileName =
      downloadFileName ||
      downloadUrl.split("/").pop()?.split("?")[0] ||
      "download";

    try {
      const response = await fetch(downloadUrl);
      if (!response.ok) throw new Error("Failed to download file");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = inferredFileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading file", error);
      window.open(downloadUrl, "_blank", "noopener,noreferrer");
    }
  }, [downloadFileName, downloadUrl]);

  if (!hasActions) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "h-8 w-8 rounded-full text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-offset-0",
            className
          )}
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-44 p-2">
        <div className="flex flex-col gap-1">
          {downloadUrl && (
            <Button
              variant="ghost"
              size="sm"
              className="justify-start px-2 py-1.5 text-sm"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
          {onDelete && (
            <Button
              variant="ghost"
              size="sm"
              className="justify-start px-2 py-1.5 text-sm text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
