"use client";

import Placeholder from "@tiptap/extension-placeholder";
import { Editor, EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Trash2 } from "lucide-react";
import { useCallback, useEffect, useMemo } from "react";
import { BlockType } from "@/types/types";
import { EditorView } from "@tiptap/pm/view";

interface Props {
  value: string;
  isFocused: boolean;
  position: number;
  onFocus: () => void;
  onBlur: () => void;
  onChange: (value: string) => void;
  onAddBlock: (position: number, type: BlockType) => void;
  onSaveImmediate: () => void;
}

export const TiptapBlockItem = ({
  value,
  isFocused,
  position,
  onFocus,
  onBlur,
  onChange,
  onAddBlock,
  onSaveImmediate,
}: Props) => {
  const editorConfig = useMemo(
    () => ({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: 'Type "/" for commands',
        }),
      ],
      content: value,
      immediatelyRender: false,
      onFocus,
      onBlur: () => {
        onBlur();
        onSaveImmediate();
      },
      onUpdate: ({ editor }: { editor: Editor }) => {
        const content = editor.getText();
        onChange(content);
      },
      editorProps: {
        handleKeyDown: (view: EditorView, event: KeyboardEvent) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            onSaveImmediate();
            onAddBlock(position + 1, BlockType.PARAGRAPH);
            return true;
          }
          return false;
        },
      },
    }),
    [value, onFocus, onBlur, onChange, onAddBlock, onSaveImmediate, position]
  );

  const editor = useEditor(editorConfig);

  useEffect(() => {
    if (editor && value !== editor.getText()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  useEffect(() => {
    if (editor && isFocused) {
      editor.commands.focus();
    }
  }, [editor, isFocused]);

  const handleDelete = useCallback(() => {
    // TODO: Implement delete functionality
    console.log("Delete block:", position);
  }, [position]);

  return !editor ? null : (
    <div
      className={`group relative flex items-start gap-2 p-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        isFocused ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none text-base"
        />
      </div>

      <button
        onClick={handleDelete}
        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 mt-1"
        title="Delete block"
      >
        <Trash2 className="w-3 h-3" />
      </button>
    </div>
  );
};
