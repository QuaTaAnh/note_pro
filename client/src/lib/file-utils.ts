export function formatFileSize(bytes?: number | null) {
  if (!bytes || bytes <= 0) return null;
  const units = ["B", "KB", "MB", "GB"];
  const i = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );
  const value = bytes / Math.pow(1024, i);
  return `${value.toFixed(value >= 10 || i === 0 ? 0 : 1)} ${units[i]}`;
}

export type FileBadge = {
  label: string;
  textClass: string;
};

const FILE_BADGES: Record<string, FileBadge> = {
  pdf: { label: "PDF", textClass: "text-red-500" },
  doc: { label: "WORD", textClass: "text-blue-500" },
  docx: { label: "WORD", textClass: "text-blue-500" },
  xls: { label: "XLS", textClass: "text-green-500" },
  xlsx: { label: "XLSX", textClass: "text-green-500" },
  ppt: { label: "PPT", textClass: "text-orange-500" },
  pptx: { label: "PPT", textClass: "text-orange-500" },
  txt: { label: "TXT", textClass: "text-slate-500" },
  csv: { label: "CSV", textClass: "text-emerald-500" },
  zip: { label: "ZIP", textClass: "text-amber-500" },
  rar: { label: "RAR", textClass: "text-amber-500" },
  default: { label: "FILE", textClass: "text-primary" },
};

export function getFileBadge(extension?: string | null): FileBadge {
  if (!extension) return FILE_BADGES.default;
  return (
    FILE_BADGES[extension] || {
      ...FILE_BADGES.default,
      label: extension.toUpperCase(),
    }
  );
}

export function getFileExtension(fileName: string, fileType?: string | null) {
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
