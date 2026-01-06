'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TableSizePickerProps {
    show: boolean;
    onSelect: (rows: number, cols: number) => void;
    close: () => void;
    position: { top: number; left: number };
}

const MAX_ROWS = 9;
const MAX_COLS = 9;

export const TableSizePicker = ({
    show,
    onSelect,
    close,
    position,
}: TableSizePickerProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const [hoveredCell, setHoveredCell] = useState<{
        row: number;
        col: number;
    } | null>(null);

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

    const rows = hoveredCell ? hoveredCell.row + 1 : 0;
    const cols = hoveredCell ? hoveredCell.col + 1 : 0;

    return (
        <div
            ref={ref}
            className="fixed bg-popover text-popover-foreground border border-border rounded-lg shadow-xl p-3 z-50 min-w-[240px]"
            style={{ top: position.top, left: position.left }}>
            <div className="text-xs font-semibold mb-3 text-center">
                {hoveredCell ? (
                    <span className="text-primary">
                        {rows} × {cols} Table
                    </span>
                ) : (
                    <span className="text-muted-foreground">Insert Table</span>
                )}
            </div>
            <div
                className="grid gap-[3px] p-1 bg-muted/30 rounded"
                style={{ gridTemplateColumns: `repeat(${MAX_COLS}, 1fr)` }}>
                {Array.from({ length: MAX_ROWS * MAX_COLS }).map((_, index) => {
                    const row = Math.floor(index / MAX_COLS);
                    const col = index % MAX_COLS;
                    const isHighlighted =
                        hoveredCell &&
                        row <= hoveredCell.row &&
                        col <= hoveredCell.col;

                    return (
                        <button
                            key={index}
                            onMouseEnter={() => setHoveredCell({ row, col })}
                            onClick={() => {
                                onSelect(row + 1, col + 1);
                                close();
                            }}
                            className={cn(
                                'w-5 h-5 border-2 rounded-sm transition-all duration-150',
                                isHighlighted
                                    ? 'bg-primary/90 border-primary scale-105 shadow-sm'
                                    : 'bg-background border-border/50 hover:border-primary/30 hover:bg-accent/50'
                            )}
                            title={`${row + 1} × ${col + 1}`}
                        />
                    );
                })}
            </div>
        </div>
    );
};
