/**
 * 根布局 — xTrue 暖色系设计
 */

import { Suspense, type ReactNode } from "react";
import type { Metadata } from "next";
import { Inter, Noto_Serif_SC, JetBrains_Mono, Fredoka } from "next/font/google";
import { QueryProvider, ThemeProvider } from "@/providers";
import { MockProvider } from "@/mock";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toast";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  adjustFontFallback: true,
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: "xTrue - 真实评价平台",
  description: "认同度 0-100，分层身份认证，让真实声音被听见。",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`${inter.variable} ${notoSerifSC.variable} ${jetbrainsMono.variable} ${fredoka.variable} font-sans antialiased`}>
        <MockProvider>
          <ThemeProvider>
            <QueryProvider>
              <div className="flex min-h-screen flex-col">
                <Suspense>
                  <Header />
                </Suspense>
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
              <Toaster />
            </QueryProvider>
          </ThemeProvider>
        </MockProvider>
      </body>
    </html>
  );
}
