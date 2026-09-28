"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { SHOWCASE } from "@/data/content";
import { u } from "@/data/images";
import { ArrowIcon, ease } from "@/components/ui";

/**
 * Sticky-секция: при скролле картинка справа сменяется,
 * слева — крупные заголовки категорий.
 */
export function ShowcaseScroll() {
  const ref = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    const i = Math.min(SHOWCASE.length - 1, Math.max(0, Math.floor(v * SHOWCASE.length)));
    if (i !== idx) setIdx(i);
  });

  return (
    <section ref={ref} className="relative bg-ink" style={{ height: `${SHOWCASE.length * 100}vh` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* картинка */}
        <div className="absolute inset-0">
          <AnimatePresence mode="sync">
            <motion.img
              key={SHOWCASE[idx].id}
              src={u(SHOWCASE[idx].id, 2200)}
              alt={SHOWCASE[idx].title}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          </AnimatePresence>
          <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/60 to-ink/10" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink via-transparent to-ink/60" />
        </div>

        {/* текст */}
        <div className="container-x relative flex h-full flex-col justify-center">
          <p className="eyebrow eyebrow-dot mb-8">Что мы делаем</p>
          <ul className="space-y-1 md:space-y-2">
            {SHOWCASE.map((s, i) => {
              const on = i === idx;
              return (
                <li key={s.title} className="flex items-baseline gap-4 md:gap-8">
                  <span className={`font-mono text-[11px] tabular-nums transition-colors duration-500 ${on ? "text-wine-400" : "text-bone/25"}`}>
                    0{i + 1}
                  </span>
                  <Link
                    href={s.href}
                    className={`h-display block text-[9vw] transition-all duration-700 md:text-[5.5vw] lg:text-[4.6vw] ${
                      on ? "translate-x-2 text-bone md:translate-x-4" : "text-bone/20 hover:text-bone/50"
                    }`}
                  >
                    {s.title}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-10 h-16 md:mt-14">
            <AnimatePresence mode="wait">
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.5, ease }}
                className="flex items-center gap-6"
              >
                <p className="max-w-xs font-serif text-2xl italic text-bone/80">{SHOWCASE[idx].text}</p>
                <Link href={SHOWCASE[idx].href} className="hidden h-12 w-12 items-center justify-center rounded-full border border-bone/30 transition hover:bg-bone hover:text-ink md:flex">
                  <ArrowIcon />
                </Link>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* прогресс */}
          <div className="absolute bottom-10 left-5 right-5 flex gap-2 sm:left-8 sm:right-8 lg:left-12 lg:right-12">
            {SHOWCASE.map((_, i) => (
              <span key={i} className="h-px flex-1 bg-bone/15">
                <motion.span className="block h-full bg-bone" animate={{ scaleX: i <= idx ? 1 : 0 }} style={{ originX: 0 }} transition={{ duration: 0.6, ease }} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
