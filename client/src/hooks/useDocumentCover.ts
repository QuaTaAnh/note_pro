'use client';

import { useCallback } from 'react';
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

    const coverImage = rootBlock?.cover_image as string | undefined;

    const handleAddCover = useCallback(
        async (file: File) => {
            if (!rootBlock) return;

            const imageUrl = await uploadImage(file);
            if (imageUrl) {
                await updateBlockCoverImage(rootBlock.id, imageUrl);
            }
        },
        [uploadImage, rootBlock, updateBlockCoverImage]
    );

    const handleRemoveCover = useCallback(async () => {
        if (!rootBlock) return;

        await updateBlockCoverImage(rootBlock.id, null);
    }, [rootBlock, updateBlockCoverImage]);

    return {
        coverImage,
        handleAddCover,
        handleRemoveCover,
        isUploading,
    };
}
