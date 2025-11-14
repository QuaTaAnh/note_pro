"use client";

import { CellDocument } from "@/components/page/CellDocument";
import { Button } from "@/components/ui/button";
import { PageLoading } from "@/components/ui/loading";
import { useCreateUntitledPageMutation } from "@/graphql/mutations/__generated__/document.generated";
import { useGetAllDocsQuery } from "@/graphql/queries/__generated__/document.generated";
import { useUserId } from "@/hooks/use-auth";
import { useWorkspace } from "@/hooks/use-workspace";
import { Document } from "@/types/app";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FiFilePlus } from "react-icons/fi";
import AutoSizer from "react-virtualized-auto-sizer";
import { FixedSizeGrid as Grid } from "react-window";

const MIN_CARD_WIDTH = 240;
const GUTTER = 40;
const CARD_HEIGHT = 304;
const rowHeight = CARD_HEIGHT + GUTTER;

export default function AllDocsPage() {
  const { workspace } = useWorkspace();
  const router = useRouter();
  const userId = useUserId();
  const [createDocument] = useCreateUntitledPageMutation();
  const [isCreating, setIsCreating] = useState(false);

  const handleClick = async () => {
    if (isCreating || !workspace?.id) return;

    try {
      setIsCreating(true);
      const res = await createDocument({
        variables: {
          input: {
            type: "page",
            workspace_id: workspace.id,
            user_id: userId || "",
            folder_id: null,
            content: {
              title: "Untitled Page",
            },
            position: 0,
            parent_id: null,
            page_id: null,
          },
        },
      });

      const docId = res.data?.insert_blocks_one?.id;
      if (docId) {
        router.push(`/editor/d/${workspace.id}/${docId}`);
      }
    } catch (err) {
      console.error("Failed to create document:", err);
    } finally {
      setIsCreating(false);
    }
  };

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
            onClick={handleClick}
            disabled={isCreating}
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
                  Math.floor((width + GUTTER) / (MIN_CARD_WIDTH + GUTTER)),
                );

                const totalGutters = (columnCount - 1) * GUTTER;
                const columnWidth = Math.floor(
                  (width - totalGutters) / columnCount,
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
