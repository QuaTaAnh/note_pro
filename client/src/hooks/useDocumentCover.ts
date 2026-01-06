'use client';

import { useCallback } from 'react';
import { useImageUpload } from './useImageUpload';
import { Block } from './useBlocks';

interface UseDocumentCoverProps {
    rootBlock: Block | null;
    onUpdateContent: (content: Record<string, unknown>) => void;
}

export function useDocumentCover({
    rootBlock,
    onUpdateContent,
}: UseDocumentCoverProps) {
    const { uploadImage, isUploading } = useImageUpload({
        tags: ['document-cover'],
        maxSizeMB: 10,
    });

    const coverImage = rootBlock?.content?.coverImage as string | undefined;

    const handleAddCover = useCallback(
        async (file: File) => {
            const imageUrl = await uploadImage(file);
            if (imageUrl && rootBlock?.content) {
                onUpdateContent({
                    ...rootBlock.content,
                    coverImage: imageUrl,
                });
            }
        },
        [uploadImage, rootBlock?.content, onUpdateContent]
    );

    const handleRemoveCover = useCallback(() => {
        if (rootBlock?.content) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { coverImage, ...restContent } = rootBlock.content;
            onUpdateContent(restContent);
        }
    }, [rootBlock?.content, onUpdateContent]);

    return {
        coverImage,
        handleAddCover,
        handleRemoveCover,
        isUploading,
    };
}
