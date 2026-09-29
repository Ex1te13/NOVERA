"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { SHOWCASE } from "@/data/content";
import { u } from "@/data/images";
import { ArrowIcon } from "@/components/ui";

const AUTO_MS = 5000;

/**
 * «Что мы делаем»: обычная прокрутка страницы, без залипания.
 * Компьютер — список слева, фото справа (наведение или клик, плюс автосмена).
 * Телефон — карточки, которые листаются пальцем вбок.
 */
export function ShowcaseScroll() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { margin: "-20% 0px" });
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!inView || paused) return;
    const t = setTimeout(() => setIdx((i) => (i + 1) % SHOWCASE.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [idx, inView, paused]);

  return (
    <section ref={ref} className="relative bg-ink py-24 md:py-32">
      <div className="container-x">
        <p className="eyebrow eyebrow-dot mb-10 md:mb-14">Что мы делаем</p>

        <div className="hidden gap-12 lg:grid lg:grid-cols-12" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
          <div className="flex flex-col justify-center lg:col-span-5">
            <ul className="space-y-2">
              {SHOWCASE.map((s, i) => {
                const on = i === idx;
                return (
                  <li key={s.title}>
                    <Link
                      href={s.href}
                      onMouseEnter={() => setIdx(i)}
                      onFocus={() => setIdx(i)}
                      className="group flex items-baseline gap-6"
                    >
                      <span className={`font-mono text-[11px] tabular-nums transition-colors duration-300 ${on ? "text-wine-400" : "text-bone/25"}`}>0{i + 1}</span>
                      <span
                        className={`h-display block text-[3.4vw] transition-[color,transform] duration-500 xl:text-[3vw] ${
                          on ? "translate-x-3 text-bone" : "text-bone/20 group-hover:text-bone/50"
                        }`}
                      >
                        {s.title}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-10 flex min-h-16 items-center gap-6">
              <p key={idx} className="max-w-xs animate-fadeUp font-serif text-2xl italic text-bone/80">
                {SHOWCASE[idx].text}
              </p>
              <Link
                href={SHOWCASE[idx].href}
                aria-label={SHOWCASE[idx].title}
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-bone/30 transition hover:bg-bone hover:text-ink"
              >
                <ArrowIcon />
              </Link>
            </div>
          </div>

          <div className="relative h-[72vh] max-h-[760px] overflow-hidden rounded-[2rem] lg:col-span-7">
            {SHOWCASE.map((s, i) => (
              <img
                key={s.id}
                src={u(s.id, 1200)}
                srcSet={`${u(s.id, 1080)} 1080w, ${u(s.id, 1920)} 1920w`}
                sizes="60vw"
                alt={s.title}
                loading="lazy"
                decoding="async"
                className={`absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-700 ease-out ${
                  i === idx ? "scale-100 opacity-100" : "scale-[1.04] opacity-0"
                }`}
              />
            ))}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-6 flex gap-2">
              {SHOWCASE.map((s, i) => (
                <button key={s.id} onClick={() => setIdx(i)} aria-label={s.title} className="h-6 flex-1">
                  <span className="block h-px w-full bg-bone/20">
                    <span className={`block h-full origin-left bg-bone transition-transform duration-500 ${i <= idx ? "scale-x-100" : "scale-x-0"}`} />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <MobileCards />
    </section>
  );
}

function MobileCards() {
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const onScroll = () => {
    const el = track.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    if (!card) return;
    setActive(Math.round(el.scrollLeft / (card.offsetWidth + 16)));
  };

  return (
    <div className="lg:hidden">
      <div
        ref={track}
        onScroll={onScroll}
        className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain scroll-px-5 px-5 pb-2 sm:scroll-px-8 sm:px-8"
      >
        {SHOWCASE.map((s, i) => (
          <Link
            key={s.id}
            href={s.href}
            className="relative block aspect-[4/5] w-[80vw] max-w-[420px] shrink-0 snap-start overflow-hidden rounded-[1.75rem]"
          >
            <img
              src={u(s.id, 828)}
              srcSet={`${u(s.id, 640)} 640w, ${u(s.id, 828)} 828w, ${u(s.id, 1080)} 1080w`}
              sizes="80vw"
              alt={s.title}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <span className="font-mono text-[11px] text-wine-400">0{i + 1}</span>
              <h3 className="h-display mt-2 text-3xl">{s.title}</h3>
              <p className="mt-2 font-serif text-xl italic text-bone/80">{s.text}</p>
            </div>
            <span className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full border border-bone/30 bg-ink/40">
              <ArrowIcon />
            </span>
          </Link>
        ))}
      </div>
      <div className="container-x mt-6 flex gap-2" aria-hidden>
        {SHOWCASE.map((s, i) => (
          <span key={s.id} className={`h-1 rounded-full transition-all duration-300 ${i === active ? "w-8 bg-bone" : "w-3 bg-bone/25"}`} />
        ))}
      </div>
    </div>
  );
}
