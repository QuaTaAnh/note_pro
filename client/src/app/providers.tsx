"use client";

import { ThemeProvider } from "@/context/ThemeProvider";
import { MainLayout } from "@/features/layout/MainLayout";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { NextAuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastProvider";
import { ApolloClientProvider } from "@/context/ApolloClientProvider";
import { DocumentAccessProvider } from "@/context/DocumentAccessContext";
import { LoadingProvider } from "@/context/LoadingContext";
import ErrorBoundary from "@/components/shared/ErrorBoundary";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <ApolloClientProvider>
        <NextAuthProvider>
          <ThemeProvider>
            <ToastProvider>
              <LoadingProvider>
                <DocumentAccessProvider>
                  <AuthWrapper>
                    <MainLayout>{children}</MainLayout>
                  </AuthWrapper>
                </DocumentAccessProvider>
              </LoadingProvider>
            </ToastProvider>
          </ThemeProvider>
        </NextAuthProvider>
      </ApolloClientProvider>
    </ErrorBoundary>
  );
}
