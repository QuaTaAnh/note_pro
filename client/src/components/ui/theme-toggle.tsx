"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SimpleTooltip } from "../page/SimpleTooltip";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-6 h-6">
        <div className="h-4 w-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "dark") {
      return <Moon className="h-4 w-4" />;
    }
    return <Sun className="h-4 w-4" />;
  };

  return (
    <SimpleTooltip
      title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="w-6 h-6"
      >
        {getIcon()}
      </Button>
    </SimpleTooltip>
  );
}
