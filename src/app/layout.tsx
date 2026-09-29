import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope, Unbounded } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { Preloader } from "@/components/Preloader";

export const metadata: Metadata = {
  title: {
    default: "NOVERA — Строительство домов по всей России",
    template: "%s — NOVERA",
  },
  description:
    "NOVERA строит частные дома и делает интерьеры по всей России с 2005 года. Проектирование, строительство, инженерия, дизайн, благоустройство и ландшафт — полный цикл или отдельные услуги.",
  openGraph: {
    title: "NOVERA — Строительство домов по всей России",
    description: "Частные дома, интерьеры и участки под ключ. С 2005 года.",
    type: "website",
    locale: "ru_RU",
  },
};

const display = Unbounded({ subsets: ["latin", "cyrillic"], variable: "--font-display", display: "swap" });
const sans = Manrope({ subsets: ["latin", "cyrillic"], variable: "--font-sans", display: "swap" });
const serif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#080a09",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const metrikaId = process.env.YANDEX_METRIKA_ID || "";
  return (
    <html lang="ru" className={`${display.variable} ${sans.variable} ${serif.variable}`}>
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <div className="grain" aria-hidden />
        <Preloader />
        <Header />
        <main>{children}</main>
        <Footer />
        <AnalyticsTracker metrikaId={metrikaId || undefined} />
      </body>
    </html>
  );
}
