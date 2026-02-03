'use client';

import { memo } from 'react';
import { cn } from '@/lib/utils';
import type { Command } from './types';

interface SlashCommandItemProps {
    command: Command;
    isActive: boolean;
    onSelect: (commandId: string) => void;
    onMouseEnter: () => void;
}

export const SlashCommandItem = memo(function SlashCommandItem({
    command,
    isActive,
    onSelect,
    onMouseEnter,
}: SlashCommandItemProps) {
    const Icon = command.icon;

    return (
        <button
            role="option"
            aria-selected={isActive}
            data-active={isActive}
            onMouseEnter={onMouseEnter}
            onClick={() => onSelect(command.id)}
            className={cn(
                'w-full flex items-center gap-1 rounded px-2 py-1.5 text-xs text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-0 ring-offset-background',
                isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'hover:bg-accent/60 hover:text-accent-foreground'
            )}>
            <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
            </div>
            <span className="truncate">{command.name}</span>
        </button>
    );
});
