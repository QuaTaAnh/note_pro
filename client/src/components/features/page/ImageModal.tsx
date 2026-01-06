'use client';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import {
    Download,
    Maximize2,
    Minimize2,
    X,
    ZoomIn,
    ZoomOut,
} from 'lucide-react';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl: string;
    fileName: string;
}

export function ImageModal({
    isOpen,
    onClose,
    imageUrl,
    fileName,
}: ImageModalProps) {
    const [zoom, setZoom] = useState(1);
    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                } else {
                    onClose();
                }
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            setZoom(1);
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
        };
    }, [isOpen, onClose]);

    useEffect(() => {
        const handleFullscreenChange = () => {
            setIsFullscreen(!!document.fullscreenElement);
        };

        document.addEventListener('fullscreenchange', handleFullscreenChange);
        return () => {
            document.removeEventListener(
                'fullscreenchange',
                handleFullscreenChange
            );
        };
    }, []);

    const handleDownload = useCallback(async () => {
        try {
            const response = await fetch(imageUrl);
            if (!response.ok) throw new Error('Failed to download image');

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = fileName || 'image.jpg';
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(blobUrl);
            toast.success('Image downloaded successfully');
        } catch (error) {
            console.error('Error downloading image:', error);
            toast.error('Failed to download image');
            window.open(imageUrl, '_blank', 'noopener,noreferrer');
        }
    }, [imageUrl, fileName]);

    const handleZoomIn = useCallback(() => {
        setZoom((prev) => Math.min(prev + 0.25, 3));
    }, []);

    const handleZoomOut = useCallback(() => {
        setZoom((prev) => Math.max(prev - 0.25, 0.5));
    }, []);

    const handleZoomReset = useCallback(() => {
        setZoom(1);
    }, []);

    const handleFullscreen = useCallback(async () => {
        const modalElement = document.querySelector(
            '[data-image-modal-content]'
        );
        if (!modalElement) return;

        try {
            if (!document.fullscreenElement) {
                await modalElement.requestFullscreen();
            } else {
                await document.exitFullscreen();
            }
        } catch (error) {
            toast.error('Fullscreen not supported');
        }
    }, []);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent
                className="max-w-[95vw] w-[95vw] h-[95vh] p-0 overflow-hidden bg-black/95 [&>button]:hidden border-0 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=open]:duration-300 data-[state=closed]:duration-200"
                data-image-modal-content>
                <DialogTitle className="sr-only">{fileName}</DialogTitle>
                <div className="absolute top-4 left-4 right-4 z-50 flex items-center justify-between animate-in fade-in-50 slide-in-from-top-2 duration-300 delay-150">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDownload}
                            className="rounded-lg border border-white/20 bg-black/50 p-1 text-white transition-colors hover:bg-black/70 hover:border-white/40 focus:outline-none"
                            aria-label="Download image"
                            title="Download">
                            <Download size={20} />
                        </button>
                        <button
                            onClick={handleZoomOut}
                            disabled={zoom <= 0.5}
                            className="rounded-lg border border-white/20 bg-black/50 p-1 text-white transition-colors hover:bg-black/70 hover:border-white/40 focus:outline-none  disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Zoom out"
                            title="Zoom out">
                            <ZoomOut size={20} />
                        </button>
                        <button
                            onClick={handleZoomReset}
                            className="rounded-lg border border-white/20 bg-black/50 px-2 py-1 text-sm font-medium text-white transition-colors hover:bg-black/70 hover:border-white/40 focus:outline-none "
                            aria-label="Reset zoom"
                            title="Reset zoom">
                            {Math.round(zoom * 100)}%
                        </button>
                        <button
                            onClick={handleZoomIn}
                            disabled={zoom >= 3}
                            className="rounded-lg border border-white/20 bg-black/50 p-1 text-white transition-colors hover:bg-black/70 hover:border-white/40 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-label="Zoom in"
                            title="Zoom in">
                            <ZoomIn size={20} />
                        </button>
                        <button
                            onClick={handleFullscreen}
                            className="rounded-lg border border-white/20 bg-black/50 p-1 text-white transition-colors hover:bg-black/70 hover:border-white/40 focus:outline-none"
                            aria-label={
                                isFullscreen
                                    ? 'Exit fullscreen'
                                    : 'Enter fullscreen'
                            }
                            title={
                                isFullscreen ? 'Exit fullscreen' : 'Fullscreen'
                            }>
                            {isFullscreen ? (
                                <Minimize2 size={20} />
                            ) : (
                                <Maximize2 size={20} />
                            )}
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-lg border border-white/20 bg-black/50 p-1 text-white transition-colors hover:bg-black/70 hover:border-white/40 focus:outline-none"
                        aria-label="Close modal"
                        title="Close">
                        <X size={24} />
                    </button>
                </div>

                <div className="relative flex h-full w-full items-center justify-center p-8 overflow-auto animate-in fade-in-50 zoom-in-95 duration-500 delay-100">
                    <div
                        className="transition-transform duration-300 ease-out"
                        style={{
                            transform: `scale(${zoom})`,
                            cursor: zoom > 1 ? 'grab' : 'default',
                        }}>
                        <Image
                            src={imageUrl}
                            alt={fileName}
                            width={1920}
                            height={1080}
                            className="max-h-[85vh] w-auto object-contain"
                            priority
                            unoptimized
                            draggable={false}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
