"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";
import { useCallback } from "react";
import { FiDownload } from "react-icons/fi";
import { DeleteIcon } from "../icons/DeleteIcon";
import { InsertBlockAboveIcon } from "../icons/InsertBlockAboveIcon";
import { InsertBlockBelowIcon } from "../icons/InsertBlockBelowIcon";

interface BlockActionMenuProps {
  onDelete?: () => void;
  downloadUrl?: string | null;
  downloadFileName?: string | null;
  onInsertAbove?: () => void;
  onInsertBelow?: () => void;
}

export function BlockActionMenu({
  onDelete,
  downloadUrl,
  downloadFileName,
  onInsertAbove,
  onInsertBelow,
}: BlockActionMenuProps) {
  const hasActions =
    Boolean(onDelete) ||
    Boolean(downloadUrl) ||
    Boolean(onInsertAbove) ||
    Boolean(onInsertBelow);
  const handleDownload = useCallback(async () => {
    if (!downloadUrl) {
      return;
    }

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
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 group-hover:opacity-100 opacity-0 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical size={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 p-2" align="start">
        {onInsertAbove && (
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onInsertAbove}
          >
            <InsertBlockAboveIcon />
            Insert Block Above
          </DropdownMenuItem>
        )}
        {onInsertBelow && (
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={onInsertBelow}
          >
            <InsertBlockBelowIcon />
            Insert Block Below
          </DropdownMenuItem>
        )}
        {onDelete && (
          <DropdownMenuItem
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-950 focus:bg-red-100 dark:focus:bg-red-900 focus:text-red-700 dark:focus:text-red-300"
            onClick={onDelete}
          >
            <DeleteIcon />
            Delete
          </DropdownMenuItem>
        )}
        {downloadUrl && (
          <DropdownMenuItem
            className="flex items-center gap-2"
            onClick={handleDownload}
          >
            <FiDownload size={16} />
            Download
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
