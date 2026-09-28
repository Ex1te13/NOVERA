"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { projects } from "@/data/projects";
import { u } from "@/data/images";
import { ArrowIcon, ease } from "./ui";

const FILTERS = [
  { id: "all", label: "Все", test: () => true },
  { id: "turnkey", label: "Под ключ", test: (w: string[]) => w.some((x) => /под ключ/i.test(x)) },
  { id: "interior", label: "Интерьер", test: (w: string[]) => w.some((x) => /дизайн|отделк/i.test(x)) },
  { id: "landscape", label: "Ландшафт", test: (w: string[]) => w.some((x) => /ландшафт|газон|озелен|благоустр/i.test(x)) },
  { id: "own", label: "Проект заказчика", test: (w: string[]) => w.some((x) => /заказчика|клиента/i.test(x)) },
];

export function ProjectsGrid() {
  const [f, setF] = useState("all");
  const filter = FILTERS.find((x) => x.id === f)!;
  const list = projects.filter((p) => filter.test(p.works));

  return (
    <section className="bg-ink pb-24 md:pb-36">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap gap-2">
          {FILTERS.map((x) => (
            <button key={x.id} onClick={() => setF(x.id)} className={`chip ${f === x.id ? "chip-on" : ""}`}>
              {x.label}
            </button>
          ))}
          <span className="ml-auto self-center font-mono text-[12px] text-ash">{list.length} проектов</span>
        </div>

        <motion.div layout className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <motion.div
                layout
                key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, ease, delay: (i % 6) * 0.04 }}
                className={i % 7 === 0 ? "md:col-span-2 lg:col-span-2" : ""}
              >
                <Link href={`/projects/${p.slug}`} className="group relative block overflow-hidden rounded-[1.75rem]">
                  <div className={i % 7 === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}>
                    <img
                      src={u(p.cover, i % 7 === 0 ? 1800 : 1200)}
                      alt={p.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/30 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                    <p className="eyebrow mb-3 text-bone/60">
                      {p.location} · {p.year}
                    </p>
                    <h3 className="font-display text-2xl font-semibold uppercase tracking-tight md:text-3xl">{p.title}</h3>
                    <p className="mt-2 max-w-md text-[13px] text-bone/70">{p.subtitle}</p>
                    <div className="mt-5 flex items-center justify-between">
                      <span className="text-[12px] text-bone/60">
                        {p.area} · {p.material}
                      </span>
                      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/30 transition-all duration-500 group-hover:bg-bone group-hover:text-ink">
                        <ArrowIcon />
                      </span>
                    </div>
                  </div>
                  <span className={`absolute left-6 top-6 rounded-full px-3 py-1 text-[10px] uppercase tracking-wide2 backdrop-blur ${p.accent === "moss" ? "bg-moss-700/80" : "bg-wine-700/80"}`}>
                    {p.gallery.length} фото
                  </span>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
