"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { SERVICES } from "@/data/content";
import { u } from "@/data/images";
import { ArrowIcon, ease, Eyebrow, Reveal } from "@/components/ui";

export function ServicesAccordion() {
  const [open, setOpen] = useState(0);
  return (
    <section data-hide-header className="relative bg-coal py-24 md:py-36">
      <div className="container-x">
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Eyebrow>Услуги</Eyebrow>
            <h2 className="h-display mt-4 text-4xl md:text-6xl">
              Пять направлений.
              <br />
              <span className="h-serif normal-case tracking-normal text-moss-400">Один</span> подрядчик.
            </h2>
          </div>
          <p className="max-w-sm text-mist">
            Можно заказать всё сразу — от проекта до газона. Или только то, что нужно сейчас.
          </p>
        </div>

        <div className="grid items-start gap-10 lg:grid-cols-12">
          {/* картинка */}
          <div className="relative hidden h-[min(72vh,620px)] overflow-hidden rounded-[2rem] lg:sticky lg:top-24 lg:col-span-5 lg:block">
            <AnimatePresence mode="sync">
              <motion.img
                key={SERVICES[open].image}
                src={u(SERVICES[open].image, 1200)}
                alt={SERVICES[open].title}
                initial={{ opacity: 0, scale: 1.06 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="font-display text-6xl font-black text-bone/20">{SERVICES[open].index}</p>
              <p className="mt-2 font-serif text-3xl italic">{SERVICES[open].short}</p>
            </div>
          </div>

          {/* список */}
          <div className="lg:col-span-7">
            {SERVICES.map((s, i) => {
              const on = open === i;
              return (
                <Reveal key={s.id} delay={i * 0.05}>
                  <div
                    onMouseEnter={() => setOpen(i)}
                    onClick={() => setOpen(i)}
                    className={`group cursor-pointer border-t border-white/10 py-6 transition-colors md:py-8 ${on ? "" : "hover:border-white/30"}`}
                  >
                    <div className="flex items-start gap-5 md:gap-8">
                      <span className={`mt-2 font-mono text-[11px] transition-colors ${on ? "text-wine-400" : "text-bone/40"}`}>{s.index}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between gap-4">
                          <h3 className={`font-display text-xl font-semibold uppercase tracking-tight transition-colors md:text-3xl ${on ? "text-bone" : "text-bone/60 group-hover:text-bone"}`}>
                            {s.title}
                          </h3>
                          <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-500 ${on ? "rotate-90 border-bone bg-bone text-ink" : "border-white/20"}`}>
                            <ArrowIcon />
                          </span>
                        </div>
                        <AnimatePresence initial={false}>
                          {on && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.6, ease }}
                              className="overflow-hidden"
                            >
                              <div className="grid gap-6 pt-5 md:grid-cols-2">
                                <p className="text-mist">{s.description}</p>
                                <div>
                                  <ul className="flex flex-wrap gap-2">
                                    {s.items.map((it) => (
                                      <li key={it} className="rounded-full border border-white/10 px-3 py-1 text-[12px] text-bone/80">
                                        {it}
                                      </li>
                                    ))}
                                  </ul>
                                  <div className="mt-5 flex items-center justify-between">
                                    <span className="font-serif text-2xl italic text-moss-400">{s.price}</span>
                                    <Link href={`/services#${s.id}`} className="link-line text-[11px] uppercase tracking-wide2">
                                      Подробнее
                                    </Link>
                                  </div>
                                </div>
                              </div>
                              <div className="mt-6 aspect-[16/9] overflow-hidden rounded-2xl lg:hidden">
                                <img src={u(s.image, 1200)} alt="" className="h-full w-full object-cover" />
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
            <div className="border-t border-white/10" />
          </div>
        </div>
      </div>
    </section>
  );
}
