"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "dark") {
      return <Sun className="h-[1.2rem] w-[1.2rem]" />;
    }
    return <Moon className="h-[1.2rem] w-[1.2rem]" />;
  };

  const getTooltip = () => {
    return theme === "light" ? "Turn off the light" : "Turn on the light";
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleTheme}
      title={getTooltip()}
      className="relative"
    >
      {getIcon()}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
