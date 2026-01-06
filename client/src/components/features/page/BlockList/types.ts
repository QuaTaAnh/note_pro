import { Block } from '@/hooks';
import { BlockType } from '@/types/types';

export interface SortableBlockItemProps {
    block: Block;
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
    editable?: boolean;
    onConvertToTask?: (blockId: string) => void;
    onConvertToFile?: (
        blockId: string,
        fileData: Record<string, unknown>
    ) => void;
    onConvertToTable?: (blockId: string, tableHTML: string) => void;
    totalBlocks?: number;
}
