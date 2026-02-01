import type { Metadata } from "next";
import "./globals.css";
import SYSTEM_CONFIG from "../system";

export const metadata: Metadata = {
  title: SYSTEM_CONFIG.app.name,
  description: SYSTEM_CONFIG.app.tagline,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
