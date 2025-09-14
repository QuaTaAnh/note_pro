"use client";

import { DocumentMoreMenu } from "@/components/page/DocumentMoreMenu";
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
import React, { useEffect } from "react";

const getPlainText = (html?: string | null) => {
  if (!html) return "";
  if (typeof window !== "undefined") {
    const doc = new DOMParser().parseFromString(html, "text/html");
    return doc.body.textContent || "";
  }
  return html.replace(/<[^>]*>/g, "");
};

const CardDocumentComponent = ({ document }: { document: Document }) => {
  const router = useRouter();
  const { workspace } = useWorkspace();

  const plainTitle = getPlainText(document.content?.title) || "Untitled";

  useEffect(() => {
    if (!workspace?.id) return;
    const href = document.folder?.id
      ? ROUTES.WORKSPACE_DOCUMENT_FOLDER(
          workspace.id,
          document.folder.id,
          document.id
        )
      : ROUTES.WORKSPACE_DOCUMENT(workspace.id, document.id);
    router.prefetch(href);
  }, [workspace?.id, document.folder?.id, document.id, router]);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!workspace?.id) return;

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

  return (
    <Card
      key={document.id}
      className="group relative cursor-pointer transition min-h-[340px] w-full shadow-sm hover:shadow-lg hover:shadow-black/20 dark:shadow-sm dark:hover:shadow-white/20"
      onClick={handleClick}
    >
      <CardHeader className="flex flex-col p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm truncate">{plainTitle}</CardTitle>
            <CardDescription className="text-xs flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
              {document.folder?.name && (
                <span className="flex items-center gap-1 shrink-0">
                  <Folder className="w-3 h-3" />
                  <span className="truncate">{document.folder?.name} •</span>
                </span>
              )}
              <span className="truncate">
                Updated{" "}
                {formatDate(document?.updated_at || "", { relative: true })}
              </span>
            </CardDescription>
          </div>
          <DocumentMoreMenu documentId={document.id} />
        </div>
        <Separator className="mt-2" />
      </CardHeader>
      <CardContent className="flex flex-col px-4 truncate text-xs text-muted-foreground">
        {document.sub_blocks.map((block) => (
          <p key={block.id} className="truncate">
            {getPlainText(block.content?.text) || ""}
          </p>
        ))}
      </CardContent>
    </Card>
  );
};

export const CardDocument = React.memo(CardDocumentComponent);
