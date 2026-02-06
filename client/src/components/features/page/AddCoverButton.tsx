'use client';

import { useRef } from 'react';
import { FiImage } from 'react-icons/fi';
import { Button } from '@/components/ui/button';

interface AddCoverButtonProps {
    onAddCover: (file: File) => void;
    isUploading: boolean;
}

export function AddCoverButton({
    onAddCover,
    isUploading,
}: AddCoverButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onAddCover(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <Button
                size="sm"
                className="gap-1 text-xs rounded-lg bg-primary-button hover:bg-primary-buttonHover"
                onClick={handleClick}
                disabled={isUploading}>
                <FiImage className="w-4 h-4" />
                {isUploading ? 'Uploading...' : 'Add cover'}
            </Button>
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </>
    );
}
