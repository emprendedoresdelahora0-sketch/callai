import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CallAI - AI Phone Assistant for Your Business",
  description:
    "Automate your calls, qualify leads and schedule meetings 24/7 with AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
