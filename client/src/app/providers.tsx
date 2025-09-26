"use client";

import { ThemeProvider } from "next-themes";
import LayoutContent from "@/components/Layout/LayoutContent";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { NextAuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastProvider";
import { ApolloClientProvider } from "@/context/ApolloClientProvider";
import { DocumentAccessProvider } from "@/context/DocumentAccessContext";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="dark"
        enableSystem={false}
        disableTransitionOnChange={true}
      >
        <ApolloClientProvider>
          <NextAuthProvider>
            <ToastProvider>
              <DocumentAccessProvider>
                <AuthWrapper>
                  <LayoutContent>{children}</LayoutContent>
                </AuthWrapper>
              </DocumentAccessProvider>
            </ToastProvider>
          </NextAuthProvider>
        </ApolloClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
