import type { Metadata } from "next";
import "./globals.css";
import ThemeProvider, { ThemeScript } from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "Tech Blog Hub",
  description: "기술 블로그 모아보기",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
