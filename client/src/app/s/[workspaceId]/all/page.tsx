"use client";

import { Document } from "@/types/app";
import { CardDocument } from "@/components/page/CardDocument";
import { DocCardSkeleton } from "@/components/page/DocCardSkeleton";
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

  const docsToRender: Document[] = useMemo(() => {
    const seenIds = new Set<string>();
    return allDocs.filter((doc) => {
      if (!doc?.id) return false;
      if (seenIds.has(doc.id)) return false;
      seenIds.add(doc.id);
      return true;
    });
  }, [allDocs]);

  useEffect(() => {
    if (!loading && docsToRender.length < LIMIT) {
      setHasMore(false);
    }
  }, [loading, docsToRender.length]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } =
        document.documentElement;
      const nearBottom = scrollHeight - scrollTop - clientHeight < 100;

      if (nearBottom && !loading && !isFetchingMore && hasMore) {
        setIsFetchingMore(true);
        const prevLen = docsToRender.length;
        fetchMore({
          variables: {
            workspaceId: workspace?.id || "",
            offset: prevLen,
            limit: LIMIT,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              ...prev,
              blocks: [...prev.blocks, ...fetchMoreResult.blocks],
            };
          },
        })
          .then((res) => {
            const fetched = res?.data?.blocks?.length ?? 0;
            if (fetched < LIMIT) {
              setHasMore(false);
            }
          })
          .catch(() => {
            setHasMore(false);
          })
          .finally(() => {
            setIsFetchingMore(false);
          });
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    docsToRender.length,
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
            {docsToRender.map((document) => (
              <CardDocument key={document.id} document={document} />
            ))}
            {docsToRender.length < LIMIT &&
              Array.from({ length: LIMIT - docsToRender.length }).map(
                (_, i) => <DocCardSkeleton key={`default-skeleton-${i}`} />
              )}

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
