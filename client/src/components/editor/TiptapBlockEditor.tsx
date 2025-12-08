"use client";

import { useDocumentBlocks, useDocumentPermission } from "@/hooks";
import { TiptapWrapper } from "./TiptapWrapper";
import { PageLoading } from "../ui/loading";
import { DocumentTitleInput } from "@/components/page/DocumentTitleInput";
import { BlockList } from "@/components/page/BlockList";
import { Separator } from "../ui/separator";
import { useState } from "react";

interface Props {
  pageId: string;
  className?: string;
}

export default function TiptapBlockEditor({ pageId, className = "" }: Props) {
  const {
    loading,
    blocks,
    rootBlock,
    focusedBlock,
    handleAddBlock,
    handleUpdateBlockContent,
    handleUpdateTitle,
    handleBlockFocus,
    handleBlockBlur,
    handleSaveImmediate,
    handleDeleteBlock,
    handleReorderBlocks,
    handleConvertToTask,
  } = useDocumentBlocks(pageId);

  const { canEdit } = useDocumentPermission(pageId);
  const [isUploadingFile, setIsUploadingFile] = useState(false);

  return loading || !rootBlock ? (
    <PageLoading />
  ) : (
    <div className="relative">
      {isUploadingFile && (
        <div className="fixed inset-0 z-[1000] bg-background/80 backdrop-blur-sm">
          <PageLoading text="Uploading file..." />
        </div>
      )}
      <div className={`max-w-full mx-auto ${className}`}>
        <div className="mx-auto max-w-full rounded-xl border border-border/60 bg-card shadow-xl">
          <div className="h-[calc(100vh-100px)] overflow-y-auto rounded-xl">
            <div className="mx-auto max-w-2xl py-16">
              <div className="flex items-center justify-between">
                <div className="flex-1 px-6">
                  <DocumentTitleInput
                    value={rootBlock.content?.title || ""}
                    onChange={handleUpdateTitle}
                    editable={canEdit}
                  />
                </div>
              </div>
              <Separator className="my-4" />
              <TiptapWrapper>
                <BlockList
                  blocks={blocks}
                  focusedBlockId={focusedBlock}
                  onFocus={handleBlockFocus}
                  onBlur={handleBlockBlur}
                  onChange={handleUpdateBlockContent}
                  onAddBlock={handleAddBlock}
                  onSaveImmediate={handleSaveImmediate}
                  onDeleteBlock={handleDeleteBlock}
                  onReorder={handleReorderBlocks}
                  editable={canEdit}
                  onToggleUploading={setIsUploadingFile}
                  onConvertToTask={handleConvertToTask}
                />
              </TiptapWrapper>
              <div className="h-[50vh]" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
