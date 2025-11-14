"use client";

import { IMAGE_EXTENSIONS } from "@/consts";
import { Block } from "@/hooks";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
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
  const fileExtension = useMemo(
    () => getFileExtension(fileName, content.fileType),
    [fileName, content.fileType]
  );
  const fileBadge = useMemo(() => getFileBadge(fileExtension), [fileExtension]);
  const badgeLabel = fileBadge.label;

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
    <div className="group relative flex items-start gap-2 py-1">
      {editable && <div className="text-muted-foreground">{dragHandle}</div>}
      <button
        type="button"
        onClick={handleOpen}
        className={cn(
          "flex-1 min-w-0 rounded p-1.5 text-left transition-all duration-200 hover:shadow-md bg-muted/30",
          !fileUrl && "cursor-not-allowed opacity-70"
        )}
        disabled={!fileUrl}
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
                    fileBadge.textClass
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
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
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

type FileBadge = {
  label: string;
  textClass: string;
};

const FILE_BADGES: Record<string, FileBadge> = {
  pdf: { label: "PDF", textClass: "text-red-600" },
  doc: { label: "WORD", textClass: "text-blue-600" },
  docx: { label: "WORD", textClass: "text-blue-600" },
  xls: { label: "XLS", textClass: "text-green-600" },
  xlsx: { label: "XLS", textClass: "text-green-600" },
  ppt: { label: "PPT", textClass: "text-orange-600" },
  pptx: {
    label: "PPT",
    textClass: "text-orange-600",
  },
  txt: { label: "TXT", textClass: "text-slate-600" },
  csv: {
    label: "CSV",
    textClass: "text-emerald-600",
  },
  zip: { label: "ZIP", textClass: "text-amber-600" },
  rar: { label: "RAR", textClass: "text-amber-600" },
  default: {
    label: "FILE",
    textClass: "text-primary",
  },
};

function getFileBadge(extension?: string | null): FileBadge {
  if (!extension) return FILE_BADGES.default;
  return (
    FILE_BADGES[extension] || {
      ...FILE_BADGES.default,
      label: extension.toUpperCase(),
    }
  );
}

function getFileExtension(fileName: string, fileType?: string | null) {
  const fromName = fileName?.split("?")[0]?.split(".").pop()?.toLowerCase();
  if (fromName) return fromName;
  if (!fileType) return null;
  const normalizedType = fileType.toLowerCase();
  if (normalizedType.includes("pdf")) return "pdf";
  if (normalizedType.includes("word")) return "docx";
  if (
    normalizedType.includes("excel") ||
    normalizedType.includes("spreadsheet")
  )
    return "xlsx";
  if (normalizedType.includes("powerpoint")) return "pptx";
  if (normalizedType.includes("text")) return "txt";
  if (normalizedType.includes("zip")) return "zip";
  if (normalizedType.includes("rar")) return "rar";
  return null;
}
