'use client';

import { Task } from '@/types/app';
import { BlockType } from '@/types/types';
import { EditorContent, useEditor, UseEditorOptions } from '@tiptap/react';
import {
    useCallback,
    useEffect,
    useRef,
    useState,
    memo,
    lazy,
    Suspense,
} from 'react';
import { useEditorRefs } from '../hooks/useEditorRefs';
import { useEditorConfig } from '../hooks/useEditorConfig';
import { useSlashCommand } from '../hooks/useSlashCommand';
import { EditorContainer } from '../EditorContainer';

const EditorBubbleMenu = lazy(() =>
    import('../EditorBubbleMenu').then((mod) => ({
        default: mod.EditorBubbleMenu,
    }))
);

interface TiptapEditorProps {
    blockId?: string;
    value: string;
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onKeyDown?: (e: React.KeyboardEvent) => void;
    className?: string;
    editorClassName?: string;
    showBubbleMenu?: boolean;
    isFocused?: boolean;
    position?: number;
    onAddBlock?: (
        position: number,
        type: BlockType,
        content?: Record<string, unknown>
    ) => void;
    onSaveImmediate?: () => void;
    onDeleteBlock?: () => void;
    onInsertAbove?: () => void;
    onInsertBelow?: () => void;
    isTitle?: boolean;
    isTask?: boolean;
    task?: Task | null;
    editable?: boolean;
    onConvertToTask?: (blockId: string) => void;
    onConvertToFile?: (
        blockId: string,
        fileData: Record<string, unknown>
    ) => void;
    onConvertToTable?: (blockId: string, tableHTML: string) => void;
    dragHandle?: React.ReactNode;
}

function useEditorContentSync(
    editor: ReturnType<typeof useEditor>,
    value: string,
    prevValueRef: React.MutableRefObject<string>
) {
    useEffect(() => {
        if (!editor || !value) return;

        if (value !== prevValueRef.current) {
            if (!editor.isFocused) {
                editor.commands.setContent(value, { emitUpdate: false });
            }
            prevValueRef.current = value;
        }
    }, [value, editor, prevValueRef]);
}

function useEditorFocus(
    editor: ReturnType<typeof useEditor>,
    isFocused: boolean
) {
    useEffect(() => {
        if (editor && isFocused) {
            requestAnimationFrame(() => {
                editor.commands.focus('end', { scrollIntoView: false });
            });
        }
    }, [editor, isFocused]);
}

function useEditableSync(
    editor: ReturnType<typeof useEditor>,
    editable: boolean
) {
    useEffect(() => {
        if (editor && editor.isEditable !== editable) {
            editor.setEditable(editable);
        }
    }, [editor, editable]);
}

function useEditorKeyboard(
    editor: ReturnType<typeof useEditor>,
    handleKeyDown: (
        view: ReturnType<typeof useEditor>['view'],
        event: KeyboardEvent
    ) => boolean,
    onKeyDown?: (e: React.KeyboardEvent) => void
) {
    useEffect(() => {
        if (!editor) return;

        const handleEditorKeyDown = (e: KeyboardEvent) => {
            if (onKeyDown) {
                onKeyDown(e as unknown as React.KeyboardEvent);
            }
            handleKeyDown(editor.view, e);
        };

        editor.view.dom.addEventListener('keydown', handleEditorKeyDown);
        return () => {
            editor.view.dom.removeEventListener('keydown', handleEditorKeyDown);
        };
    }, [editor, handleKeyDown, onKeyDown]);
}

function useEditorPropsSync(
    editor: ReturnType<typeof useEditor>,
    editorClassName: string,
    isTitle: boolean
) {
    useEffect(() => {
        if (!editor) return;

        editor.setOptions({
            editorProps: {
                attributes: {
                    class: editorClassName || '',
                    style: isTitle
                        ? 'line-height: 1.2; will-change: contents;'
                        : 'padding: 0px; will-change: contents;',
                },
            },
        });
    }, [editor, isTitle, editorClassName]);
}

export const TiptapEditor = memo(
    function TiptapEditor({
        blockId,
        value,
        onChange,
        onFocus,
        onBlur,
        onKeyDown,
        editorClassName = '',
        showBubbleMenu = false,
        isFocused = false,
        position = 0,
        onAddBlock,
        onSaveImmediate,
        onDeleteBlock,
        onInsertAbove,
        onInsertBelow,
        isTitle = false,
        isTask = false,
        task = null,
        editable = true,
        onConvertToTask,
        onConvertToFile,
        onConvertToTable,
        dragHandle,
    }: TiptapEditorProps) {
        const [isUpdating, setIsUpdating] = useState(false);
        const [isUploading, setIsUploading] = useState(false);
        const prevValueRef = useRef(value);

        const refs = useEditorRefs({
            onChange,
            onFocus,
            onBlur,
            onSaveImmediate,
            onAddBlock,
            position,
        });

        const editorConfig = useEditorConfig({
            editable,
            positionRef: refs.positionRef,
            onChangeRef: refs.onChangeRef,
            onFocusRef: refs.onFocusRef,
            onBlurRef: refs.onBlurRef,
            onSaveImmediateRef: refs.onSaveImmediateRef,
            onAddBlockRef: refs.onAddBlockRef,
            prevValueRef,
        });

        const editor = useEditor({
            ...editorConfig,
            content: value,
        } as UseEditorOptions);

        const { handleKeyDown, menus } = useSlashCommand(editor, {
            blockId,
            onConvertToTask,
            onConvertToFile,
            onConvertToTable,
            onAddBlock,
            onDeleteBlock,
            position,
            onToggleUploading: setIsUploading,
            isTitle,
        });

        useEditorContentSync(editor, value, prevValueRef);
        useEditorFocus(editor, isFocused);
        useEditableSync(editor, editable);
        useEditorKeyboard(editor, handleKeyDown, onKeyDown);
        useEditorPropsSync(editor, editorClassName, isTitle);

        const handleDelete = useCallback(() => {
            if (onDeleteBlock) {
                onDeleteBlock();
            }
        }, [onDeleteBlock]);

        if (!editor) {
            return null;
        }

        if (isTitle) {
            return (
                <div className="relative">
                    {showBubbleMenu && (
                        <Suspense fallback={null}>
                            <EditorBubbleMenu editor={editor} />
                        </Suspense>
                    )}
                    <EditorContent
                        editor={editor}
                        className={editorClassName}
                    />
                    {menus}
                </div>
            );
        }

        return (
            <EditorContainer
                blockId={blockId || ''}
                editable={editable}
                dragHandle={dragHandle}
                isTask={isTask}
                task={task || null}
                isUpdating={isUpdating || isUploading}
                setIsUpdating={setIsUpdating}
                onDeleteBlock={onDeleteBlock ? handleDelete : undefined}
                onInsertAbove={onInsertAbove}
                onInsertBelow={onInsertBelow}>
                {showBubbleMenu && (
                    <Suspense fallback={null}>
                        <EditorBubbleMenu editor={editor} />
                    </Suspense>
                )}
                <EditorContent editor={editor} className={editorClassName} />
                {menus}
            </EditorContainer>
        );
    },
    (prevProps, nextProps) => {
        const prevTask = prevProps.task;
        const nextTask = nextProps.task;
        const tasksEqual =
            prevTask?.id === nextTask?.id &&
            prevTask?.status === nextTask?.status &&
            prevTask?.block_id === nextTask?.block_id;

        return (
            prevProps.value === nextProps.value &&
            prevProps.isFocused === nextProps.isFocused &&
            prevProps.position === nextProps.position &&
            prevProps.editable === nextProps.editable &&
            prevProps.isTask === nextProps.isTask &&
            prevProps.blockId === nextProps.blockId &&
            tasksEqual
        );
    }
);
