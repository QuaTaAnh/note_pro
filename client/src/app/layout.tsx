import LayoutContent from "@/components/Layout/LayoutContent";
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
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
                <LayoutContent>{children}</LayoutContent>
              </ToastProvider>
            </NextAuthProvider>
          </ApolloClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
