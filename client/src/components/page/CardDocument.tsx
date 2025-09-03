"use client";

import { formatDate } from "@/lib/utils";
import React from "react";
import { DocumentMoreMenu } from "@/components/page/DocumentMoreMenu";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Document } from "@/types/app";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/hooks/use-workspace";
import { ROUTES } from "@/lib/routes";
import { Folder } from "lucide-react";

export const CardDocument = ({ document }: { document: Document }) => {
  const router = useRouter();
  const { workspace } = useWorkspace();

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

  return (
    <Card
      key={document.id}
      className="group relative cursor-pointer transition min-h-[300px] w-full shadow-sm hover:shadow-lg hover:shadow-black/30 dark:shadow-sm dark:hover:shadow-white/30"
      onClick={handleClick}
    >
      <CardHeader className="flex flex-col p-4">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-sm truncate">
              {document.content?.title || "Untitled"}
            </CardTitle>
            <CardDescription className="text-xs flex items-center gap-1 whitespace-nowrap overflow-hidden text-ellipsis">
              {document.folder?.name && (
                <div className="flex items-center gap-1 shrink-0">
                  <Folder className="w-3 h-3" />
                  <span className="truncate">{document.folder?.name} •</span>
                </div>
              )}
              <div className="truncate">
                Updated{" "}
                {formatDate(document?.updated_at || "", { relative: true })}
              </div>
            </CardDescription>
          </div>
          <DocumentMoreMenu documentId={document.id} />
        </div>
        <Separator className="mt-2" />
      </CardHeader>
      <CardContent className="flex flex-col px-4 truncate text-muted-foreground">
        {document.content?.title || ""}
      </CardContent>
    </Card>
  );
};
