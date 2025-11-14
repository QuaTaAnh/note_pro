import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { FOLDER_COLORS } from "@/consts";
import { HexColor } from "@/types/types";

interface ColorPickerProps {
  selectedColor: string;
  onColorChange: (color: string) => void;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
}) => {
  useEffect(() => {
    if (!selectedColor || selectedColor.trim() === "") {
      onColorChange(HexColor.WHITE);
    }
  }, [selectedColor, onColorChange]);

  return (
    <div className="flex gap-2 flex-wrap">
      {FOLDER_COLORS.map((color) => {
        const isSelected = selectedColor === color.value;
        const isWhite = color.value === HexColor.WHITE;

        return (
          <button
            key={color.name}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={cn(
              "relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-200",
              isSelected
                ? "border-primary ring-2 ring-primary scale-110 shadow-md"
                : "border-muted hover:scale-105 hover:shadow",
            )}
            style={{
              backgroundColor: color.color,
              borderColor: isWhite ? "rgba(120,120,120,0.6)" : undefined,
            }}
            title={color.name}
          >
            {isSelected && (
              <Check
                className={cn(
                  "w-4 h-4 drop-shadow",
                  isWhite ? "text-gray-800 dark:text-gray-900" : "text-primary",
                )}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};
