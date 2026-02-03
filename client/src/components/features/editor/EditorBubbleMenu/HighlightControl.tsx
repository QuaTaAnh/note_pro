'use client';

import { memo, useState, useCallback } from 'react';
import { HighlightPicker } from '../HighlightPicker';

interface Props {
    onSelect: (color: string | null) => void;
    currentColor: string | null;
    isActive: boolean;
}

export const HighlightControl = memo(function HighlightControl({
    onSelect,
    currentColor,
    isActive,
}: Props) {
    const [showColorPicker, setShowColorPicker] = useState(false);

    const handleToggle = useCallback(() => {
        setShowColorPicker((prev) => !prev);
    }, []);

    const handleClose = useCallback(() => {
        setShowColorPicker(false);
    }, []);

    const handleSelect = useCallback(
        (color: string | null) => {
            onSelect(color);
            setShowColorPicker(false);
        },
        [onSelect]
    );

    return (
        <HighlightPicker
            show={showColorPicker}
            toggle={handleToggle}
            close={handleClose}
            onSelect={handleSelect}
            currentColor={currentColor}
            isActive={isActive}
        />
    );
});
