import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { EmojiPickerPopover } from '@/components/shared/EmojiPickerPopover';
import React, { useState } from 'react';
import { IconDefault } from '../features/page/FolderDialog';

interface IconPickerProps {
    selectedIcon: string;
    onIconChange: (emoji: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
    selectedIcon,
    onIconChange,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleEmojiSelect = (emoji: string) => {
        onIconChange(emoji);
        setIsOpen(false);
    };

    return (
        <div>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full justify-start gap-3 p-3 bg-card border-border text-foreground">
                        <span
                            className={cn(
                                'w-8 h-8 rounded-full border flex items-center justify-center text-xl'
                            )}>
                            {selectedIcon || IconDefault}
                        </span>
                        <span className="text-sm text-muted-foreground">
                            Choose Icon
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 border-0 shadow-none z-[9999]"
                    align="end"
                    side="right"
                    sideOffset={12}
                    collisionPadding={8}
                    onOpenAutoFocus={(e) => e.preventDefault()}>
                    <EmojiPickerPopover
                        show={isOpen}
                        onSelect={handleEmojiSelect}
                        onClose={() => setIsOpen(false)}
                    />
                </PopoverContent>
            </Popover>
        </div>
    );
};
