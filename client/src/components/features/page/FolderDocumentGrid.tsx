'use client';

import { CardFolder } from '@/components/features/page/CardFolder';
import { CardDocument } from '@/components/features/page/CardDocument';
import { Document } from '@/types/app';
import { GetFolderByIdQuery } from '@/graphql/queries/__generated__/folder.generated';
import { useEffect, useRef, useState, useCallback } from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';

type FolderType = NonNullable<
    GetFolderByIdQuery['folders_by_pk']
>['children'][0];

interface FolderDocumentGridProps {
    folders: FolderType[];
    documents: Document[];
}

export function FolderDocumentGrid({
    folders,
    documents,
}: FolderDocumentGridProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [showTopFade, setShowTopFade] = useState(false);
    const [showBottomFade, setShowBottomFade] = useState(false);

    const updateFade = useCallback(() => {
        const el = containerRef.current;
        if (!el) return;

        const { scrollTop, scrollHeight, clientHeight } = el;

        const canScroll = scrollHeight > clientHeight;
        if (!canScroll) {
            setShowTopFade(false);
            setShowBottomFade(false);
            return;
        }

        setShowTopFade(scrollTop > 16);
        setShowBottomFade(scrollTop + clientHeight < scrollHeight - 16);
    }, []);

    useEffect(() => {
        updateFade();
        window.addEventListener('resize', updateFade);
        return () => window.removeEventListener('resize', updateFade);
    }, [updateFade, folders.length, documents.length]);

    return (
        <div className="flex-1 w-full pb-4 pl-6 overflow-hidden relative">
            <AutoSizer>
                {({ width, height }) => (
                    <div
                        ref={containerRef}
                        onScroll={updateFade}
                        style={{ width, height }}
                        className="overflow-y-auto overflow-x-hidden pr-6">
                        {folders.length > 0 && (
                            <div className="mb-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                                    {folders.map((folder) => (
                                        <CardFolder
                                            key={folder.id}
                                            folder={folder}
                                        />
                                    ))}
                                </div>
                            </div>
                        )}

                        {documents.length > 0 && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 pb-4">
                                {documents.map((document) => (
                                    <CardDocument
                                        key={document.id}
                                        document={document}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </AutoSizer>

            {showTopFade && (
                <div className="absolute top-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-b from-background to-transparent" />
            )}

            {showBottomFade && (
                <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none bg-gradient-to-t from-background to-transparent" />
            )}
        </div>
    );
}
