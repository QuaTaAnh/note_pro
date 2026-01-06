'use client';

import { useRef, useEffect, CSSProperties } from 'react';
import { ChevronDown } from 'lucide-react';
import { FaHighlighter } from 'react-icons/fa';
import { HIGHLIGHT_COLORS } from '@/lib/constants';

interface Props {
    show: boolean;
    toggle: () => void;
    onSelect: (color: string | null) => void;
    currentColor: string | null;
    isActive: boolean;
    close: () => void;
}

export const HighlightPicker = ({
    show,
    toggle,
    onSelect,
    currentColor,
    isActive,
    close,
}: Props) => {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                close();
            }
        };
        if (show) {
            document.addEventListener('mousedown', handleClickOutside);
            return () =>
                document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [show, close]);

    return (
        <div className="relative" ref={ref}>
            <button
                onClick={toggle}
                className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1">
                <div className="relative">
                    <FaHighlighter
                        className={`w-4 h-4 ${
                            isActive
                                ? 'text-blue-600'
                                : 'text-gray-600 dark:text-gray-300'
                        }`}
                    />
                    {currentColor && (
                        <div
                            className="absolute -bottom-1 left-0 w-4 h-1 rounded"
                            style={{ backgroundColor: currentColor }}
                        />
                    )}
                </div>
                <ChevronDown className="w-3 h-3 text-gray-400" />
            </button>

            {show && (
                <div className="absolute top-full left-0 mt-1 z-50 w-max rounded-lg border border-border bg-popover p-3 shadow-lg">
                    <div className="grid grid-cols-6 gap-3">
                        {HIGHLIGHT_COLORS.map((colorOption, i) => {
                            const isSelected =
                                currentColor === colorOption.value;
                            const isTransparent = colorOption.value === null;
                            const transparentStyle: CSSProperties = {
                                backgroundColor: '#f3f4f6',
                                backgroundImage:
                                    'linear-gradient(45deg, #cbd5f5 25%, transparent 25%), linear-gradient(-45deg, #cbd5f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #cbd5f5 75%), linear-gradient(-45deg, transparent 75%, #cbd5f5 75%)',
                                backgroundSize: '8px 8px',
                                backgroundPosition:
                                    '0 0, 0 4px, 4px -4px, -4px 0',
                            };

                            return (
                                <button
                                    key={i}
                                    onClick={() => {
                                        onSelect(colorOption.value);
                                        close();
                                    }}
                                    className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-transform duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ${
                                        isSelected
                                            ? 'scale-105'
                                            : 'hover:scale-105'
                                    }`}
                                    title={colorOption.name}>
                                    <span className="sr-only">
                                        {colorOption.name}
                                    </span>
                                    <span
                                        className="block h-5 w-5 rounded-full border border-black/10"
                                        style={
                                            isTransparent
                                                ? transparentStyle
                                                : {
                                                      backgroundColor:
                                                          colorOption.color,
                                                  }
                                        }
                                    />
                                    {isSelected && (
                                        <span className="pointer-events-none absolute inset-0 rounded-full border-[2.5px] border-foreground/80" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};
