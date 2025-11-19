"use client";

import { CellDocument } from "@/components/page/CellDocument";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/loading";
import { useGetAllDocsQuery } from "@/graphql/queries/__generated__/document.generated";
import { useCreateDocument, useWorkspace } from "@/hooks";
import { Document } from "@/types/app";
import { useMemo } from "react";
import { FiFilePlus } from "react-icons/fi";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as Grid } from "react-window";

const MIN_CARD_WIDTH = 240;
const GUTTER = 40;
const CARD_HEIGHT = 304;
const rowHeight = CARD_HEIGHT + GUTTER;

export default function AllDocsPage() {
  const { workspace } = useWorkspace();
  const { createNewDocument, isCreating, canCreate } = useCreateDocument();

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
      <div className="flex flex-col items-start justify-start mx-auto w-full h-full min-h-0 max-w-screen-2xl gap-6">
        <div className="w-full pt-4 flex items-center justify-between">
          <h1 className="text-xl font-medium">All Docs</h1>
          <Button
            variant="outline"
            size="sm"
            className="gap-2 text-sm rounded-xl"
            onClick={createNewDocument}
            disabled={!canCreate || isCreating}
          >
            <FiFilePlus className="w-4 h-4" />
            New Doc
          </Button>
        </div>

        {allDocs.length === 0 ? (
          <div className="text-sm text-muted-foreground flex items-center justify-center w-full h-full">
            You have no documents yet
          </div>
        ) : (
          <div className="flex-1 w-full pb-4 overflow-hidden">
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
