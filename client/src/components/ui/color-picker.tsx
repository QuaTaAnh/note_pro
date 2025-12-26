import React, { useEffect } from "react";
import { cn } from "@/lib/utils";
import { FOLDER_COLORS } from "@/lib/constants";
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
      onColorChange(HexColor.BLACK);
    }
  }, [selectedColor, onColorChange]);

  return (
    <div className="grid grid-cols-6 gap-3">
      {FOLDER_COLORS.map((color) => {
        const isSelected = selectedColor === color.value;
        return (
          <button
            key={color.name}
            type="button"
            onClick={() => onColorChange(color.value)}
            className={cn(
              "relative flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60",
              isSelected ? "scale-105" : "hover:scale-105",
            )}
            title={color.name}
          >
            <span className="sr-only">{color.name}</span>
            <span
              className="block h-6 w-6 rounded-full border"
              style={{
                backgroundColor: color.color,
                borderColor: "transparent",
              }}
            />
            {isSelected && (
              <span className="pointer-events-none absolute inset-0 rounded-full border-[2.5px] border-foreground/80" />
            )}
          </button>
        );
      })}
    </div>
  );
};
