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

  const document = docs[itemIndex];
  const isLastColumn = columnIndex === columnCount - 1;

  return (
    <div
      style={{
        ...style,
        width: columnWidth,
        height: 304,
        paddingRight: isLastColumn ? 24 : 24,
      }}
    >
      <CardDocument document={document} />
    </div>
  );
});
