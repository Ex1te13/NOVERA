"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { COMPANY, NAV } from "@/data/content";

export function Footer() {
  const path = usePathname();
  if (path?.startsWith("/admin")) return null;
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-coal">
      <div className="container-x relative py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <Logo />
            <p className="mt-8 max-w-sm text-mist">
              Строим частные дома и делаем интерьеры по всей России с {COMPANY.since} года. Полный цикл или отдельные услуги — с вашим проектом или нашим.
            </p>
            <div className="mt-8 flex gap-3">
              <a href={COMPANY.telegram} target="_blank" rel="noreferrer" data-track="social" className="glass rounded-full px-5 py-2.5 text-[11px] uppercase tracking-wide2 hover:bg-white/10">
                Telegram
              </a>
              <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" data-track="social" className="glass rounded-full px-5 py-2.5 text-[11px] uppercase tracking-wide2 hover:bg-white/10">
                WhatsApp
              </a>
            </div>
          </div>
          <div className="md:col-span-3">
            <p className="eyebrow mb-6">Навигация</p>
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n.href}>
                  <Link href={n.href} className="link-line text-bone/80 hover:text-bone">
                    {n.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <p className="eyebrow mb-6">Контакты</p>
            <a href={COMPANY.phoneHref} className="block font-serif text-3xl italic hover:text-moss-400">
              {COMPANY.phone}
            </a>
            <a href={`mailto:${COMPANY.email}`} className="link-line mt-3 inline-block text-bone/80">
              {COMPANY.email}
            </a>
            <p className="mt-6 text-mist">{COMPANY.address}</p>
            <p className="text-mist">{COMPANY.hours}</p>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] uppercase tracking-wide2 text-ash md:flex-row md:items-center md:justify-between">
          <span>© {new Date().getFullYear()} NOVERA · Строительство домов по всей России</span>
          <span className="flex gap-6">
            <Link href="/privacy" className="hover:text-bone">
              Политика конфиденциальности
            </Link>
            <Link href="/admin" className="hover:text-bone">
              Для сотрудников
            </Link>
          </span>
        </div>
      </div>
      <div aria-hidden className="pointer-events-none select-none whitespace-nowrap text-center font-display text-[17vw] font-black uppercase leading-[0.8] tracking-tighter text-white/[0.025]">
        Novera
      </div>
    </footer>
  );
}
