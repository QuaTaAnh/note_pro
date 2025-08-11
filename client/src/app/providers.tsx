"use client";

import { SessionProvider } from "next-auth/react";
import { Toaster } from "sonner";
import { useTheme } from "next-themes";
import { ApolloProvider } from "@apollo/client";
import client from "@/lib/apollo-client";
import { AuthProvider } from "@/context/AuthContext";

export function NextAuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProvider>{children}</AuthProvider>
    </SessionProvider>
  );
}

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

export function ApolloClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
