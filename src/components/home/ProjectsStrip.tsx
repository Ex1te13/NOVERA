"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { projects } from "@/data/projects";
import { u } from "@/data/images";
import { ArrowIcon, Eyebrow, Reveal } from "@/components/ui";

export function ProjectsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["4%", "-30%"]);
  const featured = projects.slice(0, 7);

  return (
    <section className="relative overflow-hidden bg-ink py-24 md:py-36">
      <div className="container-x mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <Eyebrow>Проекты</Eyebrow>
          <h2 className="h-display mt-4 text-4xl md:text-6xl">
            Построено <span className="h-serif normal-case tracking-normal text-wine-400">и обжито</span>
          </h2>
        </div>
        <Link href="/projects" className="btn-ghost self-start md:self-auto">
          Все проекты <ArrowIcon />
        </Link>
      </div>

      <div ref={ref}>
        <motion.div style={{ x }} className="flex gap-5 pl-5 sm:pl-8 lg:pl-12">
          {featured.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.05} className="shrink-0">
              <Link href={`/projects/${p.slug}`} className="group relative block w-[78vw] overflow-hidden rounded-[1.75rem] sm:w-[48vw] lg:w-[30vw]">
                <div className={`aspect-[4/5] ${i % 3 === 1 ? "lg:aspect-[3/4]" : ""}`}>
                  <img
                    src={u(p.cover, 1200)}
                    alt={p.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-105"
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-ink/95 via-ink/40 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <p className="eyebrow mb-3 text-bone/60">
                    {p.location} · {p.year}
                  </p>
                  <h3 className="font-display text-2xl font-semibold uppercase tracking-tight md:text-3xl">{p.title}</h3>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-[12px] text-bone/70">
                      {p.area} · {p.material}
                    </span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-bone/30 transition-all duration-500 group-hover:bg-bone group-hover:text-ink">
                      <ArrowIcon />
                    </span>
                  </div>
                </div>
                <span
                  className={`absolute left-6 top-6 rounded-full px-3 py-1 text-[10px] uppercase tracking-wide2 ${
                    p.accent === "moss" ? "bg-moss-700/80" : "bg-wine-700/80"
                  } backdrop-blur`}
                >
                  {p.works.length} видов работ
                </span>
              </Link>
            </Reveal>
          ))}
          <div className="w-[10vw] shrink-0" />
        </motion.div>
      </div>
    </section>
  );
}
