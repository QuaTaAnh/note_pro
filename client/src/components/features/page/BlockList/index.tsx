'use client';

import { useCallback, useMemo, useRef } from 'react';
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

    // Store callbacks in refs to avoid re-creating SortableBlockItem props
    const callbacksRef = useRef({
        onFocus,
        onBlur,
        onChange,
        onAddBlock,
        onSaveImmediate,
        onDeleteBlock,
        onConvertToTask,
        onConvertToFile,
        onConvertToTable,
    });
    // Update refs on each render (cheap operation)
    callbacksRef.current = {
        onFocus,
        onBlur,
        onChange,
        onAddBlock,
        onSaveImmediate,
        onDeleteBlock,
        onConvertToTask,
        onConvertToFile,
        onConvertToTable,
    };

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

    // Stable callback references that delegate to refs
    const stableOnFocus = useCallback((blockId: string) => {
        callbacksRef.current.onFocus(blockId);
    }, []);

    const stableOnBlur = useCallback(() => {
        callbacksRef.current.onBlur();
    }, []);

    const stableOnChange = useCallback((blockId: string, value: string) => {
        callbacksRef.current.onChange(blockId, value);
    }, []);

    const stableOnAddBlock = useCallback(
        (
            position: number,
            type: BlockType,
            content?: Record<string, unknown>
        ) => {
            return callbacksRef.current.onAddBlock(position, type, content);
        },
        []
    );

    const stableOnSaveImmediate = useCallback(() => {
        callbacksRef.current.onSaveImmediate();
    }, []);

    const stableOnDeleteBlock = useCallback((blockId: string) => {
        callbacksRef.current.onDeleteBlock?.(blockId);
    }, []);

    const stableOnConvertToTask = useCallback((blockId: string) => {
        callbacksRef.current.onConvertToTask?.(blockId);
    }, []);

    const stableOnConvertToFile = useCallback(
        (blockId: string, fileData: Record<string, unknown>) => {
            callbacksRef.current.onConvertToFile?.(blockId, fileData);
        },
        []
    );

    const stableOnConvertToTable = useCallback(
        (blockId: string, tableHTML: string) => {
            callbacksRef.current.onConvertToTable?.(blockId, tableHTML);
        },
        []
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
                    {blocks.map((block) => (
                        <SortableBlockItem
                            key={block.id}
                            block={block}
                            focusedBlockId={focusedBlockId}
                            onFocus={stableOnFocus}
                            onBlur={stableOnBlur}
                            onChange={stableOnChange}
                            onAddBlock={stableOnAddBlock}
                            onSaveImmediate={stableOnSaveImmediate}
                            onDeleteBlock={stableOnDeleteBlock}
                            editable={editable}
                            onConvertToTask={stableOnConvertToTask}
                            onConvertToFile={stableOnConvertToFile}
                            onConvertToTable={stableOnConvertToTable}
                            totalBlocks={blocksCount}
                        />
                    ))}
                </div>
            </SortableContext>
        </DndContext>
    );
}
