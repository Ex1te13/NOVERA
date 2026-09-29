"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Logo } from "./Logo";
import { COMPANY, NAV } from "@/data/content";
import { ease } from "./ui";

export function Header() {
  const path = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let last = window.scrollY;
    let isHidden = false;
    const onScroll = () => {
      const y = window.scrollY;
      const d = y - last;
      last = y;
      setScrolled(y > 40);
      const locked = Array.from(document.querySelectorAll("[data-hide-header]")).some((el) => {
        const r = el.getBoundingClientRect();
        return r.top < 120 && r.bottom > window.innerHeight * 0.5;
      });
      if (open || y <= 400) isHidden = false;
      else if (locked || d > 4) isHidden = true;
      else if (d < -12) isHidden = false;
      setHidden(isHidden);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
  }, [open]);

  if (path?.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        animate={{ y: hidden ? -120 : 0 }}
        transition={{ duration: 0.5, ease }}
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
          scrolled ? "bg-ink/90 lg:bg-ink/70 lg:backdrop-blur-lg" : "bg-transparent"
        }`}
      >
        <div className="container-x flex h-[72px] items-center justify-between md:h-[88px]">
          <Logo />

          <nav className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] p-1 backdrop-blur-md lg:flex">
            {NAV.map((n) => {
              const active = path === n.href || (n.href !== "/" && path?.startsWith(n.href));
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`relative rounded-full px-5 py-2.5 text-[11px] uppercase tracking-wide2 transition-colors ${
                    active ? "text-ink" : "text-bone/80 hover:text-bone"
                  }`}
                >
                  {active && (
                    <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-bone" transition={{ duration: 0.5, ease }} />
                  )}
                  <span className="relative">{n.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <a href={COMPANY.phoneHref} className="link-line hidden text-[12px] tracking-wide text-bone/80 xl:inline-block">
              {COMPANY.phone}
            </a>
            <Link href="/contacts" data-track="cta" data-cta="header-request" className="btn-wine hidden !py-3 sm:inline-flex">
              Заказать проект
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Меню"
              className="relative flex h-11 w-11 items-center justify-center rounded-full border border-white/15 lg:hidden"
            >
              <span className={`absolute h-px w-5 bg-bone transition-all duration-300 ${open ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`absolute h-px w-5 bg-bone transition-all duration-300 ${open ? "opacity-0" : ""}`} />
              <span className={`absolute h-px w-5 bg-bone transition-all duration-300 ${open ? "-rotate-45" : "translate-y-1.5"}`} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-40 flex flex-col bg-ink px-6 pb-10 pt-28"
          >
            <nav className="flex flex-col gap-2">
              {NAV.map((n, i) => (
                <motion.div key={n.href} initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 * i, duration: 0.6, ease }}>
                  <Link href={n.href} className="block border-b border-white/10 py-4 font-display text-3xl font-bold uppercase tracking-tight">
                    {n.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto flex flex-col gap-4">
              <a href={COMPANY.phoneHref} className="font-serif text-3xl italic">
                {COMPANY.phone}
              </a>
              <a href={`mailto:${COMPANY.email}`} className="text-mist">
                {COMPANY.email}
              </a>
              <Link href="/contacts" data-track="cta" data-cta="menu-request" className="btn-primary mt-4 w-full">
                Заказать проект
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
