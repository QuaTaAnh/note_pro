import { getFileBadge, getFileExtension } from "@/lib/file-utils";
import { Paperclip } from "lucide-react";
import Image from "next/image";
import { EmptyState } from "./EmptyState";
import { SidebarAttachment } from "./types";

interface AttachmentsTabProps {
  attachments: SidebarAttachment[];
}

export const AttachmentsTab = ({ attachments }: AttachmentsTabProps) => {
  return attachments.length === 0 ? (
    <EmptyState
      icon={<Paperclip className="h-4 w-4" />}
      title="No attachments"
      description="Upload files right from the editor"
    />
  ) : (
    <div className="space-y-2">
      {attachments.map((file) => (
        <AttachmentRow key={file.id} file={file} />
      ))}
    </div>
  );
};

function AttachmentRow({ file }: { file: SidebarAttachment }) {
  const extension = getFileExtension(file.name, file.type);
  const badge = getFileBadge(extension);

  return (
    <div className="flex items-center gap-3 rounded-lg border px-2 py-2 transition hover:bg-muted/50">
      <div className="relative flex h-10 w-8 items-center justify-center">
        <Image
          src="/images/file-badge-base.png"
          alt="File badge"
          width={32}
          height={40}
          className="pointer-events-none select-none object-contain"
        />
        <span
          className={`pointer-events-none absolute text-[10px] font-semibold uppercase tracking-[0.08em] ${badge.textClass}`}
        >
          {badge.label}
        </span>
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold truncate">{file.name}</p>
        <p className="text-[11px] text-muted-foreground truncate">
          {file.type}
          {file.size ? ` · ${file.size}` : ""}
        </p>
      </div>
    </div>
  );
}
