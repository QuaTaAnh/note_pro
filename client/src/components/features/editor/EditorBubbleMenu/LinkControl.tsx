'use client';

import { memo, useState, useCallback } from 'react';
import { HiLinkSlash } from 'react-icons/hi2';
import { BubbleButton } from '../BubbleButton';
import { LinkInput } from '../LinkInput';

interface Props {
    onSubmit: (url: string) => void;
    isActive: boolean;
}

export const LinkControl = memo(function LinkControl({
    onSubmit,
    isActive,
}: Props) {
    const [showLinkInput, setShowLinkInput] = useState(false);

    const handleToggle = useCallback(() => {
        setShowLinkInput(true);
    }, []);

    const handleSubmit = useCallback(
        (url: string) => {
            onSubmit(url);
            setShowLinkInput(false);
        },
        [onSubmit]
    );

    const handleCancel = useCallback(() => {
        setShowLinkInput(false);
    }, []);

    if (showLinkInput) {
        return <LinkInput onSubmit={handleSubmit} onCancel={handleCancel} />;
    }

    return (
        <BubbleButton onClick={handleToggle} isActive={isActive}>
            <HiLinkSlash className="w-4 h-4" />
        </BubbleButton>
    );
});
