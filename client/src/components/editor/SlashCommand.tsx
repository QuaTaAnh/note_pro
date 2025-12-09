"use client";

import type { ComponentType, SVGProps } from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface SlashCommandProps {
  show: boolean;
  onSelect: (command: string) => void;
  close: () => void;
  position: { top: number; left: number };
  commands: Command[];
}

export interface Command {
  id: string;
  name: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  preview?: string;
}

export const SlashCommand = ({
  show,
  onSelect,
  close,
  position,
  commands,
}: SlashCommandProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!show) {
      setSelectedIndex(0);
      return;
    }

    setSelectedIndex((prev) =>
      Math.min(prev, Math.max(commands.length - 1, 0)),
    );
  }, [show, commands.length]);

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

  useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % Math.max(commands.length, 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (i) =>
            (i - 1 + Math.max(commands.length, 1)) %
            Math.max(commands.length, 1),
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        const cmd = commands[selectedIndex];
        if (cmd) {
          onSelect(cmd.id);
          close();
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [show, commands, selectedIndex, onSelect, close]);

  if (!show || commands.length === 0) return null;

  return (
    <div
      ref={ref}
      className="fixed bg-popover text-popover-foreground border border-border rounded-lg shadow-lg p-2 z-50 w-80 max-h-96 overflow-hidden"
      style={{ top: position.top, left: position.left }}
      role="listbox"
      aria-activedescendant={commands[selectedIndex]?.id}
    >
      <div className="max-h-80 overflow-y-auto">
        {commands.map((cmd, idx) => {
          const Icon = cmd.icon;
          const isActive = idx === selectedIndex;
          return (
            <button
              key={cmd.id}
              role="option"
              aria-selected={isActive}
              data-active={isActive}
              onMouseEnter={() => setSelectedIndex(idx)}
              onClick={() => {
                onSelect(cmd.id);
                close();
              }}
              className={cn(
                "w-full flex items-center gap-1 rounded px-2 py-1.5 text-xs text-left transition-colors duration-200 focus-visible:outline-none focus-visible:ring-0 ring-offset-background",
                isActive
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/60 hover:text-accent-foreground",
              )}
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4" />
              </div>
              <span className="truncate">{cmd.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
