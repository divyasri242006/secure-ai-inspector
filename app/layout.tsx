import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SecureAI Inspector",
  description: "AI-powered passive website security scanner with beginner-friendly reports"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
