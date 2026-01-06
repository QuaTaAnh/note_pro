'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { BlockActionMenu } from './BlockActionMenu';

export type SeparatorStyle = 'extralight' | 'light' | 'regular' | 'strong';

interface SeparatorBlockProps {
    style: SeparatorStyle;
    dragHandle?: React.ReactNode;
    onInsertAbove?: () => void;
    onInsertBelow?: () => void;
    onDeleteBlock?: () => void;
    editable?: boolean;
}

const separatorClasses: Record<SeparatorStyle, string> = {
    strong: 'border-t-[3px] border-solid border-gray-900 dark:border-gray-100',
    regular: 'border-t-[2px] border-solid border-gray-700 dark:border-gray-300',
    light: 'border-t border-solid border-gray-400 dark:border-gray-500',
    extralight: 'border-t border-dotted border-gray-400 dark:border-gray-500',
};

export function SeparatorBlock({
    style,
    dragHandle,
    onInsertAbove,
    onInsertBelow,
    onDeleteBlock,
    editable = true,
}: SeparatorBlockProps) {
    return (
        <div className="group relative my-2 flex items-center gap-2">
            {editable && (
                <div className="text-muted-foreground">{dragHandle}</div>
            )}
            <div className={cn('flex-1', separatorClasses[style])} />
            {editable && (
                <BlockActionMenu
                    blockId=""
                    onDelete={onDeleteBlock}
                    onInsertAbove={onInsertAbove}
                    onInsertBelow={onInsertBelow}
                />
            )}
        </div>
    );
}
