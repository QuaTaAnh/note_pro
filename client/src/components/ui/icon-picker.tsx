import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  FiFolder,
  FiHome,
  FiBook,
  FiSettings,
  FiStar,
  FiHeart,
  FiMusic,
  FiCamera,
  FiImage,
  FiVideo,
  FiFileText,
  FiCode,
  FiTool,
  FiUser,
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
  FiCalendar,
  FiClock,
  FiMail,
  FiPhone,
} from "react-icons/fi";
import {
  Folder,
  FolderOpen,
  Archive,
  Bookmark,
  Briefcase,
  Coffee,
  Gift,
  Globe,
  GraduationCap,
  Lightbulb,
  MapPin,
  Palette,
  Shield,
  Target,
  Zap,
} from "lucide-react";
import { IconComponent } from "@/types/types";

const iconSets: Record<
  string,
  { key: string; name: string; icon: IconComponent }[]
> = {
  Popular: [
    { key: "folder", name: "Folder", icon: FiFolder },
    { key: "home", name: "Home", icon: FiHome },
    { key: "star", name: "Star", icon: FiStar },
    { key: "heart", name: "Heart", icon: FiHeart },
    { key: "settings", name: "Settings", icon: FiSettings },
    { key: "book", name: "Book", icon: FiBook },
  ],
  "Work & Productivity": [
    { key: "briefcase", name: "Briefcase", icon: Briefcase },
    { key: "calendar", name: "Calendar", icon: FiCalendar },
    { key: "clock", name: "Clock", icon: FiClock },
    { key: "mail", name: "Mail", icon: FiMail },
    { key: "code", name: "Code", icon: FiCode },
    { key: "tools", name: "Tools", icon: FiTool },
  ],
  "Media & Creative": [
    { key: "music", name: "Music", icon: FiMusic },
    { key: "camera", name: "Camera", icon: FiCamera },
    { key: "image", name: "Image", icon: FiImage },
    { key: "video", name: "Video", icon: FiVideo },
    { key: "palette", name: "Palette", icon: Palette },
    { key: "lightbulb", name: "Lightbulb", icon: Lightbulb },
  ],
  "Folders & Storage": [
    { key: "folder2", name: "Folder", icon: Folder },
    { key: "folder-open", name: "Folder Open", icon: FolderOpen },
    { key: "archive", name: "Archive", icon: Archive },
    { key: "bookmark", name: "Bookmark", icon: Bookmark },
    { key: "file-text", name: "File Text", icon: FiFileText },
    { key: "shield", name: "Shield", icon: Shield },
  ],
  Lifestyle: [
    { key: "coffee", name: "Coffee", icon: Coffee },
    { key: "gift", name: "Gift", icon: Gift },
    { key: "globe", name: "Globe", icon: Globe },
    { key: "map-pin", name: "Map Pin", icon: MapPin },
    { key: "target", name: "Target", icon: Target },
    { key: "zap", name: "Zap", icon: Zap },
  ],
  "People & Social": [
    { key: "user", name: "User", icon: FiUser },
    { key: "users", name: "Users", icon: FiUsers },
    { key: "phone", name: "Phone", icon: FiPhone },
    { key: "shopping-cart", name: "Shopping Cart", icon: FiShoppingCart },
    { key: "dollar-sign", name: "Dollar Sign", icon: FiDollarSign },
    { key: "graduation-cap", name: "Graduation Cap", icon: GraduationCap },
  ],
};

interface IconPickerProps {
  selectedIcon: string;
  onIconChange: (iconKey: string) => void;
}

export const IconPicker: React.FC<IconPickerProps> = ({
  selectedIcon,
  onIconChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleIconSelect = (iconKey: string) => {
    onIconChange(iconKey);
    setIsOpen(false);
  };

  const SelectedIconComponent =
    Object.values(iconSets)
      .flat()
      .find((i) => i.key === selectedIcon)?.icon || FiFolder;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start gap-3 p-3 bg-modal-input border-modal-border text-modal-foreground hover:bg-modal-input/80"
        >
          <SelectedIconComponent className="w-4 h-4" />
          <span className="text-sm text-modal-muted">Choose Icon</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0 border-modal-border z-50 max-h-80 overflow-y-auto overscroll-contain"
        align="start"
      >
        <div className="max-h-full" style={{ scrollbarWidth: "thin" }}>
          {Object.entries(iconSets).map(([category, icons]) => (
            <div
              key={category}
              className="p-3 border-b border-modal-border last:border-b-0"
            >
              <h4 className="text-sm font-medium text-modal-foreground mb-2">
                {category}
              </h4>
              <div className="grid grid-cols-6 gap-2">
                {icons.map((iconItem) => {
                  const IconComp = iconItem.icon;
                  const isSelected = iconItem.key === selectedIcon;
                  return (
                    <Button
                      key={iconItem.key}
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "w-10 h-10 p-0 hover:bg-primary/10",
                        isSelected && "bg-primary/20 text-primary"
                      )}
                      onClick={() => handleIconSelect(iconItem.key)}
                      title={iconItem.name}
                    >
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
  );
};
