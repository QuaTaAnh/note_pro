'use client';

import { useCallback, useMemo } from 'react';
import {
    closestCenter,
    DndContext,
    DragEndEvent,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core';
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { Block } from '@/hooks';
import { SortableBlockItem } from './SortableBlockItem';
import { BlockType } from '@/types/types';

interface Props {
    blocks: Block[];
    focusedBlockId: string | null;
    onFocus: (blockId: string) => void;
    onBlur: () => void;
    onChange: (blockId: string, value: string) => void;
    onAddBlock: (
        position: number,
        type: BlockType,
        content?: Record<string, unknown>
    ) => Promise<void> | void;
    onSaveImmediate: () => void;
    onDeleteBlock?: (blockId: string) => void;
    onReorder?: (newBlocks: Block[]) => void;
    editable?: boolean;
    onConvertToTask?: (blockId: string) => void;
    onConvertToFile?: (
        blockId: string,
        fileData: Record<string, unknown>
    ) => void;
    onConvertToTable?: (blockId: string, tableHTML: string) => void;
}

export function BlockList({
    blocks,
    focusedBlockId,
    onFocus,
    onBlur,
    onChange,
    onAddBlock,
    onSaveImmediate,
    onDeleteBlock,
    onReorder,
    editable = true,
    onConvertToTask,
    onConvertToFile,
    onConvertToTable,
}: Props) {
    const blocksCount = blocks.length;

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        })
    );

    const handleDragEnd = useCallback(
        (event: DragEndEvent) => {
            const { active, over } = event;
            if (active.id !== over?.id) {
                const oldIndex = blocks.findIndex((b) => b.id === active.id);
                const newIndex = blocks.findIndex((b) => b.id === over?.id);
                const newBlocks = arrayMove(blocks, oldIndex, newIndex);
                if (onReorder) {
                    onReorder(newBlocks);
                }
            }
        },
        [blocks, onReorder]
    );

    const blockIds = useMemo(() => blocks.map((b) => b.id), [blocks]);

    const renderBlock = useCallback(
        (block: Block) => (
            <SortableBlockItem
                key={block.id}
                block={block}
                focusedBlockId={focusedBlockId}
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
                onAddBlock={onAddBlock}
                onSaveImmediate={onSaveImmediate}
                onDeleteBlock={onDeleteBlock}
                editable={editable}
                onConvertToTask={onConvertToTask}
                onConvertToFile={onConvertToFile}
                onConvertToTable={onConvertToTable}
                totalBlocks={blocksCount}
            />
        ),
        [
            focusedBlockId,
            onFocus,
            onBlur,
            onChange,
            onAddBlock,
            onSaveImmediate,
            onDeleteBlock,
            editable,
            onConvertToTask,
            onConvertToFile,
            onConvertToTable,
            blocksCount,
        ]
    );

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}>
            <SortableContext
                items={blockIds}
                strategy={verticalListSortingStrategy}>
                <div className="space-y-1">
                    {blocks.map((block) => renderBlock(block))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
