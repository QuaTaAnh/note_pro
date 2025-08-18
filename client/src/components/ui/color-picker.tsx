import React from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const colors = [
  {
    name: "White",
    value: "hsl(var(--color-picker-1))",
    className: "bg-colorPicker-1",
  },
  {
    name: "Blue",
    value: "hsl(var(--color-picker-2))",
    className: "bg-colorPicker-2",
  },
  {
    name: "Green",
    value: "hsl(var(--color-picker-3))",
    className: "bg-colorPicker-3",
  },
  {
    name: "Yellow",
    value: "hsl(var(--color-picker-4))",
    className: "bg-colorPicker-4",
  },
  {
    name: "Red",
    value: "hsl(var(--color-picker-5))",
    className: "bg-colorPicker-5",
  },
  {
    name: "Purple",
    value: "hsl(var(--color-picker-6))",
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
