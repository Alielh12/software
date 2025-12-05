import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CareConnect University Health",
  description: "University health center services for students and staff"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
