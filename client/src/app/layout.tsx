import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider, ToastProvider } from "./providers";
import { ThemeProvider } from "next-themes";
import LayoutContent from "@/components/Layout/LayoutContent";

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
          <NextAuthProvider>
            <ToastProvider>
              <LayoutContent>{children}</LayoutContent>
            </ToastProvider>
          </NextAuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
