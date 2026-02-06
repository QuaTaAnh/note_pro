'use client';

import { FolderDocumentGrid } from '@/components/features/page/FolderDocumentGrid';
import { Button } from '@/components/ui/button';
import { PageLoading } from '@/components/ui/loading';
import { useGetFolderByIdQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useCreateDocument } from '@/hooks';
import { Document } from '@/types/app';
import { useMemo } from 'react';
import { FiFilePlus } from 'react-icons/fi';
import { useParams } from 'next/navigation';

export default function FolderPage() {
    const params = useParams();
    const folderId = params.folderId as string;
    const { createNewDocument, isCreating, canCreate } = useCreateDocument({
        folderId,
    });

    const { loading, data } = useGetFolderByIdQuery({
        variables: { folderId },
        skip: !folderId,
        fetchPolicy: 'cache-and-network',
    });

    const folder = data?.folders_by_pk;
    const subFolders = useMemo(() => folder?.children || [], [folder]);
    const documents: Document[] = useMemo(() => folder?.blocks || [], [folder]);

    if (loading && !folder) {
        return <PageLoading />;
    }

    if (!folder) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Folder not found</p>
            </div>
        );
    }

    return (
        <div className="p-0 w-full h-full">
            <div className="flex flex-col items-start justify-start mx-auto w-full h-full min-h-0 max-w-screen-2xl gap-6">
                <div className="w-full pt-4 px-6 flex items-center justify-between">
                    <h1 className="text-xl font-medium">{folder.name}</h1>
                    <Button
                        size="sm"
                        className="gap-2 text-xs text-white rounded-lg bg-primary"
                        onClick={createNewDocument}
                        disabled={!canCreate || isCreating}>
                        <FiFilePlus className="w-4 h-4" />
                        New Doc
                    </Button>
                </div>

                {subFolders.length === 0 && documents.length === 0 ? (
                    <div className="text-sm text-muted-foreground flex items-center justify-center w-full h-full">
                        This folder is empty
                    </div>
                ) : (
                    <FolderDocumentGrid
                        folders={subFolders}
                        documents={documents}
                    />
                )}
            </div>
        </div>
    );
}
