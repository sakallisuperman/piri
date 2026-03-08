import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Piri — Kararını Al",
  description:
    "Tavsiye yok. Sadece olası sonuçlar. Piri, karar örüntünü analiz eder ve seni aynaya tutar.",
  openGraph: {
    title: "Piri — Kararını Al",
    description: "Tavsiye yok. Sadece olası sonuçlar.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={`${inter.variable} antialiased font-[var(--font-inter)]`}>
        {children}
      </body>
    </html>
  );
}
