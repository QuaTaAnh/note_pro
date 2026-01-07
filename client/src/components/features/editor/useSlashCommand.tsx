'use client';

import { EditorView } from '@tiptap/pm/view';
import type { Editor } from '@tiptap/react';
import { ChangeEvent, useCallback, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import { useLoading } from '@/contexts/LoadingContext';
import { SlashCommand } from './SlashCommand';
import { TableSizePicker } from './TableSizePicker';
import { SeparatorStylePicker } from './SeparatorStylePicker';
import {
    createSlashCommands,
    SLASH_MENU_KEYS,
    SLASH_TRIGGER_SUFFIXES,
} from './slash/constants';
import {
    handleFileUpload,
    handleTableInsert,
    shouldShowSlash,
} from './slash/helpers';
import type {
    SlashCommandOptions,
    CommandHandlers,
    SlashCommandState,
} from './slash/types';
import { EmojiPickerPopover } from '@/components/shared/EmojiPickerPopover';

export const useSlashCommand = (
    editor: Editor | null,
    {
        blockId,
        onToggleUploading,
        onConvertToTask,
        onConvertToFile,
        onConvertToTable,
        onAddBlock,
        onDeleteBlock,
        position = 0,
        isTitle = false,
    }: SlashCommandOptions = {}
) => {
    const [state, setState] = useState<SlashCommandState>({
        showSlash: false,
        showEmoji: false,
        showTable: false,
        showSeparator: false,
        slashPos: { top: 0, left: 0 },
        emojiPos: { top: 0, left: 0 },
        tablePos: { top: 0, left: 0 },
        separatorPos: { top: 0, left: 0 },
    });
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const { startLoading, stopLoading } = useLoading();

    const updateState = useCallback((updates: Partial<SlashCommandState>) => {
        setState((prev) => ({ ...prev, ...updates }));
    }, []);

    const getPopoverPosition = useCallback(
        (coords: {
            top: number;
            bottom: number;
            left: number;
            right: number;
        }) => ({
            top: coords.bottom + window.scrollY,
            left: coords.left + window.scrollX,
        }),
        []
    );

    const handleFileChange = useCallback(
        async (event: ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            event.target.value = '';
            if (!file) return;

            await handleFileUpload({
                file,
                blockId,
                editor,
                onAddBlock,
                onConvertToFile,
                position,
                onToggleUploading,
                startLoading,
                stopLoading,
            });
        },
        [
            blockId,
            editor,
            onAddBlock,
            onConvertToFile,
            position,
            onToggleUploading,
            startLoading,
            stopLoading,
        ]
    );

    const availableCommands = useMemo(
        () => createSlashCommands(isTitle),
        [isTitle]
    );

    const commandHandlers = useMemo<CommandHandlers>(
        () => ({
            emojis: () => {
                if (!editor) {
                    return;
                }
                const { state } = editor.view;
                const coords = editor.view.coordsAtPos(state.selection.from);
                updateState({
                    emojiPos: getPopoverPosition(coords),
                    showEmoji: true,
                });
            },
            'upload-file': () => {
                if (isTitle) {
                    return;
                }
                fileInputRef.current?.click();
            },
            'insert-table': () => {
                if (!editor) {
                    return;
                }
                const { state } = editor.view;
                const coords = editor.view.coordsAtPos(state.selection.from);
                updateState({
                    tablePos: getPopoverPosition(coords),
                    showTable: true,
                });
            },
            'insert-separator': () => {
                if (!editor) {
                    return;
                }
                const { state } = editor.view;
                const coords = editor.view.coordsAtPos(state.selection.from);
                updateState({
                    separatorPos: getPopoverPosition(coords),
                    showSeparator: true,
                });
            },
        }),
        [editor, isTitle, getPopoverPosition, updateState]
    );

    const onCommandSelect = useCallback(
        (cmd: string) => {
            if (!editor) return;

            // Delete the "/" character before executing command
            editor.commands.deleteRange({
                from: editor.state.selection.from - 1,
                to: editor.state.selection.from,
            });

            commandHandlers[cmd as keyof CommandHandlers]?.();
            updateState({ showSlash: false });
        },
        [editor, commandHandlers, updateState]
    );

    const onEmojiSelect = useCallback(
        (emoji: string) => {
            if (editor) editor.commands.insertContent(emoji);
            updateState({ showEmoji: false });
        },
        [editor, updateState]
    );

    const onTableSelect = useCallback(
        async (rows: number, cols: number) => {
            if (!editor) {
                return;
            }

            await handleTableInsert({
                rows,
                cols,
                editor,
                blockId,
                onAddBlock,
                onConvertToTable,
                position,
            });

            updateState({ showTable: false });
        },
        [editor, onAddBlock, onConvertToTable, blockId, position, updateState]
    );

    const onSeparatorSelect = useCallback(
        async (style: string) => {
            if (!onAddBlock) return;

            onAddBlock(position, 'separator' as any, { style });
            updateState({ showSeparator: false });
        },
        [onAddBlock, position, updateState]
    );

    const handleKeyDown = useCallback(
        (view: EditorView, event: KeyboardEvent) => {
            if (state.showSlash && !SLASH_MENU_KEYS.includes(event.key)) {
                updateState({ showSlash: false });
                return false;
            }

            // Check for "[] " pattern (with space) to convert to task
            if (event.key === ' ' && onConvertToTask && blockId) {
                const { state: editorState } = view;
                const { $from } = editorState.selection;
                const textBefore = $from.nodeBefore?.textContent || '';

                if (textBefore.endsWith('[]')) {
                    event.preventDefault();
                    view.dispatch(
                        editorState.tr.delete($from.pos - 2, $from.pos)
                    );
                    onConvertToTask(blockId);
                    return true;
                }
            }

            if (event.key === 'Backspace' && onDeleteBlock) {
                const { state: editorState } = view;
                const { $from } = editorState.selection;
                const textContent = editorState.doc.textContent;

                if (textContent.trim() === '' && $from.pos === 1) {
                    event.preventDefault();
                    onDeleteBlock();
                    return true;
                }
            }

            if (event.key === '/' && !event.shiftKey) {
                if (availableCommands.length === 0) {
                    return false;
                }
                const { state: editorState } = view;
                const { $from } = editorState.selection;
                const textBefore = $from.nodeBefore?.textContent || '';

                if (shouldShowSlash(textBefore, SLASH_TRIGGER_SUFFIXES)) {
                    setTimeout(() => {
                        const coords = view.coordsAtPos(
                            editorState.selection.from
                        );
                        updateState({
                            slashPos: getPopoverPosition(coords),
                            showSlash: true,
                        });
                    }, 0);
                    return false; // Allow "/" to be typed normally
                }
            }

            if (
                (state.showSlash ||
                    state.showEmoji ||
                    state.showTable ||
                    state.showSeparator) &&
                event.key === 'Escape'
            ) {
                updateState({
                    showSlash: false,
                    showEmoji: false,
                    showTable: false,
                    showSeparator: false,
                });
                return true;
            }
            return false;
        },
        [
            state.showSlash,
            state.showEmoji,
            state.showTable,
            state.showSeparator,
            availableCommands,
            onConvertToTask,
            onDeleteBlock,
            blockId,
            getPopoverPosition,
            updateState,
        ]
    );

    const menus = useMemo(
        () => (
            <>
                {!isTitle && (
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                )}
                {state.showSlash && availableCommands.length > 0 && (
                    <SlashCommand
                        show={state.showSlash}
                        onSelect={onCommandSelect}
                        close={() => updateState({ showSlash: false })}
                        position={state.slashPos}
                        commands={availableCommands}
                    />
                )}
                {state.showEmoji && (
                    <div
                        className="fixed z-50"
                        style={{
                            top: state.emojiPos.top,
                            left: state.emojiPos.left,
                        }}>
                        <EmojiPickerPopover
                            show={state.showEmoji}
                            onSelect={onEmojiSelect}
                            onClose={() => updateState({ showEmoji: false })}
                            height={350}
                        />
                    </div>
                )}
                {state.showTable && (
                    <TableSizePicker
                        show={state.showTable}
                        onSelect={onTableSelect}
                        close={() => updateState({ showTable: false })}
                        position={state.tablePos}
                    />
                )}
                {state.showSeparator && (
                    <SeparatorStylePicker
                        show={state.showSeparator}
                        onSelect={onSeparatorSelect}
                        close={() => updateState({ showSeparator: false })}
                        position={state.separatorPos}
                    />
                )}
            </>
        ),
        [
            state,
            onCommandSelect,
            onEmojiSelect,
            onTableSelect,
            onSeparatorSelect,
            handleFileChange,
            availableCommands,
            isTitle,
            updateState,
        ]
    );

    return { handleKeyDown, menus };
};
