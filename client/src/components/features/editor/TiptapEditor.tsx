"use client";

import { Task } from "@/types/app";
import { BlockType } from "@/types/types";
import { EditorContent, useEditor, UseEditorOptions } from "@tiptap/react";
import { useCallback, useEffect, useRef, useState, memo } from "react";
import { EditorBubbleMenu } from "./EditorBubbleMenu";
import { useSlashCommand } from "./useSlashCommand";
import { useEditorRefs } from "./hooks/useEditorRefs";
import { useEditorConfig } from "./hooks/useEditorConfig";
import { EditorContainer } from "./EditorContainer";

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
    content?: Record<string, unknown>,
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
    fileData: Record<string, unknown>,
  ) => void;
  onConvertToTable?: (blockId: string, tableHTML: string) => void;
  enableFileUploads?: boolean;
}

export const TiptapEditor = memo(
  function TiptapEditor({
    blockId,
    value,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    className = "",
    editorClassName = "",
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
    enableFileUploads = true,
    dragHandle,
  }: TiptapEditorProps & { dragHandle?: React.ReactNode }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const prevValueRef = useRef(value);

    const refs = useEditorRefs({
      onChange,
      onFocus,
      onBlur,
      onSaveImmediate,
      onAddBlock,
    });

    const editorConfig = useEditorConfig({
      editable,
      position,
      ...refs,
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
      position,
      onToggleUploading: setIsUploading,
      allowFileUploads: enableFileUploads,
    });
    useEffect(() => {
      if (editor && value !== prevValueRef.current) {
        const editorHTML = editor.getHTML();
        if (value !== editorHTML) {
          editor.commands.setContent(value, { emitUpdate: false });
          prevValueRef.current = value;
        }
      }
    }, [value, editor]);

    useEffect(() => {
      if (editor && isFocused) {
        editor.commands.focus();
      }
    }, [editor, isFocused]);

    useEffect(() => {
      if (editor && editor.isEditable !== editable) {
        editor.setEditable(editable);
      }
    }, [editor, editable]);

    const handleDelete = useCallback(() => {
      if (onDeleteBlock) {
        onDeleteBlock();
      }
    }, [onDeleteBlock]);

    useEffect(() => {
      if (!editor) return;

      const handleEditorKeyDown = (e: KeyboardEvent) => {
        if (onKeyDown) {
          onKeyDown(e as unknown as React.KeyboardEvent);
        }
        handleKeyDown(editor.view, e);
      };

      editor.view.dom.addEventListener("keydown", handleEditorKeyDown);
      return () => {
        editor.view.dom.removeEventListener("keydown", handleEditorKeyDown);
      };
    }, [editor, handleKeyDown, onKeyDown]);

    useEffect(() => {
      if (!editor) return;

      editor.setOptions({
        editorProps: {
          attributes: {
            class: editorClassName || "",
            style: isTitle ? "line-height: 1.2;" : "padding: 0px;",
          },
        },
      });
    }, [
      editor,
      handleKeyDown,
      isTitle,
      className,
      onAddBlock,
      onSaveImmediate,
      position,
      onKeyDown,
      editorClassName,
    ]);

    if (!editor) {
      return null;
    }

    if (isTitle) {
      return (
        <div className="relative">
          {showBubbleMenu && <EditorBubbleMenu editor={editor} />}
          <EditorContent editor={editor} className={editorClassName} />
          {menus}
        </div>
      );
    }

    return (
      <EditorContainer
        blockId={blockId || ""}
        editable={editable}
        dragHandle={dragHandle}
        isTask={isTask}
        task={task || null}
        isUpdating={isUpdating || isUploading}
        setIsUpdating={setIsUpdating}
        onDeleteBlock={onDeleteBlock ? handleDelete : undefined}
        onInsertAbove={onInsertAbove}
        onInsertBelow={onInsertBelow}
      >
        {showBubbleMenu && <EditorBubbleMenu editor={editor} />}
        <EditorContent editor={editor} className={editorClassName} />
        {menus}
      </EditorContainer>
    );
  },
  (prevProps, nextProps) => {
    // Deep comparison for task object
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
  },
);
