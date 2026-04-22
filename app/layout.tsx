import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import "@/app/globals.css";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { AppToaster } from "@/components/providers/AppToaster";
import { PageTransition } from "@/components/providers/PageTransition";

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope"
});

const playfair = Playfair_Display({
  subsets: ["latin", "cyrillic"],
  variable: "--font-playfair"
});

export const metadata: Metadata = {
  title: "ИНТЕРМАГ | Интернет-магазин одежды",
  description: "Минималистичный интернет-магазин одежды и обуви на Next.js"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body className={`${manrope.variable} ${playfair.variable} min-h-screen bg-transparent`}>
        <div className="relative flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <PageTransition>{children}</PageTransition>
          </main>
          <Footer />
          <AppToaster />
        </div>
      </body>
    </html>
  );
}
