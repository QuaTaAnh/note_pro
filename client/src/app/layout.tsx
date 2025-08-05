import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider, ToastProvider } from "./providers";
import { ThemeProvider } from "@/contexts/ThemeContext";
import LayoutContent from "@/components/LayoutContent";

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
        <ThemeProvider defaultTheme="dark">
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
