'use client';

import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { Code, Italic, List, ListOrdered } from 'lucide-react';
import { useState, useEffect, useCallback, useRef } from 'react';
import { HiBold, HiStrikethrough, HiLinkSlash } from 'react-icons/hi2';
import { BubbleButton } from './BubbleButton';
import { LinkInput } from './LinkInput';
import { HighlightPicker } from './HighlightPicker';

interface Props {
    editor: Editor;
}

export const EditorBubbleMenu = ({ editor }: Props) => {
    const [showLinkInput, setShowLinkInput] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const [editorState, setEditorState] = useState(0);
    const bubbleMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!editor) return;

        const handleUpdate = () => {
            setEditorState((prev) => prev + 1);
        };

        editor.on('selectionUpdate', handleUpdate);
        editor.on('transaction', handleUpdate);
        editor.on('update', handleUpdate);

        return () => {
            editor.off('selectionUpdate', handleUpdate);
            editor.off('transaction', handleUpdate);
            editor.off('update', handleUpdate);
        };
    }, [editor]);

    const isMarkActive = useCallback(
        (type: string) => {
            if (!editor) return false;
            return editor.isActive(type);
        },
        [editor, editorState]
    );

    const getCurrentHighlightColor = useCallback(() => {
        if (!editor) return null;
        const attributes = editor.getAttributes('highlight');
        return attributes.color || null;
    }, [editor, editorState]);

    return !editor ? null : (
        <BubbleMenu
            editor={editor}
            options={{ placement: 'top-start', offset: 8, flip: true }}>
            <div
                ref={bubbleMenuRef}
                className="bg-card dark:bg-black border border-gray-200 dark:border-gray-700 shadow-md rounded-lg flex items-center gap-1 p-1">
                <BubbleButton
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    isActive={isMarkActive('bold')}>
                    <HiBold className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    isActive={isMarkActive('italic')}>
                    <Italic className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    isActive={isMarkActive('strike')}>
                    <HiStrikethrough className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() => editor.chain().focus().toggleCode().run()}
                    isActive={isMarkActive('code')}>
                    <Code className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                    isActive={isMarkActive('bulletList')}>
                    <List className="w-4 h-4" />
                </BubbleButton>

                <BubbleButton
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    isActive={isMarkActive('orderedList')}>
                    <ListOrdered className="w-4 h-4" />
                </BubbleButton>

                <HighlightPicker
                    show={showColorPicker}
                    toggle={() => setShowColorPicker(!showColorPicker)}
                    close={() => setShowColorPicker(false)}
                    onSelect={(color) =>
                        color
                            ? editor
                                  .chain()
                                  .focus()
                                  .setHighlight({ color })
                                  .run()
                            : editor.chain().focus().unsetHighlight().run()
                    }
                    currentColor={getCurrentHighlightColor()}
                    isActive={isMarkActive('highlight')}
                />

                {!showLinkInput ? (
                    <BubbleButton
                        onClick={() => setShowLinkInput(true)}
                        isActive={isMarkActive('link')}>
                        <HiLinkSlash className="w-4 h-4" />
                    </BubbleButton>
                ) : (
                    <LinkInput
                        onSubmit={(url) => {
                            if (url === '') {
                                editor.chain().focus().unsetLink().run();
                            } else {
                                editor
                                    .chain()
                                    .focus()
                                    .setLink({ href: url })
                                    .run();
                            }
                            setShowLinkInput(false);
                        }}
                        onCancel={() => setShowLinkInput(false)}
                    />
                )}
            </div>
        </BubbleMenu>
    );
};
