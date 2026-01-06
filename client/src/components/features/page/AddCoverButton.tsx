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
                variant="ghost"
                size="sm"
                onClick={handleClick}
                disabled={isUploading}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-xs text-muted-foreground hover:text-foreground">
                <FiImage className="mr-1.5 h-3.5 w-3.5" />
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
