'use client';

import { useDocumentBlocks, useDocumentPermission } from '@/hooks';
import { TiptapWrapper } from './TiptapWrapper';
import { PageLoading } from '@/components/ui/loading';
import { DocumentTitleInput } from '@/components/features/page/DocumentTitleInput';
import { BlockList } from '@/components/features/page/BlockList';
import { Separator } from '@/components/ui/separator';
import { DocumentCover } from '@/components/features/page/DocumentCover';
import { AddCoverButton } from '@/components/features/page/AddCoverButton';
import { useDocumentCover } from '@/hooks/useDocumentCover';

interface Props {
    pageId: string;
}

export default function TiptapBlockEditor({ pageId }: Props) {
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
        handleConvertToTable,
    } = useDocumentBlocks(pageId);

    const { canEdit } = useDocumentPermission(pageId);
    const { coverImage, handleAddCover, handleRemoveCover, isUploading } =
        useDocumentCover({
            rootBlock,
        });

    return loading || !rootBlock ? (
        <PageLoading />
    ) : (
        <div className="relative h-full">
            <div className="max-w-full mx-auto w-full h-full">
                <div className="mx-auto max-w-full bg-card overflow-hidden h-full">
                    <div className="h-full overflow-y-auto">
                        {coverImage && (
                            <DocumentCover
                                imageUrl={coverImage}
                                onRemove={handleRemoveCover}
                                onChangeCover={handleAddCover}
                                isUploading={isUploading}
                            />
                        )}
                        <div className="mx-auto max-w-4xl py-16">
                            <div className="group flex flex-col gap-2">
                                {!coverImage && canEdit && (
                                    <div className="">
                                        <AddCoverButton
                                            onAddCover={handleAddCover}
                                            isUploading={isUploading}
                                        />
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <DocumentTitleInput
                                            value={
                                                rootBlock.content?.title || ''
                                            }
                                            onChange={handleUpdateTitle}
                                            editable={canEdit}
                                        />
                                    </div>
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
                                    onConvertToTable={handleConvertToTable}
                                />
                            </TiptapWrapper>
                            <div className="h-[40vh]" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
