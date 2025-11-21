"use client";

import { FiImage, FiFileText } from "react-icons/fi";

interface ExportTabProps {
  documentId: string;
}

export function ExportTab({ documentId }: ExportTabProps) {
  const handleExportPDF = async () => {
    // TODO: Implement PDF export
  };

  const handleExportImage = async () => {
    // TODO: Implement Image export
  };

  return (
    <div className="p-2">
      <button
        onClick={handleExportPDF}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-left"
      >
        <FiFileText className="h-4 w-4" />
        <span className="text-sm">PDF</span>
      </button>
      <button
        onClick={handleExportImage}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-left"
      >
        <FiImage className="h-4 w-4" />
        <span className="text-sm">Image</span>
      </button>
    </div>
  );
}
