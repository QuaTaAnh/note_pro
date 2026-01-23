import { useRef } from 'react';
import { BlockType } from '@/types/types';

interface UseEditorRefsProps {
    onChange: (value: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
    onSaveImmediate?: () => void;
    onAddBlock?: (
        position: number,
        type: BlockType,
        content?: Record<string, unknown>
    ) => void;
    position: number;
}

export function useEditorRefs({
    onChange,
    onFocus,
    onBlur,
    onSaveImmediate,
    onAddBlock,
    position,
}: UseEditorRefsProps) {
    const onChangeRef = useRef(onChange);
    const onFocusRef = useRef(onFocus);
    const onBlurRef = useRef(onBlur);
    const onSaveImmediateRef = useRef(onSaveImmediate);
    const onAddBlockRef = useRef(onAddBlock);
    const positionRef = useRef(position);

    onChangeRef.current = onChange;
    onFocusRef.current = onFocus;
    onBlurRef.current = onBlur;
    onSaveImmediateRef.current = onSaveImmediate;
    onAddBlockRef.current = onAddBlock;
    positionRef.current = position;

    return {
        onChangeRef,
        onFocusRef,
        onBlurRef,
        onSaveImmediateRef,
        onAddBlockRef,
        positionRef,
    };
}
