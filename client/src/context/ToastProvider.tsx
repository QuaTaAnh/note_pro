"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <>
      {children}
      <Toaster
        theme={theme as "light" | "dark"}
        position="top-right"
        expand={true}
        richColors
        closeButton={false}
        toastOptions={{
          style: {
            background: "hsl(var(--background))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
          classNames: {
            success: "toast-success",
            error: "toast-error",
            warning: "toast-warning",
            info: "toast-info",
          },
        }}
      />
    </>
  );
}
