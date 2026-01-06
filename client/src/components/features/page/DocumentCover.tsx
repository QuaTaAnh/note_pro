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
                        variant="secondary"
                        size="sm"
                        onClick={handleChangeCover}
                        disabled={isUploading}
                        className="shadow-md hover:shadow-lg transition-shadow">
                        <FiImage className="mr-1.5 h-4 w-4" />
                        {isUploading ? 'Uploading...' : 'Change cover'}
                    </Button>
                    <Button
                        variant="secondary"
                        size="sm"
                        onClick={onRemove}
                        disabled={isUploading}
                        className="shadow-md hover:shadow-lg transition-shadow">
                        <FiX className="mr-1.5 h-4 w-4" />
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
