"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { useTheme } from "@/contexts/ThemeContext";

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  return (
    <>
      {children}
      <Toaster
        theme={theme}
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
