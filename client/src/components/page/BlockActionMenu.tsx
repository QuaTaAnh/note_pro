"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Download, MoreVertical, Trash2 } from "lucide-react";

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
              asChild
              className="justify-start px-2 py-1.5 text-sm"
            >
              <a
                href={downloadUrl}
                download={downloadFileName || undefined}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download className="h-4 w-4" />
                Download
              </a>
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
