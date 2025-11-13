"use client";

import { ThemeProvider } from "@/context/ThemeProvider";
import { MainLayout } from "@/components/Layout";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { NextAuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastProvider";
import { ApolloClientProvider } from "@/context/ApolloClientProvider";
import { DocumentAccessProvider } from "@/context/DocumentAccessContext";
import ErrorBoundary from "@/components/ErrorBoundary";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ApolloClientProvider>
        <NextAuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <DocumentAccessProvider>
                <AuthWrapper>
                  <MainLayout>{children}</MainLayout>
                </AuthWrapper>
              </DocumentAccessProvider>
            </ToastProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </ApolloClientProvider>
    </ErrorBoundary>
  );
}
