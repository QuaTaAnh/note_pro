import { Editor } from '@tiptap/react';
import { useCallback, useEffect, useState } from 'react';

export function useEditorState(editor: Editor | null) {
    const [, setEditorState] = useState(0);

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
        [editor]
    );

    const getCurrentHighlightColor = useCallback(() => {
        if (!editor) return null;
        const attributes = editor.getAttributes('highlight');
        return attributes.color || null;
    }, [editor]);

    return {
        isMarkActive,
        getCurrentHighlightColor,
    };
}
