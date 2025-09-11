"use client";

import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { FaHighlighter } from "react-icons/fa";
import { HIGHLIGHT_COLORS } from "@/consts";

interface Props {
  show: boolean;
  toggle: () => void;
  onSelect: (color: string | null) => void;
  currentColor: string | null;
  isActive: boolean;
  close: () => void;
}

export const HighlightPicker = ({
  show,
  toggle,
  onSelect,
  currentColor,
  isActive,
  close,
}: Props) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        close();
      }
    };
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [show, close]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={toggle}
        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-1"
      >
        <div className="relative">
          <FaHighlighter
            className={`w-4 h-4 ${
              isActive ? "text-blue-600" : "text-gray-600 dark:text-gray-300"
            }`}
          />
          {currentColor && (
            <div
              className="absolute -bottom-1 left-0 w-4 h-1 rounded-sm"
              style={{ backgroundColor: currentColor }}
            />
          )}
        </div>
        <ChevronDown className="w-3 h-3 text-gray-400" />
      </button>

      {show && (
        <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg p-2 z-50">
          <div className="grid grid-cols-5 gap-1 w-40">
            {HIGHLIGHT_COLORS.map((colorOption, i) => (
              <button
                key={i}
                onClick={() => onSelect(colorOption.value)}
                className={`w-6 h-6 rounded border-2 hover:scale-110 transition-transform ${
                  currentColor === colorOption.value
                    ? "border-blue-500"
                    : "border-gray-300 dark:border-gray-600"
                }`}
                style={{
                  backgroundColor: colorOption.color,
                  backgroundImage:
                    colorOption.value === null
                      ? "linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)"
                      : undefined,
                  backgroundSize:
                    colorOption.value === null ? "4px 4px" : undefined,
                  backgroundPosition:
                    colorOption.value === null
                      ? "0 0, 0 2px, 2px -2px, -2px 0px"
                      : undefined,
                }}
                title={colorOption.name}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
