"use client";

import { CellDocument } from "@/components/page/CellDocument";
import { Document } from "@/types/app";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as Grid } from "react-window";

const MIN_CARD_WIDTH = 200;
const GUTTER = 24;
const CARD_HEIGHT = 304;
const rowHeight = CARD_HEIGHT + GUTTER;

interface DocumentGridProps {
  documents: Document[];
}

export function DocumentGrid({ documents }: DocumentGridProps) {
  return (
    <div className="flex-1 w-full pb-4 pl-6 overflow-hidden">
      <AutoSizer>
        {({ width, height }) => {
          if (width === 0 || height === 0) return null;

          const columnCount = Math.min(
            5,
            Math.max(1, Math.floor(width / (MIN_CARD_WIDTH + GUTTER))),
          );

          const columnWidth = Math.floor(width / columnCount);
          const rowCount = Math.ceil(documents.length / columnCount);

          return (
            <Grid
              columnCount={columnCount}
              columnWidth={columnWidth}
              height={height}
              rowCount={rowCount}
              rowHeight={rowHeight}
              width={width}
              overscanRowCount={3}
              style={{ overflowX: "hidden" }}
              itemData={{ docs: documents, columnCount, columnWidth }}
            >
              {CellDocument}
            </Grid>
          );
        }}
      </AutoSizer>
    </div>
  );
}
