import Image from "next/image";
import { ExternalLink, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { SidebarAttachment } from "./types";
import { EmptyState } from "./EmptyState";
import { getFileBadge, getFileExtension } from "@/lib/file-utils";

interface AttachmentsTabProps {
  attachments: SidebarAttachment[];
}

export function AttachmentsTab({ attachments }: AttachmentsTabProps) {
  if (attachments.length === 0) {
    return (
      <EmptyState
        icon={<Paperclip className="h-4 w-4" />}
        title="No attachments"
        description="Upload files right from the editor"
      />
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((file) => (
        <AttachmentRow key={file.id} file={file} />
      ))}
    </div>
  );
}

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
        <span className={`pointer-events-none absolute text-[10px] font-semibold uppercase tracking-[0.08em] ${badge.textClass}`}>
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
      {file.uploadedAt && (
        <Badge variant="secondary" className="text-[10px]">
          {formatDate(file.uploadedAt, { relative: true })}
        </Badge>
      )}
      {file.url && (
        <Button variant="ghost" size="icon" asChild>
          <a href={file.url} target="_blank" rel="noreferrer noopener" className="text-muted-foreground">
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      )}
    </div>
  );
}
