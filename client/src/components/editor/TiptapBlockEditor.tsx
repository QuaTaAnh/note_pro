"use client";

import { useDocumentBlocks } from "@/hooks";
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
  } = useDocumentBlocks(pageId);

  return loading || !rootBlock ? (
    <PageLoading />
  ) : (
    <div className={`max-w-full mx-auto px-2 md:px-4 lg:px-6 ${className}`}>
      <div className="mx-auto max-w-full border rounded-xl overflow-hidden bg-card-document">
        <div className="h-[calc(100vh-80px)] overflow-y-auto">
          <div className="mx-auto py-16 px-8 md:px-10 lg:px-12">
            <DocumentTitleInput
              value={rootBlock.content?.title || ""}
              onChange={handleUpdateTitle}
              placeholder="Page Title"
            />
            <Separator className="my-6" />
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
              />
            </TiptapWrapper>
            <div className="h-[50vh]" />
          </div>
        </div>
      </div>
    </div>
  );
}
