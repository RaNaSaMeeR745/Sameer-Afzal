import type { ReactNode } from "react";

export const metadata = {
  title: "Scoutline",
  description: "Find agency clients that nobody else has pitched yet, with the proof already built.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
