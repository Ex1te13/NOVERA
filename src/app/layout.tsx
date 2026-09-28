import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";

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

export const viewport: Viewport = {
  themeColor: "#080a09",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const metrikaId = process.env.YANDEX_METRIKA_ID || "";
  return (
    <html lang="ru">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Unbounded:wght@400;600;700;800;900&family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400;1,500&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body>
        <div className="grain" aria-hidden />
        <Header />
        <main>{children}</main>
        <Footer />
        <AnalyticsTracker metrikaId={metrikaId || undefined} />
      </body>
    </html>
  );
}
