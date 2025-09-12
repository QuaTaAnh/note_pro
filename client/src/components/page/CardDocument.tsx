"use client";

import { DocumentMoreMenu } from "@/components/page/DocumentMoreMenu";
import { SimpleTooltip } from "@/components/page/SimpleTooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useWorkspace } from "@/hooks/use-workspace";
import { ROUTES } from "@/lib/routes";
import { formatDate } from "@/lib/utils";
import { Document } from "@/types/app";
import { Folder } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export const CardDocument = ({ document }: { document: Document }) => {
  const router = useRouter();
  const { workspace } = useWorkspace();

  const titleRef = useRef<HTMLHeadingElement>(null);
  const updatedRef = useRef<HTMLSpanElement>(null);
  const [isTitleTruncated, setIsTitleTruncated] = useState(false);
  const [isUpdatedTruncated, setIsUpdatedTruncated] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      setIsTitleTruncated(
        titleRef.current.scrollWidth > titleRef.current.clientWidth
      );
    }
    if (updatedRef.current) {
      setIsUpdatedTruncated(
        updatedRef.current.scrollWidth > updatedRef.current.clientWidth
      );
    }
  }, [document.content?.title, document.updated_at, document.folder?.name]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!workspace?.id) {
      return;
    }
    if (document.folder?.id) {
      router.push(
        ROUTES.WORKSPACE_DOCUMENT_FOLDER(
          workspace.id,
          document.folder.id,
          document.id
        )
      );
    } else {
      router.push(ROUTES.WORKSPACE_DOCUMENT(workspace.id, document.id));
    }
  };

  const titleContent = (
    <CardTitle ref={titleRef} className="text-sm truncate">
      {getPlainText(document.content?.title) || "Untitled"}
    </CardTitle>
  );

  const updatedContent = (
    <span ref={updatedRef} className="truncate">
      Updated {formatDate(document?.updated_at || "", { relative: true })}
    </span>
  );

  return (
    <Card
      key={document.id}
      className="group relative cursor-pointer transition min-h-[340px] w-full shadow-sm hover:shadow-lg hover:shadow-black/20 dark:shadow-sm dark:hover:shadow-white/20"
      onClick={handleClick}
    >
      <CardHeader className="flex flex-col p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            {isTitleTruncated ? (
              <SimpleTooltip title={getPlainText(document.content?.title)}>
                {titleContent}
              </SimpleTooltip>
            ) : (
              titleContent
            )}
            <CardDescription className="text-xs flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
              {document.folder?.name && (
                <span className="flex items-center gap-1 shrink-0">
                  <Folder className="w-3 h-3" />
                  <span className="truncate">{document.folder?.name} •</span>
                </span>
              )}
              {isUpdatedTruncated ? (
                <SimpleTooltip
                  title={`Updated ${formatDate(document?.updated_at || "", {
                    relative: false,
                  })}`}
                >
                  {updatedContent}
                </SimpleTooltip>
              ) : (
                updatedContent
              )}
            </CardDescription>
          </div>
          <DocumentMoreMenu documentId={document.id} />
        </div>
        <Separator className="mt-2" />
      </CardHeader>
      <CardContent className="flex flex-col px-4 truncate text-xs text-muted-foreground">
        {document.sub_blocks.map((block) => {
          return (
            <p key={block.id} className="truncate">
              {getPlainText(block.content?.text) || ""}
            </p>
          );
        })}
      </CardContent>
    </Card>
  );
};

const getPlainText = (html?: string | null) => {
  if (!html) {
    return "";
  }
  if (typeof window !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }
  return html.replace(/<[^>]*>/g, "");
};
