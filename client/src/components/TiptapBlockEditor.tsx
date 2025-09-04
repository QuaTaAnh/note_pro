"use client";

import { useDocumentBlocks } from "@/hooks";
import { TiptapWrapper } from "./TiptapWrapper";
import { PageLoading } from "./ui/loading";
import { DocumentTitleInput } from "@/components/page/DocumentTitleInput";
import { BlockList } from "@/components/page/BlockList";
import { Separator } from "./ui/separator";

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
  } = useDocumentBlocks(pageId);

  return loading || !rootBlock ? (
    <PageLoading />
  ) : (
    <div className={`max-w-full mx-auto px-2 md:px-4 lg:px-6 ${className}`}>
      <div className="mx-auto max-w-full border rounded-xl overflow-hidden">
        <div className="h-[calc(100vh-80px)] overflow-y-auto p-8 md:p-10 lg:p-12">
          <DocumentTitleInput
            value={(rootBlock.content?.title as string) || ""}
            onChange={handleUpdateTitle}
          />
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
            />
          </TiptapWrapper>
        </div>
      </div>
    </div>
  );
}
