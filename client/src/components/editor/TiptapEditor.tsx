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
import { useCallback, useEffect, useMemo, useState } from "react";
import { FiTrash } from "react-icons/fi";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { EditorBubbleMenu } from "./EditorBubbleMenu";
import { useSlashCommand } from "./useSlashCommand";
import { useUpdateTaskMutation } from "@/graphql/mutations/__generated__/task.generated";
import { TASK_STATUS } from "@/consts";
import { showToast } from "@/lib/toast";

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
  task?: {
    id: string;
    status: string;
    block_id: string;
  } | null;
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
}: TiptapEditorProps & { dragHandle?: React.ReactNode }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateTask] = useUpdateTaskMutation();

  const isCompleted = task?.status === TASK_STATUS.COMPLETED;

  const handleToggleComplete = async () => {
    if (!task || isUpdating) return;

    try {
      setIsUpdating(true);
      await updateTask({
        variables: {
          id: task.id,
          input: {
            status: isCompleted ? TASK_STATUS.TODO : TASK_STATUS.COMPLETED,
          },
        },
      });
      showToast.success(isCompleted ? "Task reopened" : "Task completed");
    } catch (error) {
      console.error("Failed to update task:", error);
      showToast.error("Failed to update task");
    } finally {
      setIsUpdating(false);
    }
  };

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

    const handleEditorKeyDown = (e: KeyboardEvent) => {
      if (onKeyDown) {
        onKeyDown(e as any);
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

    const handleKey = (view: EditorView, event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey) {
        if (onAddBlock) {
          const { empty } = view.state.selection;
          const { $from } = view.state.selection;
          const currentPos = $from.pos;
          const currentNodeSize = $from.node().nodeSize;

          if (empty && currentPos >= currentNodeSize - 1) {
            event.preventDefault();
            onAddBlock(position + 1, BlockType.PARAGRAPH);
            return true;
          }
        }
      }
      return false;
    };

    editor.view.setProps({
      handleKeyDown: handleKey,
    });
  }, [editor, onAddBlock, position]);

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
    <div
      className={`group relative flex items-start gap-2 p-1 rounded-md hover:bg-accent/50 transition-colors`}
      style={{ boxShadow: undefined }}
    >
      <div className="pt-0.5">{dragHandle}</div>

      {isTask && (
        <div className="flex items-center pt-1">
          <button
            onClick={handleToggleComplete}
            disabled={isUpdating}
            className={cn(
              "w-4 h-4 rounded border-2 flex items-center justify-center transition-all duration-200",
              isCompleted
                ? "bg-green-500 border-green-500 text-white"
                : "border-gray-300 hover:border-gray-400",
              isUpdating && "opacity-50 cursor-not-allowed"
            )}
          >
            {isCompleted && <Check className="w-3 h-3" />}
          </button>
        </div>
      )}

      <div className="flex-1 min-w-0 overflow-hidden">
        <div className={cn(isTask && isCompleted && "line-through opacity-60")}>
          {showBubbleMenu && <EditorBubbleMenu editor={editor} />}
          <EditorContent editor={editor} className={editorClassName} />
          {menus}
        </div>
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
