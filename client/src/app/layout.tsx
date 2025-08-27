import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: {
    default: "Bin Craft - Note Taking App",
    template: "%s | Bin Craft",
  },
  description: "A modern note-taking application with collaborative features",
  keywords: ["notes", "collaboration", "productivity", "workspace"],
  authors: [{ name: "Bin Craft Team" }],
  creator: "Bin Craft",
  publisher: "Bin Craft",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "Bin Craft - Note Taking App",
    description: "A modern note-taking application with collaborative features",
    siteName: "Bin Craft",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bin Craft - Note Taking App",
    description: "A modern note-taking application with collaborative features",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
