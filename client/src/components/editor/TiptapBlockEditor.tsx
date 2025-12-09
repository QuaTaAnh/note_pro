"use client";

import { useDocumentBlocks, useDocumentPermission } from "@/hooks";
import { TiptapWrapper } from "./TiptapWrapper";
import { PageLoading } from "../ui/loading";
import { DocumentTitleInput } from "@/components/page/DocumentTitleInput";
import { BlockList } from "@/components/page/BlockList";
import { Separator } from "../ui/separator";

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
    handleConvertToFile,
  } = useDocumentBlocks(pageId);

  const { canEdit } = useDocumentPermission(pageId);

  return loading || !rootBlock ? (
    <PageLoading />
  ) : (
    <div className="relative">
      <div className={`max-w-full mx-auto ${className}`}>
        <div className="mx-auto max-w-full rounded-xl bg-card overflow-hidden border border-soft-border dark:border-border shadow-sm">
          <div className="h-[calc(100vh-100px)] overflow-y-auto">
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
                  onConvertToTask={handleConvertToTask}
                  onConvertToFile={handleConvertToFile}
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
