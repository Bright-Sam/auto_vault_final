import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import './globals.css';

export const metadata: Metadata = {
  title: "Auto Vault | Premium Chinese Cars",
  description: "Premium Chinese vehicles built for Africa. Auto Vault, Spintex - Accra.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}