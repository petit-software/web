import type { Metadata } from "next";
import { themeInitScript } from "@/lib/theme-init";
import "./globals.css";

export const metadata: Metadata = {
  title: "Petit",
  description: "Coming soon.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
