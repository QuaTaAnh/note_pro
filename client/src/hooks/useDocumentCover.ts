'use client';

import { useCallback, useRef } from 'react';
import { useImageUpload } from './useImageUpload';
import { Block, useBlocks } from './useBlocks';

interface UseDocumentCoverProps {
    rootBlock: Block | null;
}

export function useDocumentCover({ rootBlock }: UseDocumentCoverProps) {
    const { uploadImage, isUploading } = useImageUpload({
        tags: ['document-cover'],
        maxSizeMB: 10,
    });
    const { updateBlockCoverImage } = useBlocks();

    // Use ref to avoid recreating callbacks when rootBlock reference changes
    const rootBlockRef = useRef(rootBlock);
    rootBlockRef.current = rootBlock;

    const coverImage = rootBlock?.cover_image as string | undefined;

    const handleAddCover = useCallback(
        async (file: File) => {
            const currentRootBlock = rootBlockRef.current;
            if (!currentRootBlock) return;

            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                await updateBlockCoverImage(currentRootBlock.id, imageUrl);
            }
        },
        [uploadImage, updateBlockCoverImage]
    );

    const handleRemoveCover = useCallback(async () => {
        const currentRootBlock = rootBlockRef.current;
        if (!currentRootBlock) return;

        await updateBlockCoverImage(currentRootBlock.id, null);
    }, [updateBlockCoverImage]);

    return {
        coverImage,
        handleAddCover,
        handleRemoveCover,
        isUploading,
    };
}
