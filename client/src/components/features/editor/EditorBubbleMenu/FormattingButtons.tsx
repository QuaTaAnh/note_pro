'use client';

import { memo, useCallback } from 'react';
import { Editor } from '@tiptap/react';
import { Code, Italic, List, ListOrdered } from 'lucide-react';
import { HiBold, HiStrikethrough } from 'react-icons/hi2';
import { BubbleButton } from '../BubbleButton';

interface Props {
    editor: Editor;
    isMarkActive: (type: string) => boolean;
}

interface ButtonConfig {
    type: string;
    icon: React.ReactNode;
    action: (editor: Editor) => void;
}

const FORMATTING_BUTTONS: ButtonConfig[] = [
    {
        type: 'bold',
        icon: <HiBold className="w-4 h-4" />,
        action: (editor) => editor.chain().focus().toggleBold().run(),
    },
    {
        type: 'italic',
        icon: <Italic className="w-4 h-4" />,
        action: (editor) => editor.chain().focus().toggleItalic().run(),
    },
    {
        type: 'strike',
        icon: <HiStrikethrough className="w-4 h-4" />,
        action: (editor) => editor.chain().focus().toggleStrike().run(),
    },
    {
        type: 'code',
        icon: <Code className="w-4 h-4" />,
        action: (editor) => editor.chain().focus().toggleCode().run(),
    },
    {
        type: 'bulletList',
        icon: <List className="w-4 h-4" />,
        action: (editor) => editor.chain().focus().toggleBulletList().run(),
    },
    {
        type: 'orderedList',
        icon: <ListOrdered className="w-4 h-4" />,
        action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    },
];

export const FormattingButtons = memo(function FormattingButtons({
    editor,
    isMarkActive,
}: Props) {
    const handleClick = useCallback(
        (action: (editor: Editor) => void) => {
            action(editor);
        },
        [editor]
    );

    return (
        <>
            {FORMATTING_BUTTONS.map((button) => (
                <BubbleButton
                    key={button.type}
                    onClick={() => handleClick(button.action)}
                    isActive={isMarkActive(button.type)}>
                    {button.icon}
                </BubbleButton>
            ))}
        </>
    );
});
