import { useEffect, useRef } from 'react';
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
}

export function useEditorRefs({
    onChange,
    onFocus,
    onBlur,
    onSaveImmediate,
    onAddBlock,
}: UseEditorRefsProps) {
    const onChangeRef = useRef(onChange);
    const onFocusRef = useRef(onFocus);
    const onBlurRef = useRef(onBlur);
    const onSaveImmediateRef = useRef(onSaveImmediate);
    const onAddBlockRef = useRef(onAddBlock);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        onFocusRef.current = onFocus;
    }, [onFocus]);

    useEffect(() => {
        onBlurRef.current = onBlur;
    }, [onBlur]);

    useEffect(() => {
        onSaveImmediateRef.current = onSaveImmediate;
    }, [onSaveImmediate]);

    useEffect(() => {
        onAddBlockRef.current = onAddBlock;
    }, [onAddBlock]);

    return {
        onChangeRef,
        onFocusRef,
        onBlurRef,
        onSaveImmediateRef,
        onAddBlockRef,
    };
}
