"use client";

import { ThemeProvider } from "next-themes";
import LayoutContent from "@/components/Layout/LayoutContent";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { NextAuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastProvider";
import { ApolloClientProvider } from "@/context/ApolloClientProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange={false}
    >
      <ApolloClientProvider>
        <NextAuthProvider>
          <ToastProvider>
            <AuthWrapper>
              <LayoutContent>{children}</LayoutContent>
            </AuthWrapper>
          </ToastProvider>
        </NextAuthProvider>
      </ApolloClientProvider>
    </ThemeProvider>
  );
}
