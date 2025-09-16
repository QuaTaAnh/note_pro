"use client";

import { CustomCode } from "@/lib/customCodeTiptap";
import { BlockType } from "@/types/types";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorView } from "@tiptap/pm/view";
import {
  Editor,
  EditorContent,
  useEditor,
  UseEditorOptions,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useCallback, useEffect, useMemo } from "react";
import { FiTrash } from "react-icons/fi";
import { Button } from "../ui/button";
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
  dragHandle,
}: TiptapEditorProps & { dragHandle?: React.ReactNode }) => {
  const editorConfig = useMemo(
    () => ({
      extensions: [
        StarterKit.configure({
          code: false,
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
      ],
      content: value,
      immediatelyRender: false,
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
    [value, onFocus, onBlur, onChange, onSaveImmediate, placeholder]
  );

  const editor = useEditor(editorConfig as UseEditorOptions);
  const { handleKeyDown, menus } = useSlashCommand(editor);

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

  const handleDelete = useCallback(() => {
    if (onDeleteBlock) {
      onDeleteBlock();
    }
  }, [onDeleteBlock]);

  useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
          const handled = handleKeyDown(view, event);
          if (handled) return true;

          if (
            !isTitle &&
            event.key === "Enter" &&
            !event.shiftKey &&
            onAddBlock
          ) {
            event.preventDefault();
            if (onSaveImmediate) onSaveImmediate();
            onAddBlock((position ?? 0) + 1, BlockType.PARAGRAPH);
            return true;
          }

          if (isTitle && onKeyDown) {
            const reactEvent = {
              key: event.key,
              code: event.code,
              shiftKey: event.shiftKey,
              ctrlKey: event.ctrlKey,
              altKey: event.altKey,
              metaKey: event.metaKey,
              preventDefault: () => event.preventDefault(),
              stopPropagation: () => event.stopPropagation(),
            } as unknown as React.KeyboardEvent;
            onKeyDown(reactEvent);
          }

          return false;
        },
        attributes: {
          class: isTitle
            ? `text-xl font-bold w-full bg-transparent border-none outline-none resize-none ${className}`
            : className,
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
  ]);

  if (!editor) {
    return null;
  }

  return isTitle ? (
    <div className="relative">
      {showBubbleMenu && <EditorBubbleMenu editor={editor} />}
      <EditorContent editor={editor} className={editorClassName} />
      {menus}
    </div>
  ) : (
    <div
      className={`group relative flex items-start gap-2 p-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors${
        isFocused ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
      style={{ boxShadow: isFocused ? "0 0 0 2px #3b82f6" : undefined }}
    >
      <div className="pt-0.5">{dragHandle}</div>
      <div className="flex-1 min-w-0 overflow-hidden">
        {showBubbleMenu && <EditorBubbleMenu editor={editor} />}
        <EditorContent editor={editor} className={editorClassName} />
        {menus}
      </div>
      {onDeleteBlock && (
        <Button
          variant="ghost"
          size="icon"
          className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 mt-1"
          onClick={handleDelete}
        >
          <FiTrash size={12} />
        </Button>
      )}
    </div>
  );
};
