import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { FolderColor } from "@/types/types";

const colors = [
  {
    name: "White",
    value: FolderColor.WHITE,
    className: "bg-colorPicker-1",
  },
  {
    name: "Blue",
    value: FolderColor.BLUE,
    className: "bg-colorPicker-2",
  },
  {
    name: "Green",
    value: FolderColor.GREEN,
    className: "bg-colorPicker-3",
  },
  {
    name: "Yellow",
    value: FolderColor.YELLOW,
    className: "bg-colorPicker-4",
  },
  {
    name: "Red",
    value: FolderColor.RED,
    className: "bg-colorPicker-5",
  },
  {
    name: "Purple",
    value: FolderColor.PURPLE,
    className: "bg-colorPicker-6",
  },
];

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
}) => {
  useEffect(() => {
    if (!selectedColor) {
      onColorChange(colors[0].value);
    }
  }, [selectedColor, onColorChange]);

  return (
    <div className="flex gap-2">
      {colors.map((color) => {
        const isSelected = selectedColor === color.value;
        return (
          <button
            key={color.name}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={cn(
              "relative w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200",
              color.className,
              isSelected
                ? "border-primary ring-2 ring-primary scale-110"
                : "border-muted hover:scale-105"
            )}
            title={color.name}
          >
            {isSelected && (
              <Check className="w-4 h-4 text-primary drop-shadow" />
            )}
          </button>
        );
      })}
    </div>
  );
};
