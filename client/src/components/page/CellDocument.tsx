"use client";

import React from "react";
import { GridChildComponentProps } from "react-window";
import { Document } from "@/types/app";
import { CardDocument } from "@/components/page/CardDocument";

interface CellDocumentData {
  docs: Document[];
  columnCount: number;
  columnWidth: number;
}

export const CellDocument = React.memo(function CellDocument({
  columnIndex,
  rowIndex,
  style,
  data,
}: GridChildComponentProps<CellDocumentData>) {
  const { docs, columnCount, columnWidth } = data;
  const itemIndex = rowIndex * columnCount + columnIndex;
  if (itemIndex >= docs.length) return null;

  const doc = docs[itemIndex];

  return (
    <div
      style={{
        ...style,
        left: (style.left as number) + columnIndex * 40,
        top: (style.top as number) + rowIndex * 40,
        width: columnWidth,
        height: 304,
      }}
    >
      <div className="mr-6">
        <CardDocument document={doc} />
      </div>
    </div>
  );
});
