"use client";

import { Document } from "@/app/types";
import { DocCardSkeleton } from "@/components/custom/DocCardSkeleton";
import { CardDocument } from "@/components/page/CardDocument";
import { PageLoading } from "@/components/ui/loading";
import { LIMIT } from "@/consts";
import { useGetAllDocsQuery } from "@/graphql/queries/__generated__/document.generated";
import { useWorkspace } from "@/hooks/use-workspace";
import { useEffect, useMemo, useState } from "react";

export default function AllDocsPage() {
  const { workspace } = useWorkspace();
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { loading, data, fetchMore } = useGetAllDocsQuery({
    variables: {
      workspaceId: workspace?.id || "",
      limit: LIMIT,
      offset: 0,
    },
    skip: !workspace?.id,
    fetchPolicy: "cache-and-network",
  });

  const allDocs: Document[] = useMemo(() => data?.blocks || [], [data]);

  useEffect(() => {
    if (!loading && allDocs.length < LIMIT) {
      setHasMore(false);
    }
  }, [loading, allDocs.length]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (nearBottom && !loading && !isFetchingMore && hasMore) {
        setIsFetchingMore(true);
        const prevLen = allDocs.length;
        fetchMore({
          variables: {
            workspaceId: workspace?.id || "",
            offset: prevLen,
            limit: LIMIT,
          },
        }).then((res) => {
          const afterLen = res?.data?.blocks?.length ?? prevLen;
          const added = afterLen - prevLen;
          if (added < LIMIT) {
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
    <div className="p-4 min-h-screen">
      <div className="flex flex-col items-start justify-start mx-auto w-full gap-8">
        <h1 className="text-xl font-medium">All Docs</h1>
        {allDocs.length === 0 ? (
          <div className="text-sm text-muted-foreground flex items-center justify-center w-full h-full">
            You have no documents yet
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
            {allDocs.map((document) => (
              <CardDocument key={document.id} document={document} />
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
