'use client';

import { useMemo } from 'react';
import { Block } from '@/hooks';
import { useDocumentBlocksData } from '@/hooks/useDocumentBlocksData';
import { useDocumentBlocksEditing } from '@/hooks/useDocumentBlocksEditing';

export function useDocumentBlocks(pageId: string) {
    const { loading, processedBlocks, processedRootBlock } =
        useDocumentBlocksData(pageId);

    // Memoize to prevent unnecessary re-renders when reference changes but content is same
    const initialBlocks = useMemo(
        () => (processedBlocks as Block[]) ?? [],
        [processedBlocks]
    );

    const initialRootBlock = useMemo(
        () => (processedRootBlock as Block) ?? null,
        [processedRootBlock]
    );

    const editing = useDocumentBlocksEditing({
        initialBlocks,
        initialRootBlock,
        pageId,
    });

    return {
        loading,
        ...editing,
    };
}
