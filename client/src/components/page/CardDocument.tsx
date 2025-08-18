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
import { Document } from "@/app/types";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/hooks/use-workspace";
import { ROUTES } from "@/lib/routes";

export const CardDocument = ({ document }: { document: Document }) => {
  const router = useRouter();
  const { workspace } = useWorkspace();

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!workspace?.id) {
      return;
    }
    if (document.folder_id) {
      router.push(
        ROUTES.WORKSPACE_DOCUMENT_FOLDER(
          workspace.id,
          document.folder_id,
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
      className="group relative cursor-pointer transition min-h-[346px] md:min-w-[240px] shadow-sm hover:shadow-lg hover:shadow-black/30 dark:shadow-sm dark:hover:shadow-white/30"
      onClick={handleClick}
    >
      <CardHeader className="flex flex-col p-4">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-sm">
              {document.content?.title || "Untitled"}
            </CardTitle>
            <CardDescription className="text-xs">
              Updated{" "}
              {formatDate(document?.updated_at || "", { relative: true })}
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
