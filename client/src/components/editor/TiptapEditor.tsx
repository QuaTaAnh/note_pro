"use client";

import { TASK_STATUS } from "@/consts";
import { CustomCode } from "@/lib/customCodeTiptap";
import { EnterHandler } from "@/lib/enterHandler";
import { PasteHandler } from "@/lib/pasteHandler";
import { cn } from "@/lib/utils";
import { Task } from "@/types/app";
import { BlockType } from "@/types/types";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import {
  Editor,
  EditorContent,
  useEditor,
  UseEditorOptions,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BlockActionMenu } from "@/components/page/BlockActionMenu";
import { CheckTask } from "./CheckTask";
import { EditorBubbleMenu } from "./EditorBubbleMenu";
import { useSlashCommand } from "./useSlashCommand";

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
  isTitle?: boolean;
  isTask?: boolean;
  task?: Task | null;
  editable?: boolean;
  onToggleUploading?: (isUploading: boolean) => void;
  enableFileUploads?: boolean;
}

export const TiptapEditor = ({
  value,
  onChange,
  onFocus,
  onBlur,
  onKeyDown,
  placeholder = 'Type "/" for commands',
  className = "",
  editorClassName,
  showBubbleMenu = true,
  isFocused = false,
  position = 0,
  onAddBlock,
  onSaveImmediate,
  onDeleteBlock,
  isTitle = false,
  isTask = false,
  task,
  dragHandle,
  editable = true,
  onToggleUploading,
  enableFileUploads = true,
}: TiptapEditorProps & { dragHandle?: React.ReactNode }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const isCompleted = task?.status === TASK_STATUS.COMPLETED;

  const editorConfig = useMemo(
    () => ({
      extensions: [
        StarterKit.configure({
          code: false,
          bulletList: {
            keepMarks: true,
            keepAttributes: false,
          },
          orderedList: {
            keepMarks: true,
            keepAttributes: false,
          },
        }),
        CustomCode,
        Underline,
        Highlight.configure({
          multicolor: true,
        }),
        Link.configure({
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
        }),
        Placeholder.configure({
          placeholder,
        }),
        EnterHandler.configure({
          onAddBlock,
          position,
        }),
        PasteHandler,
      ],
      content: value,
      immediatelyRender: false,
      editable,
      onFocus,
      onBlur: () => {
        if (onBlur) onBlur();
        if (onSaveImmediate) onSaveImmediate();
      },
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getHTML();
        onChange(content);
      },
    }),
    [
      value,
      onFocus,
      onBlur,
      onChange,
      onSaveImmediate,
      placeholder,
      editable,
      onAddBlock,
      position,
    ]
  );

  const editor = useEditor(editorConfig as UseEditorOptions);
  const { handleKeyDown, menus } = useSlashCommand(editor, {
    position,
    onAddBlock,
    onToggleUploading,
    allowFileUploads: enableFileUploads,
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
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
    <div className="group relative flex items-start gap-2">
      {editable && (
        <div className="pt-2 text-muted-foreground">{dragHandle}</div>
      )}
      <div
        data-editor-container
        className="flex flex-1 items-start gap-3 p-1 rounded 
border border-transparent
    hover:border-gray-300
    focus-within:border-gray-300
    transition-all duration-200 hover:shadow-md"
      >
        <CheckTask
          editable={editable}
          task={task as Task}
          isTask={isTask}
          isCompleted={isCompleted}
          isUpdating={isUpdating}
          setIsUpdating={setIsUpdating}
        />

        <div className="flex-1 min-w-0 overflow-hidden">
          <div
            className={cn(isTask && isCompleted && "line-through opacity-60")}
          >
            {showBubbleMenu && <EditorBubbleMenu editor={editor} />}
            <EditorContent editor={editor} className={editorClassName} />
            {menus}
          </div>
        </div>
      </div>
      {onDeleteBlock && editable && (
        <div className="ml-1 flex-shrink-0 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <BlockActionMenu onDelete={handleDelete} />
        </div>
      )}
    </div>
  );
};
