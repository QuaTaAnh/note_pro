"use client";

import { useCurrentUserLocalStorage } from "@/hooks";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

type ThemePreference = "light" | "dark";

interface ThemeContextType {
  theme: ThemePreference;
  setTheme: (theme: ThemePreference) => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const [storedTheme, setStoredTheme] =
    useCurrentUserLocalStorage<ThemePreference>("theme_preference", "light");

  const theme = storedTheme ?? "light";

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);

    root.setAttribute("data-theme", theme);
  }, [mounted, theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setStoredTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
