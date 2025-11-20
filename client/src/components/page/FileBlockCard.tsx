"use client";

import { IMAGE_EXTENSIONS } from "@/consts";
import { Block } from "@/hooks";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ReactNode, useCallback, useMemo, useState } from "react";
import { BlockActionMenu } from "./BlockActionMenu";
import {
  formatFileSize,
  getFileBadge,
  getFileExtension,
  canPreviewInBrowser,
} from "@/lib/file-utils";
import { ImageModal } from "./ImageModal";

interface FileBlockCardProps {
  block: Block;
  dragHandle?: ReactNode;
  editable?: boolean;
  onDeleteBlock?: () => void;
  onInsertAbove?: () => void;
  onInsertBelow?: () => void;
}

export const FileBlockCard = ({
  block,
  dragHandle,
  editable = true,
  onDeleteBlock,
  onInsertAbove,
  onInsertBelow,
}: FileBlockCardProps) => {
  const content = block.content;
  const fileUrl = content.fileUrl;
  const fileName = content.fileName;
  const fileType = content.fileType;
  const fileSize = content.fileSize ? formatFileSize(content.fileSize) : null;
  const fileExtension = useMemo(
    () => getFileExtension(fileName, content.fileType),
    [fileName, content.fileType],
  );
  const fileBadge = useMemo(() => getFileBadge(fileExtension), [fileExtension]);
  const badgeLabel = fileBadge.label;

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  const isImageFile = useMemo(() => {
    if (!fileUrl) {
      return false;
    }
    if (fileType?.toLowerCase().startsWith("image/")) {
      return true;
    }
    const extension = fileUrl.split("?")[0]?.split(".").pop()?.toLowerCase();
    return extension ? IMAGE_EXTENSIONS.has(extension) : false;
  }, [fileType, fileUrl]);

  const canPreview = useMemo(
    () => canPreviewInBrowser(fileType, fileExtension),
    [fileType, fileExtension],
  );

  const handleDoubleClick = useCallback(() => {
    if (!fileUrl) {
      return;
    }

    if (isImageFile) {
      setIsImageModalOpen(true);
    } else if (canPreview) {
      window.open(fileUrl, "_blank", "noopener,noreferrer");
    } else {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = fileName || "download";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  }, [fileUrl, isImageFile, canPreview, fileName]);

  return (
    <>
      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={fileUrl || ""}
        fileName={fileName || "Image"}
      />
      <div className="group relative flex items-start gap-2 py-1">
        {editable && <div className="text-muted-foreground">{dragHandle}</div>}
        <button
          type="button"
          onDoubleClick={handleDoubleClick}
          className={cn(
            "flex-1 min-w-0 rounded p-1.5 text-left transition-all duration-200 hover:shadow-md bg-muted/30",
            !fileUrl && "cursor-not-allowed opacity-70",
          )}
          disabled={!fileUrl}
          data-editor-container
        >
          {!isImageFile && (
            <div className="flex items-center gap-4">
              <div className="relative flex h-14 w-12 items-center justify-center">
                <Image
                  src="/images/file-badge-base.png"
                  alt="File badge"
                  width={48}
                  height={60}
                  className="pointer-events-none select-none object-contain"
                />
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                  <span
                    className={cn(
                      "text-[11px] font-semibold uppercase tracking-[0.08em]",
                      fileBadge.textClass,
                    )}
                  >
                    {badgeLabel}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{fileName}</p>
                <p className="text-xs text-muted-foreground truncate">
                  {fileType}
                  {fileSize ? ` · ${fileSize}` : ""}
                </p>
              </div>
            </div>
          )}

          {isImageFile && fileUrl && (
            <div className="overflow-hidden px-24">
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
              blockId={block.id}
              onDelete={onDeleteBlock}
              downloadUrl={fileUrl}
              downloadFileName={fileName}
              onInsertAbove={onInsertAbove}
              onInsertBelow={onInsertBelow}
            />
          </div>
        )}
      </div>
    </>
  );
};
