"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { REVIEWS } from "@/data/content";
import { getProject } from "@/data/projects";
import { u } from "@/data/images";
import { ArrowIcon, ease, Eyebrow } from "@/components/ui";

export function ReviewsCarousel({ compact = false }: { compact?: boolean }) {
  const [i, setI] = useState(0);
  const r = REVIEWS[i];
  const project = getProject(r.project);
  const next = () => setI((v) => (v + 1) % REVIEWS.length);
  const prev = () => setI((v) => (v - 1 + REVIEWS.length) % REVIEWS.length);

  return (
    <section className={`relative bg-ink ${compact ? "py-16" : "py-20 md:py-24"}`}>
      <div className="container-x">
        {!compact && (
          <div className="mb-10 flex items-end justify-between">
            <div>
              <Eyebrow>Отзывы</Eyebrow>
              <h2 className="h-display mt-4 text-4xl md:text-6xl">Говорят заказчики</h2>
            </div>
            <Link href="/reviews" className="link-line hidden text-[11px] uppercase tracking-wide2 md:inline-block">
              Все отзывы
            </Link>
          </div>
        )}

        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="relative aspect-[4/3] overflow-hidden rounded-[2rem] lg:col-span-5 lg:aspect-auto lg:h-[min(54vh,460px)]">
            <AnimatePresence mode="sync">
              {project && (
                <motion.img
                  key={project.slug}
                  src={u(project.cover, 1200)}
                  alt={project.title}
                  initial={{ opacity: 0, scale: 1.06 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1, ease }}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
            </AnimatePresence>
            <div className="absolute inset-0 bg-gradient-to-t from-ink/80 to-transparent" />
            {project && (
              <Link href={`/projects/${project.slug}`} className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                <span>
                  <span className="eyebrow block text-bone/60">Проект</span>
                  <span className="font-display text-xl font-semibold uppercase">{project.title}</span>
                </span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-bone/30">
                  <ArrowIcon />
                </span>
              </Link>
            )}
          </div>

          <div className="lg:col-span-7 lg:pl-8">
            <span className="font-serif text-[90px] leading-none text-wine-600">“</span>
            <AnimatePresence mode="wait">
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.6, ease }}
                className="-mt-12"
              >
                <p className="font-serif text-xl italic leading-snug text-bone/90 md:text-2xl xl:text-[1.75rem]">{r.text}</p>
                <div className="mt-6 flex items-center gap-4">
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-moss-800 font-display text-sm font-bold">
                    {r.name.slice(0, 1)}
                  </span>
                  <div>
                    <p className="font-semibold">{r.name}</p>
                    <p className="text-[12px] uppercase tracking-wide2 text-bone/50">
                      {r.projectTitle} · {r.location}
                    </p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex items-center gap-4">
              <button onClick={prev} aria-label="Предыдущий" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition hover:bg-bone hover:text-ink">
                <ArrowIcon className="h-4 w-4 rotate-180" />
              </button>
              <button onClick={next} aria-label="Следующий" className="flex h-12 w-12 items-center justify-center rounded-full border border-white/20 transition hover:bg-bone hover:text-ink">
                <ArrowIcon />
              </button>
              <span className="ml-4 font-mono text-[12px] text-bone/50">
                {String(i + 1).padStart(2, "0")} / {String(REVIEWS.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
