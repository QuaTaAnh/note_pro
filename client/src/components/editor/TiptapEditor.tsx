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
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  editorClassName?: string;
  showBubbleMenu?: boolean;
  isFocused?: boolean;
  position?: number;
  onAddBlock?: (position: number, type: BlockType) => void;
  onSaveImmediate?: () => void;
  onDeleteBlock?: () => void;
  onInsertAbove?: () => void;
  onInsertBelow?: () => void;
  isTitle?: boolean;
  isTask?: boolean;
  task?: Task | null;
  editable?: boolean;
  onToggleUploading?: (isUploading: boolean) => void;
  enableFileUploads?: boolean;
}

export const TiptapEditor = memo(
  function TiptapEditor({
    value,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    placeholder = "",
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
    onToggleUploading,
    enableFileUploads = true,
    dragHandle,
  }: TiptapEditorProps & { dragHandle?: React.ReactNode }) {
    const [isUpdating, setIsUpdating] = useState(false);
    const prevValueRef = useRef(value);

    // Use stable refs for callbacks
    const refs = useEditorRefs({
      onChange,
      onFocus,
      onBlur,
      onSaveImmediate,
      onAddBlock,
    });

    // Create editor config with minimal dependencies
    const editorConfig = useEditorConfig({
      placeholder,
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
      position,
      onAddBlock,
      onToggleUploading,
      allowFileUploads: enableFileUploads,
    });

    useEffect(() => {
      if (editor && value !== prevValueRef.current) {
        const editorHTML = editor.getHTML();
        // Only update if the values are actually different
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

    // Block editor (full layout with task, drag handle, etc.)
    return (
      <EditorContainer
        editable={editable}
        dragHandle={dragHandle}
        isTask={isTask}
        task={task || null}
        isUpdating={isUpdating}
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
    return (
      prevProps.value === nextProps.value &&
      prevProps.isFocused === nextProps.isFocused &&
      prevProps.position === nextProps.position &&
      prevProps.editable === nextProps.editable &&
      prevProps.isTask === nextProps.isTask &&
      prevProps.task?.status === nextProps.task?.status &&
      prevProps.task?.id === nextProps.task?.id
    );
  }
);
