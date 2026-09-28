"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useScroll, useSpring, useTransform } from "framer-motion";
import { HERO_SPOTS } from "@/data/content";
import { HOUSES, u } from "@/data/images";
import { ease, MagneticButton, ArrowIcon } from "@/components/ui";

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(0);
  const [hover, setHover] = useState(false);

  // параллакс от мыши
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 40, damping: 20 });
  const sy = useSpring(my, { stiffness: 40, damping: 20 });
  const imgX = useTransform(sx, (v) => v * -18);
  const imgY = useTransform(sy, (v) => v * -12);
  const textX = useTransform(sx, (v) => v * 10);

  // параллакс от скролла
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);

  // авто-переключение хотспотов
  useEffect(() => {
    if (hover) return;
    const t = setInterval(() => setActive((a) => ((a ?? -1) + 1) % HERO_SPOTS.length), 3200);
    return () => clearInterval(t);
  }, [hover]);

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[680px] overflow-hidden bg-ink"
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        mx.set((e.clientX - r.left) / r.width - 0.5);
        my.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {/* фон */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <motion.div style={{ x: imgX, y: imgY }} className="h-full w-full">
          <motion.img
            src={u(HOUSES.heroAFrame, 2400)}
            alt="Дом NOVERA в сосновом лесу"
            initial={{ scale: 1.12, opacity: 0 }}
            animate={{ scale: 1.04, opacity: 1 }}
            transition={{ duration: 2.2, ease }}
            className="h-full w-full object-cover object-[center_60%]"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/10 to-ink" />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/60 via-transparent to-ink/30" />
        <div className="absolute inset-0 bg-moss-950/30 mix-blend-multiply" />
      </motion.div>

      {/* огромное слово */}
      <motion.div style={{ y: titleY, x: textX, opacity: fade }} className="pointer-events-none absolute inset-x-0 top-[13vh] md:top-[12vh]">
        <div className="container-x">
          <h1 className="h-display select-none text-center text-[min(15.5vw,248px)] leading-[0.82] text-bone">
            <span className="block overflow-hidden">
              <motion.span
                className="block"
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                transition={{ duration: 1.4, ease, delay: 0.2 }}
              >
                Novera
              </motion.span>
            </span>
          </h1>
        </div>
      </motion.div>

      {/* хотспоты */}
      <div className="absolute inset-x-0 top-[26vh] bottom-[26vh] hidden md:block" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
        {HERO_SPOTS.map((s, i) => {
          const on = active === i;
          return (
            <div key={s.label} className="absolute" style={{ left: `${s.x}%`, top: `${s.y}%` }}>
              <button
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                onClick={() => setActive(i)}
                aria-label={s.label}
                className="group relative -ml-3 -mt-3 flex h-6 w-6 items-center justify-center"
              >
                <span className={`absolute inset-0 rounded-full border border-bone/60 ${on ? "animate-pulseDot" : "opacity-0"}`} />
                <span
                  className={`h-2.5 w-2.5 rounded-full transition-all duration-500 ${
                    on ? "scale-125 bg-bone shadow-[0_0_20px_rgba(244,239,230,.8)]" : "bg-bone/60 group-hover:bg-bone"
                  }`}
                />
              </button>
              <AnimatePresence>
                {on && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4, scale: 0.98 }}
                    transition={{ duration: 0.5, ease }}
                    className={`absolute top-1/2 hidden -translate-y-1/2 sm:block ${s.x > 60 ? "right-6 text-right" : "left-6"}`}
                  >
                    <div className="h-px w-8 bg-bone/50 absolute top-1/2" style={s.x > 60 ? { right: -32 } : { left: -32 }} />
                    <Link href={s.href} className="glass block whitespace-nowrap rounded-2xl px-4 py-3 hover:bg-white/10">
                      <span className="block font-display text-[12px] font-semibold uppercase tracking-wide">{s.label}</span>
                      <span className="block text-[12px] text-bone/60">{s.hint}</span>
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* нижняя часть */}
      <div className="container-x absolute inset-x-0 bottom-0 pb-8 md:pb-12">
        <div className="grid items-end gap-8 lg:grid-cols-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7, ease }}
            className="lg:col-span-5"
          >
            <div className="glass max-w-md rounded-3xl p-5 md:p-6">
              <p className="eyebrow mb-3">Строительство домов по всей России</p>
              <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-[13px]">
                <dt className="text-bone/50">Компания</dt>
                <dd className="text-bone">NOVERA, с 2005 года</dd>
                <dt className="text-bone/50">Что делаем</dt>
                <dd className="text-bone">Дома, интерьеры, участки</dd>
                <dt className="text-bone/50">Материал</dt>
                <dd className="text-bone">Выбираете вы</dd>
                <dt className="text-bone/50">Формат</dt>
                <dd className="text-bone">Полный цикл или отдельно</dd>
              </dl>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9, ease }}
            className="flex flex-col gap-6 lg:col-span-7 lg:items-end"
          >
            <ul className="hidden flex-wrap justify-end gap-x-6 gap-y-2 text-[11px] uppercase tracking-wide2 text-bone/70 md:flex">
              {["С 2005 года", "Вся Россия", "Полный цикл", "Ваш проект или наш", "Гарантия 5 лет"].map((t) => (
                <li key={t} className="flex items-center gap-3">
                  <span className="h-1 w-1 rounded-full bg-wine-500" />
                  <span>{t}</span>
                </li>
              ))}
            </ul>
            <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <MagneticButton>
              <Link href="/pricing#calculator" data-track="cta" data-cta="hero-calc" className="btn-primary">
                Рассчитать стоимость <ArrowIcon />
              </Link>
            </MagneticButton>
            <MagneticButton>
              <Link href="/projects" data-track="cta" data-cta="hero-projects" className="btn-ghost">
                Смотреть проекты
              </Link>
            </MagneticButton>
            </div>
          </motion.div>
        </div>
      </div>

      {/* индикатор скролла */}
      <motion.div
        style={{ opacity: fade }}
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-[10px] uppercase tracking-wide3 text-bone/50 lg:flex"
      >
        <span className="relative h-10 w-px overflow-hidden bg-bone/20">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-bone"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
