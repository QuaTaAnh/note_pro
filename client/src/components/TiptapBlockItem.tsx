"use client";

import { Block } from "@/hooks/use-blocks";
import CodeBlock from "@tiptap/extension-code-block";
import Link from "@tiptap/extension-link";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  Link as LinkIcon,
  MessageSquarePlus,
  MoreHorizontal,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";

interface Props {
  value: string;
  isFocused: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onUpdate: (content: Record<string, unknown>) => void;
  onDelete: () => void;
  onAddBlock: (type: string) => void;
  canDelete: boolean;
}

export const TiptapBlockItem = ({
  value,
  isFocused,
  onFocus,
  onBlur,
  onUpdate,
  onDelete,
  onAddBlock,
  canDelete,
}: Props) => {
  const [showToolbar, setShowToolbar] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Type "/" for commands',
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline cursor-pointer",
        },
      }),
      CodeBlock.configure({
        HTMLAttributes: {
          class: "bg-gray-100 p-2 rounded font-mono text-sm",
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Mention.configure({
        HTMLAttributes: {
          class: "bg-blue-100 text-blue-800 px-1 rounded",
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onUpdate({ text: editor.getHTML() });
    },
    onFocus: () => {
      onFocus();
    },
    onBlur: () => {
      onBlur();
    },
    editorProps: {
      handleKeyDown: (view, event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          onAddBlock("paragraph");
          return true;
        }
        if (event.key === "Backspace" && editor?.isEmpty) {
          event.preventDefault();
          onDelete();
          return true;
        }
        return false;
      },
      handleDOMEvents: {
        mouseup: (view) => {
          const { from, to } = view.state.selection;
          setShowToolbar(from !== to);
          return false;
        },
        keyup: (view) => {
          const { from, to } = view.state.selection;
          setShowToolbar(from !== to);
          return false;
        },
        click: (view) => {
          const { from, to } = view.state.selection;
          setShowToolbar(from !== to);
          return false;
        },
        blur: (view, event) => {
          const target = event.target as HTMLElement;
          if (toolbarRef.current && toolbarRef.current.contains(target)) {
            return false;
          }
          setShowToolbar(false);
          return false;
        },
      },
    },
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  const addLink = () => {
    const url = window.prompt("Enter URL");
    if (url && editor) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const addMention = () => {
    const mention = window.prompt("Enter mention (@username)");
    if (mention && editor) {
      editor.chain().focus().insertContent(`@${mention} `).run();
    }
  };

  const addComment = () => {
    console.log("Add comment functionality");
  };

  const addMath = () => {
    if (editor) {
      editor.chain().focus().insertContent("\\[ \\]").run();
    }
  };

  return !editor ? null : (
    <div
      className={`group relative flex items-start gap-2 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
        isFocused ? "bg-blue-50 dark:bg-blue-900/20" : ""
      }`}
    >
      <div className="flex-1 min-w-0">
        {showToolbar && (
          <div
            ref={toolbarRef}
            className="toolbar flex items-center gap-1 p-1 mb-2 bg-gray-100 dark:bg-gray-700 rounded"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().toggleBold().run();
              }}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive("bold") ? "bg-gray-200 dark:bg-gray-600" : ""
              }`}
              title="Bold"
            >
              <span className="text-sm font-bold">B</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().toggleItalic().run();
              }}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive("italic") ? "bg-gray-200 dark:bg-gray-600" : ""
              }`}
              title="Italic"
            >
              <span className="text-sm italic">I</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().toggleStrike().run();
              }}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive("strike") ? "bg-gray-200 dark:bg-gray-600" : ""
              }`}
              title="Strikethrough"
            >
              <span className="text-sm line-through">S</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                editor.chain().focus().toggleCode().run();
              }}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive("code") ? "bg-gray-200 dark:bg-gray-600" : ""
              }`}
              title="Inline code"
            >
              <span className="text-sm font-mono">&lt;&gt;</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addLink();
              }}
              className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors ${
                editor.isActive("link") ? "bg-gray-200 dark:bg-gray-600" : ""
              }`}
              title="Add link"
            >
              <LinkIcon className="w-3 h-3" />
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addMath();
              }}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Add math equation"
            >
              <span className="text-sm">✓</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addMention();
              }}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Add mention"
            >
              <span className="text-sm">@</span>
            </button>

            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                addComment();
              }}
              className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              title="Add comment"
            >
              <MessageSquarePlus className="w-3 h-3" />
            </button>
          </div>
        )}

        <EditorContent
          editor={editor}
          className="prose prose-sm max-w-none focus:outline-none text-base"
        />
      </div>

      {canDelete && (
        <button
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded text-gray-400 hover:text-red-600 dark:hover:text-red-400 mt-1"
          title="Delete block"
        >
          <MoreHorizontal className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};
