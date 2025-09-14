"use client";

import { Document } from "@/types/app";
import { PageLoading } from "@/components/ui/loading";
import { useGetAllDocsQuery } from "@/graphql/queries/__generated__/document.generated";
import { useWorkspace } from "@/hooks/use-workspace";
import React, { useMemo } from "react";
import { FixedSizeGrid as Grid } from "react-window";
import AutoSizer from "react-virtualized-auto-sizer";
import { CellDocument } from "@/components/page/CellDocument";

const MIN_CARD_WIDTH = 240;
const GUTTER = 40;
const CARD_HEIGHT = 304;
const rowHeight = CARD_HEIGHT + GUTTER;

export default function AllDocsPage() {
  const { workspace } = useWorkspace();

  const { loading, data } = useGetAllDocsQuery({
    variables: { workspaceId: workspace?.id || "" },
    skip: !workspace?.id,
    fetchPolicy: "cache-and-network",
  });

  const allDocs: Document[] = useMemo(() => data?.blocks || [], [data]);

  return loading && allDocs.length === 0 ? (
    <PageLoading />
  ) : (
    <div className="p-0 w-full h-full">
      <div className="flex flex-col items-start justify-start mx-auto w-full h-full min-h-0 max-w-screen-2xl gap-2">
        <div className="w-full px-4 pt-4 pb-2">
          <h1 className="text-xl font-medium">All Docs</h1>
        </div>

        {allDocs.length === 0 ? (
          <div className="text-sm text-muted-foreground flex items-center justify-center w-full h-full">
            You have no documents yet
          </div>
        ) : (
          <div className="flex-1 w-full px-4 pb-4 overflow-hidden">
            <AutoSizer>
              {({ width, height }) => {
                if (width === 0 || height === 0) return null;

                const columnCount = Math.max(
                  1,
                  Math.floor((width + GUTTER) / (MIN_CARD_WIDTH + GUTTER))
                );

                const totalGutters = (columnCount - 1) * GUTTER;
                const columnWidth = Math.floor(
                  (width - totalGutters) / columnCount
                );

                const rowCount = Math.ceil(allDocs.length / columnCount);

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
                    itemData={{ docs: allDocs, columnCount, columnWidth }}
                  >
                    {CellDocument}
                  </Grid>
                );
              }}
            </AutoSizer>
          </div>
        )}
      </div>
    </div>
  );
}
