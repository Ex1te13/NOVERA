"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";

const ITEMS = [
  { href: "/admin", label: "Заявки", icon: "M4 6h16M4 12h16M4 18h10" },
  { href: "/admin/analytics", label: "Аналитика", icon: "M4 19V10M10 19V5M16 19v-7M22 19H2" },
  { href: "/admin/referrals", label: "Реферальные ссылки", icon: "M10 14a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1M14 10a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" },
  { href: "/admin/settings", label: "Настройки", icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM19 12a7 7 0 01-.1 1.2l2 1.5-2 3.4-2.3-.9a7 7 0 01-2 1.2L14 21h-4l-.5-2.6a7 7 0 01-2-1.2l-2.4.9-2-3.4 2-1.5A7 7 0 015 12a7 7 0 01.1-1.2l-2-1.5 2-3.4 2.3.9a7 7 0 012-1.2L10 3h4l.5 2.6a7 7 0 012 1.2l2.4-.9 2 3.4-2 1.5c.1.4.1.8.1 1.2z" },
];

export function AdminNav({ user }: { user: string }) {
  const path = usePathname();
  const router = useRouter();
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  };
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-white/10 bg-[#0e1110] lg:min-h-screen lg:w-64 lg:border-b-0 lg:border-r">
      <div className="flex items-center gap-3 px-5 py-5">
        <LogoMark className="h-8 w-8" />
        <div className="leading-none">
          <p className="font-display text-sm font-bold uppercase tracking-[0.2em]">Novera</p>
          <p className="mt-1 text-[10px] uppercase tracking-wide2 text-mist">Панель управления</p>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:pb-0">
        {ITEMS.map((it) => {
          const active = path === it.href;
          return (
            <Link
              key={it.href}
              href={it.href}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active ? "bg-moss-800/70 text-bone" : "text-mist hover:bg-white/5 hover:text-bone"}`}
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d={it.icon} />
              </svg>
              {it.label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto hidden border-t border-white/10 p-4 lg:block">
        <p className="text-[11px] uppercase tracking-wide2 text-mist">Вы вошли как</p>
        <p className="mt-1 text-sm">{user}</p>
        <div className="mt-4 flex gap-2">
          <Link href="/" className="admin-btn-ghost flex-1 justify-center text-xs">
            Сайт
          </Link>
          <button onClick={logout} className="admin-btn-ghost flex-1 justify-center text-xs">
            Выйти
          </button>
        </div>
      </div>
    </aside>
  );
}
