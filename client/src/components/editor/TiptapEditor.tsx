"use client";

import { BlockType } from "@/types/types";
import Highlight from "@tiptap/extension-highlight";
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
import { EditorBubbleMenu } from "./EditorBubbleMenu";
import Link from "@tiptap/extension-link";
import { CustomCode } from "@/lib/customCodeTiptap";
import { GripVertical } from "lucide-react";

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
      editorProps: {
        handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
          if (
            !isTitle &&
            event.key === "Enter" &&
            !event.shiftKey &&
            onAddBlock
          ) {
            event.preventDefault();
            if (onSaveImmediate) onSaveImmediate();
            onAddBlock(position + 1, BlockType.PARAGRAPH);
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
            } as React.KeyboardEvent;
            onKeyDown(reactEvent);
          }

          return false;
        },
        attributes: {
          class: isTitle
            ? `text-xl font-bold w-full bg-transparent border-none outline-none resize-none ${className}`
            : className,
          style: isTitle ? "line-height: 1.2;" : undefined,
        },
      },
    }),
    [
      value,
      onFocus,
      onBlur,
      onChange,
      onAddBlock,
      onSaveImmediate,
      position,
      onKeyDown,
      className,
      placeholder,
      isTitle,
    ]
  );

  const editor = useEditor(editorConfig as UseEditorOptions);

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

  if (!editor) {
    return null;
  }

  return isTitle ? (
    <div className="relative">
      {showBubbleMenu && <EditorBubbleMenu editor={editor} />}
      <EditorContent editor={editor} className={editorClassName} />
    </div>
  ) : (
    <div
      className={`group relative flex items-center gap-1 px-2 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors min-h-[36px] ${
        isFocused ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
      style={{ boxShadow: isFocused ? "0 0 0 2px #3b82f6" : undefined }}
    >
      <span
        className="flex items-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity"
        style={{ minWidth: 24, minHeight: 24 }}
      >
        <button
          tabIndex={-1}
          type="button"
          aria-label="Drag block"
          className="flex items-center text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing p-1 rounded focus:outline-none"
          style={{ background: "none", border: "none" }}
        >
          {dragHandle || <GripVertical size={16} />}
        </button>
      </span>
      <div className="flex-1 min-w-0 overflow-hidden">
        {showBubbleMenu && <EditorBubbleMenu editor={editor} />}
        <EditorContent editor={editor} className={editorClassName} />
      </div>
      {onDeleteBlock && (
        <button
          onClick={handleDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 mt-1"
          title="Delete block"
        >
          <svg
            className="w-3 h-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      )}
    </div>
  );
};
