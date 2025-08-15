"use client";

import { Document } from "@/app/types";
import { DocCardSkeleton } from "@/components/custom/DocCardSkeleton";
import { DocumentMoreMenu } from "@/components/page/DocumentMoreMenu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PageLoading } from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { useGetAllDocsQuery } from "@/graphql/queries/__generated__/document.generated";
import { useWorkspace } from "@/hooks/use-workspace";
import { formatDate } from "@/lib/utils";
import { useEffect, useState } from "react";

export const LIMIT = 10;

export default function AllDocsPage() {
  const { workspace } = useWorkspace();
  const [allDocs, setAllDocs] = useState<Document[]>([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { loading, fetchMore } = useGetAllDocsQuery({
    variables: {
      workspaceId: workspace?.id || "",
      limit: LIMIT,
      offset: 0,
    },
    skip: !workspace?.id,
    fetchPolicy: "network-only",
    onCompleted: (res) => {
      const firstBatch = res?.blocks || [];
      setAllDocs(firstBatch);
      if (firstBatch.length < LIMIT) {
        setHasMore(false);
      }
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (nearBottom && !loading && !isFetchingMore && hasMore) {
        setIsFetchingMore(true);
        fetchMore({
          variables: {
            workspaceId: workspace?.id || "",
            offset: allDocs.length,
            limit: LIMIT,
          },
        }).then((res) => {
          const newBatch = res?.data?.blocks || [];
          setAllDocs((prev) => [...prev, ...newBatch]);
          if (newBatch.length < LIMIT) {
            setHasMore(false);
          }
          setIsFetchingMore(false);
        });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    allDocs.length,
    loading,
    isFetchingMore,
    hasMore,
    fetchMore,
    workspace?.id,
  ]);

  return loading && allDocs.length === 0 ? (
    <PageLoading />
  ) : (
    <div className="p-4">
      <div className="flex flex-col items-start justify-start max-w-7xl mx-auto w-full gap-10">
        <h1 className="text-xl font-semibold">All Docs</h1>
        {allDocs.length === 0 ? (
          <div className="text-sm text-muted-foreground flex items-center justify-center w-full h-full">
            You have no documents yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
            {allDocs.map((doc) => (
              <Card
                key={doc.id}
                className="group relative cursor-pointer transition min-h-[346px] md:min-w-[240px] shadow-sm hover:shadow-lg hover:shadow-black/30 dark:shadow-sm dark:hover:shadow-white/30"
              >
                <CardHeader className="flex flex-col p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-sm">
                        {doc.content?.title || "Untitled"}
                      </CardTitle>
                      <CardDescription>
                        Updated{" "}
                        {formatDate(doc?.updated_at || "", { relative: true })}
                      </CardDescription>
                    </div>
                    <DocumentMoreMenu
                      documentId={doc.id}
                      onDeleted={(deletedId) =>
                        setAllDocs((prev) =>
                          prev.filter((d) => d.id !== deletedId)
                        )
                      }
                    />
                  </div>
                  <Separator className="mt-2" />
                </CardHeader>
                <CardContent className="flex flex-col px-4 truncate text-muted-foreground">
                  {doc.content?.title || ""}
                </CardContent>
              </Card>
            ))}
            {allDocs.length < LIMIT &&
              Array.from({ length: LIMIT - allDocs.length }).map((_, i) => (
                <DocCardSkeleton key={`default-skeleton-${i}`} />
              ))}

            {isFetchingMore &&
              Array.from({ length: LIMIT }).map((_, i) => (
                <DocCardSkeleton key={`loadmore-skeleton-${i}`} />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
