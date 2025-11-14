"use client";

import { CellDocument } from "@/components/page/CellDocument";
import { PageLoading } from "@/components/ui/loading";
import { useGetSharedWithMeDocsQuery } from "@/graphql/queries/__generated__/document.generated";
import { useUserId } from "@/hooks/use-auth";
import { Document } from "@/types/app";
import { useMemo } from "react";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as Grid } from "react-window";
import { FiUsers } from "react-icons/fi";
import { IoShareOutline } from "react-icons/io5";

const MIN_CARD_WIDTH = 240;
const GUTTER = 40;
const CARD_HEIGHT = 304;
const rowHeight = CARD_HEIGHT + GUTTER;

export default function SharedWithMePage() {
  const userId = useUserId();

  const { loading, data } = useGetSharedWithMeDocsQuery({
    variables: { userId: userId || "" },
    skip: !userId,
    fetchPolicy: "cache-and-network",
    pollInterval: 5000,
  });

  const sharedDocs: Document[] = useMemo(() => data?.blocks || [], [data]);

  return loading && sharedDocs.length === 0 ? (
    <PageLoading />
  ) : (
    <div className="p-0 w-full h-full">
      <div className="flex flex-col items-start justify-start mx-auto w-full h-full min-h-0 max-w-screen-2xl gap-6">
        <div className="w-full pt-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <IoShareOutline className="w-6 h-6 text-muted-foreground" />
            <h1 className="text-xl font-medium">Shared With Me</h1>
          </div>
          <span className="text-sm text-muted-foreground">
            {sharedDocs.length}{" "}
            {sharedDocs.length === 1 ? "document" : "documents"}
          </span>
        </div>

        {sharedDocs.length === 0 ? (
          <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <FiUsers className="w-16 h-16 text-muted-foreground/40" />
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">
                No shared documents yet
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Documents shared with you will appear here
              </p>
            </div>
          </div>
        ) : (
          <div className="flex-1 w-full pb-4 overflow-hidden">
            <AutoSizer>
              {({ width, height }) => {
                if (width === 0 || height === 0) return null;

                const columnCount = Math.max(
                  1,
                  Math.floor((width + GUTTER) / (MIN_CARD_WIDTH + GUTTER)),
                );

                const totalGutters = (columnCount - 1) * GUTTER;
                const columnWidth = Math.floor(
                  (width - totalGutters) / columnCount,
                );

                const rowCount = Math.ceil(sharedDocs.length / columnCount);

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
                    itemData={{ docs: sharedDocs, columnCount, columnWidth }}
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
