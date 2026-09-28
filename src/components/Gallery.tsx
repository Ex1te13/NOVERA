"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { GalleryItem } from "@/data/projects";
import { u } from "@/data/images";
import { ArrowIcon, ease } from "./ui";

const KINDS: { id: GalleryItem["kind"] | "all"; label: string }[] = [
  { id: "all", label: "Всё" },
  { id: "house", label: "Дом" },
  { id: "interior", label: "Интерьер" },
  { id: "finish", label: "Отделка" },
  { id: "land", label: "Участок" },
  { id: "extra", label: "Террасы и детали" },
];

export function Gallery({ items }: { items: GalleryItem[] }) {
  const [kind, setKind] = useState<(typeof KINDS)[number]["id"]>("all");
  const [open, setOpen] = useState<number | null>(null);
  const list = kind === "all" ? items : items.filter((i) => i.kind === kind);
  const available = new Set(items.map((i) => i.kind));

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (d: number) => setOpen((o) => (o === null ? o : (o + d + list.length) % list.length)),
    [list.length]
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open, close, step]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap gap-2">
        {KINDS.filter((k) => k.id === "all" || available.has(k.id as GalleryItem["kind"])).map((k) => (
          <button key={k.id} onClick={() => setKind(k.id)} className={`chip ${kind === k.id ? "chip-on" : ""}`}>
            {k.label}
          </button>
        ))}
      </div>

      <motion.div layout className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
        <AnimatePresence mode="popLayout">
          {list.map((it, i) => (
            <motion.button
              layout
              key={it.id + it.caption}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.5, ease }}
              onClick={() => setOpen(i)}
              className={`group relative overflow-hidden rounded-2xl text-left ${i % 5 === 0 ? "col-span-2 aspect-[16/10]" : "aspect-[4/5]"}`}
            >
              <img
                src={u(it.id, 1400)}
                alt={it.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-100" />
              <span className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="text-[13px]">{it.caption}</span>
                <span className="eyebrow text-bone/50">{KINDS.find((k) => k.id === it.kind)?.label}</span>
              </span>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {open !== null && list[open] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/95 backdrop-blur-xl"
            onClick={close}
          >
            <button onClick={close} aria-label="Закрыть" className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/20 text-2xl hover:bg-white/10">
              ×
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
              aria-label="Назад"
              className="absolute left-4 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 md:flex"
            >
              <ArrowIcon className="h-5 w-5 rotate-180" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
              aria-label="Вперёд"
              className="absolute right-4 top-1/2 hidden h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 hover:bg-white/10 md:flex"
            >
              <ArrowIcon className="h-5 w-5" />
            </button>
            <AnimatePresence mode="wait">
              <motion.figure
                key={list[open].id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease }}
                className="max-h-[90vh] max-w-[92vw] md:max-w-[84vw]"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={u(list[open].id, 2200)} alt={list[open].caption} className="max-h-[80vh] w-auto rounded-2xl object-contain" />
                <figcaption className="mt-4 flex items-center justify-between text-[13px] text-mist">
                  <span>{list[open].caption}</span>
                  <span className="font-mono">
                    {open + 1} / {list.length}
                  </span>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
