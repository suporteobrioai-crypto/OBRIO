import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Obrio AI",
  description: "Seu assistente inteligente de obras e reformas.",
  icons: {
    icon: "/favicon.svg"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
