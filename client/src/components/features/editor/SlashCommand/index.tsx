'use client';

import { memo, useEffect, useRef, useState, useCallback } from 'react';
import { SlashCommandItem } from './SlashCommandItem';
import type { Command } from './types';

interface SlashCommandProps {
    show: boolean;
    onSelect: (command: string) => void;
    close: () => void;
    position: { top: number; left: number };
    commands: Command[];
}

export const SlashCommand = memo(function SlashCommand({
    show,
    onSelect,
    close,
    position,
    commands,
}: SlashCommandProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useEffect(() => {
        if (!show) {
            setSelectedIndex(0);
            return;
        }
        setSelectedIndex((prev) =>
            Math.max(0, Math.min(prev, commands.length - 1))
        );
    }, [show, commands.length]);

    useEffect(() => {
        if (!show) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                close();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, [show, close]);

    // Handle keyboard navigation
    useEffect(() => {
        if (!show) return;

        const onKey = (e: KeyboardEvent) => {
            switch (e.key) {
                case 'ArrowDown':
                    e.preventDefault();
                    setSelectedIndex(
                        (i) => (i + 1) % Math.max(commands.length, 1)
                    );
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    setSelectedIndex(
                        (i) =>
                            (i - 1 + Math.max(commands.length, 1)) %
                            Math.max(commands.length, 1)
                    );
                    break;
                case 'Enter':
                    e.preventDefault();
                    const cmd = commands[selectedIndex];
                    if (cmd) {
                        onSelect(cmd.id);
                        close();
                    }
                    break;
                case 'Escape':
                    e.preventDefault();
                    close();
                    break;
            }
        };

        document.addEventListener('keydown', onKey);
        return () => document.removeEventListener('keydown', onKey);
    }, [show, commands, selectedIndex, onSelect, close]);

    const handleSelect = useCallback(
        (commandId: string) => {
            onSelect(commandId);
            close();
        },
        [onSelect, close]
    );

    if (!show || commands.length === 0) return null;

    return (
        <div
            ref={ref}
            className="fixed bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-2 z-50 w-80 max-h-96 overflow-hidden"
            style={{ top: position.top, left: position.left }}
            role="listbox"
            aria-activedescendant={commands[selectedIndex]?.id}>
            <div className="max-h-80 overflow-y-auto">
                {commands.map((cmd, idx) => (
                    <SlashCommandItem
                        key={cmd.id}
                        command={cmd}
                        isActive={idx === selectedIndex}
                        onSelect={handleSelect}
                        onMouseEnter={() => setSelectedIndex(idx)}
                    />
                ))}
            </div>
        </div>
    );
});

// Re-export types
export type { Command } from './types';
