import { BlockType } from '@/types/types';
import type { EditorView } from '@tiptap/pm/view';
import type { ReactElement } from 'react';

export interface SlashCommandOptions {
    blockId?: string;
    onToggleUploading?: (isUploading: boolean) => void;
    onConvertToTask?: (blockId: string) => Promise<void> | void;
    onConvertToFile?: (
        blockId: string,
        fileData: Record<string, unknown>
    ) => Promise<void> | void;
    onConvertToTable?: (
        blockId: string,
        tableHTML: string
    ) => Promise<void> | void;
    onAddBlock?: (
        position: number,
        type: BlockType,
        content?: Record<string, unknown>
    ) => Promise<void> | void;
    onDeleteBlock?: () => void;
    position?: number;
    isTitle?: boolean;
}

export interface CommandHandlers {
    emojis: () => void;
    'upload-file': () => void;
    'insert-table': () => void;
    'insert-separator': () => void;
}

export interface SlashCommandState {
    showSlash: boolean;
    showEmoji: boolean;
    showTable: boolean;
    showSeparator: boolean;
    slashPos: { top: number; left: number };
    emojiPos: { top: number; left: number };
    tablePos: { top: number; left: number };
    separatorPos: { top: number; left: number };
}

export interface SlashCommandHookReturn {
    handleKeyDown: (view: EditorView, event: KeyboardEvent) => boolean;
    menus: ReactElement;
}
