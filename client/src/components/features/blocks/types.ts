import { Block } from '@/hooks';
import { BlockType } from '@/types/types';
import { ReactNode } from 'react';

export interface BaseBlockProps {
    block: Block;
    dragHandle?: ReactNode;
    editable?: boolean;
    onDeleteBlock?: () => void;
    onInsertAbove?: () => void;
    onInsertBelow?: () => void;
}

export interface TextBlockProps extends BaseBlockProps {
    isFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    onChange: (value: string) => void;
    onAddBlock: (
        position: number,
        type: BlockType,
        content?: Record<string, unknown>
    ) => Promise<void> | void;
    onSaveImmediate: () => void;
    onConvertToTask?: (blockId: string) => void;
    onConvertToFile?: (
        blockId: string,
        fileData: Record<string, unknown>
    ) => void;
    onConvertToTable?: (blockId: string, tableHTML: string) => void;
}

export interface TaskBlockProps extends TextBlockProps {
    task: {
        id: string;
        status: string;
        block_id: string;
    } | null;
}

export type FileBlockProps = BaseBlockProps;

export interface SeparatorBlockProps {
    style: 'extralight' | 'light' | 'regular' | 'strong';
    dragHandle?: ReactNode;
    editable?: boolean;
    onDeleteBlock?: () => void;
    onInsertAbove?: () => void;
    onInsertBelow?: () => void;
}

export interface TableBlockProps extends BaseBlockProps {
    isFocused: boolean;
    onFocus: () => void;
    onBlur: () => void;
    onChange: (value: string) => void;
    onSaveImmediate: () => void;
}
