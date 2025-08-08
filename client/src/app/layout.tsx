import LayoutContent from "@/components/Layout/LayoutContent";
import AuthWrapper from "@/components/auth/AuthWrapper";
import { ThemeProvider } from "next-themes";
import { Inter } from "next/font/google";
import "./globals.css";
import {
  ApolloClientProvider,
  NextAuthProvider,
  ToastProvider,
} from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Bin Craft",
  description: "Bin Craft",
  other: {
    "Cache-Control": "no-cache, no-store, must-revalidate",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
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
      </body>
    </html>
  );
}
