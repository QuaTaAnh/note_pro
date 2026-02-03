'use client';

import { memo } from 'react';
import {
    ParagraphBlock,
    TaskBlock,
    FileBlock,
    SeparatorBlock,
    TableBlock,
    type SeparatorStyle,
} from '@/components/features/blocks';
import { Block } from '@/hooks';
import { BlockType } from '@/types/types';
import { SortableBlockItemProps } from './types';

interface BlockRendererProps extends Omit<SortableBlockItemProps, 'block'> {
    block: Block;
    dragHandle: React.ReactNode;
    task: {
        id: string;
        status: string;
        block_id: string;
    } | null;
    commonDeleteHandler?: () => void;
    commonInsertHandlers: {
        onInsertAbove: () => void;
        onInsertBelow: () => void;
    };
}

export const BlockRenderer = memo(
    function BlockRenderer({
        block,
        dragHandle,
        task,
        commonDeleteHandler,
        commonInsertHandlers,
        focusedBlockId,
        onFocus,
        onBlur,
        onChange,
        onAddBlock,
        onSaveImmediate,
        editable,
        onConvertToTask,
        onConvertToFile,
        onConvertToTable,
    }: BlockRendererProps) {
        const commonProps = {
            block,
            dragHandle,
            editable,
            onDeleteBlock: commonDeleteHandler,
            ...commonInsertHandlers,
        };

        const textBlockProps = {
            ...commonProps,
            isFocused: focusedBlockId === block.id,
            onFocus: () => onFocus(block.id),
            onBlur,
            onChange: (value: string) => onChange(block.id, value),
            onAddBlock,
            onSaveImmediate,
            onConvertToTask,
            onConvertToFile,
            onConvertToTable,
        };

        switch (block.type) {
            case BlockType.FILE:
                return <FileBlock {...commonProps} />;

            case BlockType.SEPARATOR:
                return (
                    <SeparatorBlock
                        style={
                            (block.content?.style as SeparatorStyle) ||
                            'regular'
                        }
                        dragHandle={dragHandle}
                        editable={editable}
                        onDeleteBlock={commonDeleteHandler}
                        {...commonInsertHandlers}
                    />
                );

            case BlockType.TABLE:
                return (
                    <TableBlock
                        {...commonProps}
                        isFocused={focusedBlockId === block.id}
                        onFocus={() => onFocus(block.id)}
                        onBlur={onBlur}
                        onChange={(value: string) => onChange(block.id, value)}
                        onSaveImmediate={onSaveImmediate}
                    />
                );

            case BlockType.TASK:
                return <TaskBlock {...textBlockProps} task={task} />;

            case BlockType.PARAGRAPH:
            default:
                return <ParagraphBlock {...textBlockProps} />;
        }
    },
    (prevProps, nextProps) => {
        const prevTask = prevProps.task;
        const nextTask = nextProps.task;
        const tasksEqual =
            prevTask?.id === nextTask?.id &&
            prevTask?.status === nextTask?.status;

        return (
            prevProps.block.id === nextProps.block.id &&
            prevProps.block.content?.text === nextProps.block.content?.text &&
            prevProps.block.content?.style === nextProps.block.content?.style &&
            prevProps.block.content?.fileUrl ===
                nextProps.block.content?.fileUrl &&
            prevProps.block.position === nextProps.block.position &&
            prevProps.block.type === nextProps.block.type &&
            prevProps.focusedBlockId === nextProps.focusedBlockId &&
            prevProps.editable === nextProps.editable &&
            tasksEqual
        );
    }
);
