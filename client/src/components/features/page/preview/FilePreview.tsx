import { Block } from "@/hooks";
import { Paperclip } from "lucide-react";
import { formatFileSize } from "@/lib/fileUtils";
import Image from "next/image";

export const FilePreview = ({ block }: { block: Block }) => {
  const content = block.content;
  const fileName = content.fileName;
  const fileType = content.fileType;
  const fileSize = content.fileSize ? formatFileSize(content.fileSize) : null;
  const fileUrl = content.fileUrl;

  const isImage = fileType?.toLowerCase().startsWith("image/");

  if (isImage && fileUrl) {
    return (
      <div className="relative w-full h-16 rounded overflow-hidden bg-muted">
        <Image
          src={fileUrl}
          alt={fileName || "Image"}
          fill
          className="object-cover"
          sizes="240px"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 text-xs bg-muted/30 rounded px-2 py-1">
      <Paperclip className="w-3 h-3 text-muted-foreground flex-shrink-0" />
      <span className="truncate text-muted-foreground flex-1">
        {fileName || "File"}
      </span>
      {fileSize && (
        <span className="text-muted-foreground/60 text-[10px] flex-shrink-0">
          {fileSize}
        </span>
      )}
    </div>
  );
};
