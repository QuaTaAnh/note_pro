import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { HexColor, IconComponent } from '@/types/types';
import {
    Briefcase,
    Coffee,
    Gift,
    Globe,
    GraduationCap,
    Lightbulb,
    MapPin,
    Palette,
    Target,
    Zap,
} from 'lucide-react';
import React, { useState } from 'react';
import {
    FiBook,
    FiCalendar,
    FiCamera,
    FiClock,
    FiCode,
    FiDollarSign,
    FiFolder,
    FiHeart,
    FiHome,
    FiImage,
    FiMail,
    FiMusic,
    FiPhone,
    FiSettings,
    FiShoppingCart,
    FiStar,
    FiTool,
    FiUser,
    FiUsers,
    FiVideo,
} from 'react-icons/fi';

const iconSets: Record<
    string,
    { key: string; name: string; icon: IconComponent }[]
> = {
    'Popular Icons': [
        { key: 'folder', name: 'Folder', icon: FiFolder },
        { key: 'home', name: 'Home', icon: FiHome },
        { key: 'star', name: 'Star', icon: FiStar },
        { key: 'heart', name: 'Heart', icon: FiHeart },
        { key: 'settings', name: 'Settings', icon: FiSettings },
        { key: 'book', name: 'Book', icon: FiBook },
    ],
    'Work & Productivity': [
        { key: 'briefcase', name: 'Briefcase', icon: Briefcase },
        { key: 'calendar', name: 'Calendar', icon: FiCalendar },
        { key: 'clock', name: 'Clock', icon: FiClock },
        { key: 'mail', name: 'Mail', icon: FiMail },
        { key: 'code', name: 'Code', icon: FiCode },
        { key: 'tools', name: 'Tools', icon: FiTool },
    ],
    'Media & Creative': [
        { key: 'music', name: 'Music', icon: FiMusic },
        { key: 'camera', name: 'Camera', icon: FiCamera },
        { key: 'image', name: 'Image', icon: FiImage },
        { key: 'video', name: 'Video', icon: FiVideo },
        { key: 'palette', name: 'Palette', icon: Palette },
        { key: 'bulb', name: 'Lightbulb', icon: Lightbulb },
    ],
    'Lifestyle Icons': [
        { key: 'coffee', name: 'Coffee', icon: Coffee },
        { key: 'gift', name: 'Gift', icon: Gift },
        { key: 'globe', name: 'Globe', icon: Globe },
        { key: 'pin', name: 'Map Pin', icon: MapPin },
        { key: 'target', name: 'Target', icon: Target },
        { key: 'zap', name: 'Zap', icon: Zap },
    ],
    'People & Social': [
        { key: 'user', name: 'User', icon: FiUser },
        { key: 'users', name: 'Users', icon: FiUsers },
        { key: 'phone', name: 'Phone', icon: FiPhone },
        { key: 'cart', name: 'Shopping Cart', icon: FiShoppingCart },
        { key: 'dollar', name: 'Dollar Sign', icon: FiDollarSign },
        { key: 'cap', name: 'Graduation Cap', icon: GraduationCap },
    ],
};

const iconMap = Object.values(iconSets)
    .flat()
    .reduce<Record<string, IconComponent>>((acc, icon) => {
        acc[icon.key] = icon.icon;
        return acc;
    }, {});

export const getIconComponent = (iconKey: string): IconComponent => {
    return iconMap[iconKey] || FiFolder;
};

interface IconPickerProps {
    selectedIcon: string;
    onIconChange: (iconKey: string) => void;
    portalContainer?: HTMLElement;
    previewColor?: string;
}

export const IconPicker: React.FC<IconPickerProps> = ({
    selectedIcon,
    onIconChange,
    portalContainer,
    previewColor,
}) => {
    const [isOpen, setIsOpen] = useState(false);

    const handleIconSelect = (iconKey: string) => {
        onIconChange(iconKey);
        setIsOpen(false);
    };

    const SelectedIconComponent = getIconComponent(selectedIcon);

    const iconPreviewStyles = previewColor
        ? {
              color: previewColor,
          }
        : undefined;

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
                                'w-8 h-8 rounded-full border flex items-center justify-center',
                                previewColor
                                    ? 'border-transparent'
                                    : 'border-border'
                            )}
                            style={iconPreviewStyles}>
                            <SelectedIconComponent className="w-4 h-4" />
                        </span>
                        <span className="text-sm text-muted-foreground">
                            Choose Icon
                        </span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    container={portalContainer}
                    className="w-100 p-0 border-border z-[100] max-h-80 overflow-y-auto overscroll-contain pointer-events-auto bg-card"
                    align="start"
                    sideOffset={8}>
                    <div
                        className="max-h-full"
                        style={{ scrollbarWidth: 'thin' }}>
                        {Object.entries(iconSets).map(([category, icons]) => (
                            <div
                                key={category}
                                className="p-1 border-b border-border last:border-b-0">
                                <div className="grid grid-cols-6 gap-1">
                                    {icons.map((iconItem) => {
                                        const IconComp = iconItem.icon;
                                        const isSelected =
                                            iconItem.key === selectedIcon;
                                        return (
                                            <Button
                                                type="button"
                                                key={iconItem.key}
                                                variant="ghost"
                                                size="sm"
                                                className={cn(
                                                    'w-7 h-7 p-0 hover:bg-primary/10 relative z-10 pointer-events-auto',
                                                    isSelected &&
                                                        'bg-primary/20 text-primary'
                                                )}
                                                onClick={() =>
                                                    handleIconSelect(
                                                        iconItem.key
                                                    )
                                                }
                                                title={iconItem.name}>
                                                <IconComp className="w-4 h-4" />
                                            </Button>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        </div>
    );
};
