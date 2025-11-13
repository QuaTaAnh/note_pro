"use client";

import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { SimpleTooltip } from "../page/SimpleTooltip";
import { useCurrentUserLocalStorage } from "@/hooks";

type ThemePreference = "light" | "dark";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const [storedTheme, setStoredTheme] = useCurrentUserLocalStorage<ThemePreference>(
    "theme_preference",
    "dark"
  );

  const resolvedTheme = useMemo(() => theme as ThemePreference, [theme]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (!storedTheme || storedTheme === resolvedTheme) return;

    setTheme(storedTheme);
  }, [mounted, resolvedTheme, setTheme, storedTheme]);

  useEffect(() => {
    if (!mounted) return;
    if (!resolvedTheme || storedTheme === resolvedTheme) return;

    setStoredTheme(resolvedTheme);
  }, [mounted, resolvedTheme, setStoredTheme, storedTheme]);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" className="w-6 h-6">
        <div className="h-4 w-4" />
      </Button>
    );
  }

  const toggleTheme = () => {
    const nextTheme: ThemePreference = resolvedTheme === "light" ? "dark" : "light";
    setStoredTheme(nextTheme);
    setTheme(nextTheme);
  };

  const getIcon = () => {
    if (resolvedTheme === "dark") {
      return <Moon className="h-4 w-4" />;
    }
    return <Sun className="h-4 w-4" />;
  };

  return (
    <SimpleTooltip
      title={
        resolvedTheme === "light"
          ? "Switch to dark mode"
          : "Switch to light mode"
      }
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
