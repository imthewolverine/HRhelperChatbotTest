import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teams-style AI Agent",
  description: "Mock Teams chat with Gemini-powered agent"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
