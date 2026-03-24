import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AI Hair Design",
  description: "AI-powered virtual hair design app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh">
      <body className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        {children}
      </body>
    </html>
  );
}
