import type { ReactNode } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Scoutline | Lead generation for marketing agencies",
    template: "%s | Scoutline",
  },
  description:
    "Find agency clients that nobody else has pitched yet, with the proof already built. Signal-based prospecting with evidence, proof reports, and personalized messages.",
  keywords: [
    "lead generation for marketing agencies",
    "agency prospecting tool",
    "signal based outbound",
    "SEO agency leads",
    "how to get clients for a marketing agency",
  ],
  openGraph: {
    title: "Scoutline | Lead generation for marketing agencies",
    description:
      "Find agency clients that nobody else has pitched yet, with the proof already built.",
    type: "website",
    siteName: "Scoutline",
  },
  twitter: {
    card: "summary_large_image",
    title: "Scoutline",
    description:
      "Signal-based lead generation for marketing agencies with evidence and proof reports.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif",
          color: "#0f172a",
          background: "#ffffff",
        }}
      >
        {children}
      </body>
    </html>
  );
}
