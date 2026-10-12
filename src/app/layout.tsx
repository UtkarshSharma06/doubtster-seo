import type { Metadata, Viewport } from "next";
import "./globals.css";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://doubtster.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: "Doubtster | stuck on a question? watch it explained", template: "%s | Doubtster" },
  description: "Ask a question, get a step by step answer, and turn it into a short explainer video. Chat is always free.",
  openGraph: { siteName: "Doubtster", type: "website" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* Swap for next/font if you prefer self-hosting. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Caveat:wght@500;700&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
