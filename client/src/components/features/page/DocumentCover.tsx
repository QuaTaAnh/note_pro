'use client';

import { useRef, useState } from 'react';
import { FiX, FiImage } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface DocumentCoverProps {
    imageUrl: string;
    onRemove: () => void;
    onChangeCover: (file: File) => void;
    isUploading?: boolean;
}

export function DocumentCover({
    imageUrl,
    onRemove,
    onChangeCover,
    isUploading,
}: DocumentCoverProps) {
    const [isHovered, setIsHovered] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleChangeCover = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onChangeCover(file);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div
            className="relative w-full h-[265px] bg-muted overflow-hidden group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <Image
                src={imageUrl}
                alt="Document cover"
                fill
                className="object-cover"
                priority
            />
            {isHovered && (
                <div className="absolute top-3 right-3 flex gap-2">
                    <Button
                        size="sm"
                        className="gap-1 text-xs rounded-lg bg-primary-button hover:bg-primary-buttonHover"
                        onClick={handleChangeCover}
                        disabled={isUploading}>
                        <FiImage className="w-4 h-4" />
                        {isUploading ? 'Uploading...' : 'Change cover'}
                    </Button>
                    <Button
                        size="sm"
                        className="gap-1 text-xs rounded-lg bg-primary-button hover:bg-primary-buttonHover"
                        onClick={onRemove}
                        disabled={isUploading}>
                        <FiX className="w-4 h-4" />
                        Remove cover
                    </Button>
                </div>
            )}
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
}
