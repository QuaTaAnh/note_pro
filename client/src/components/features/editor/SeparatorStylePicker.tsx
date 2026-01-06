'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import type { SeparatorStyle } from '../page/SeparatorBlock';

interface SeparatorStylePickerProps {
    show: boolean;
    onSelect: (style: SeparatorStyle) => void;
    close: () => void;
    position: { top: number; left: number };
}

const separatorStyles: Array<{
    style: SeparatorStyle;
    label: string;
    previewClass: string;
}> = [
    {
        style: 'strong',
        label: 'Strong',
        previewClass:
            'border-t-[3px] border-solid border-gray-900 dark:border-gray-100',
    },
    {
        style: 'regular',
        label: 'Regular',
        previewClass:
            'border-t-[2px] border-solid border-gray-700 dark:border-gray-300',
    },
    {
        style: 'light',
        label: 'Light',
        previewClass:
            'border-t border-solid border-gray-400 dark:border-gray-500',
    },
    {
        style: 'extralight',
        label: 'Extralight',
        previewClass:
            'border-t border-dotted border-gray-400 dark:border-gray-500',
    },
];

export const SeparatorStylePicker = ({
    show,
    onSelect,
    close,
    position,
}: SeparatorStylePickerProps) => {
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

    useEffect(() => {
        if (!show) return;
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                e.preventDefault();
                close();
            }
        };
        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [show, close]);

    if (!show) return null;

    return (
        <div
            ref={ref}
            className="fixed bg-popover text-popover-foreground border border-border rounded-lg shadow-xl p-2 z-50 min-w-[200px]"
            style={{ top: position.top, left: position.left }}>
            <div className="text-xs font-semibold mb-2 px-2 pt-1 text-muted-foreground">
                Insert Separator
            </div>
            <div className="space-y-1">
                {separatorStyles.map(({ style, label, previewClass }) => (
                    <button
                        key={style}
                        onClick={() => {
                            onSelect(style);
                            close();
                        }}
                        className="w-full px-3 py-2.5 rounded-md hover:bg-accent transition-colors text-left group">
                        <div className="text-sm font-medium mb-1.5 text-foreground group-hover:text-primary">
                            {label}
                        </div>
                        <div className={cn('w-full', previewClass)} />
                    </button>
                ))}
            </div>
        </div>
    );
};
