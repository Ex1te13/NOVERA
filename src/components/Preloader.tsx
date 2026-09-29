"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const MIN_VISIBLE_MS = 1500;
const MAX_WAIT_MS = 4000;
const EXIT_MS = 1000;
const WORD = "NOVERA";

type Phase = "loading" | "leaving" | "done";

export function Preloader() {
  const path = usePathname();
  const [phase, setPhase] = useState<Phase>("loading");
  const counter = useRef<HTMLSpanElement>(null);
  const bar = useRef<HTMLSpanElement>(null);
  const skip = path?.startsWith("/admin");

  useEffect(() => {
    if (skip) return;
    if (performance.now() > 6000) {
      setPhase("done");
      return;
    }
    const root = document.documentElement;
    root.style.overflow = "hidden";

    let loaded = document.readyState === "complete";
    let shown = 0;
    let frame = 0;
    let finished = false;
    const onLoad = () => {
      loaded = true;
    };
    window.addEventListener("load", onLoad);

    const tick = () => {
      const elapsed = performance.now();
      const ready = (loaded && elapsed >= MIN_VISIBLE_MS) || elapsed >= MAX_WAIT_MS;
      const target = ready ? 100 : Math.min(92, (elapsed / MIN_VISIBLE_MS) * 92);
      shown += (target - shown) * (ready ? 0.22 : 0.08);
      if (ready && 100 - shown < 0.5) shown = 100;
      const value = Math.round(shown);
      if (counter.current) counter.current.textContent = String(value).padStart(2, "0");
      if (bar.current) bar.current.style.transform = `scaleX(${shown / 100})`;
      if (shown >= 100 && !finished) {
        finished = true;
        setPhase("leaving");
        root.style.overflow = "";
        window.setTimeout(() => setPhase("done"), EXIT_MS);
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("load", onLoad);
      root.style.overflow = "";
    };
  }, [skip]);

  if (skip || phase === "done") return null;

  return (
    <div className={`preloader ${phase === "leaving" ? "preloader-leave" : ""}`} role="status" aria-label="Загрузка сайта NOVERA">
      <div className="preloader-glow" aria-hidden />
      <div className="preloader-inner">
        <svg viewBox="0 0 48 48" fill="none" className="preloader-mark" aria-hidden>
          <path
            d="M8 40V12l16 16 16-16v28"
            pathLength={1}
            className="preloader-stroke"
            stroke="currentColor"
            strokeWidth="2.4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path d="M8 40h32" pathLength={1} className="preloader-base" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="24" cy="34" r="2.4" className="preloader-dot" />
        </svg>

        <p className="preloader-word" aria-hidden>
          {WORD.split("").map((letter, i) => (
            <span key={i} style={{ animationDelay: `${0.55 + i * 0.07}s` }}>
              {letter}
            </span>
          ))}
        </p>
        <p className="preloader-tagline">дома · интерьеры · участки</p>

        <div className="preloader-footer" aria-hidden>
          <span className="preloader-track">
            <span ref={bar} className="preloader-bar" />
          </span>
          <span className="preloader-count">
            <span ref={counter}>00</span>%
          </span>
        </div>
      </div>
    </div>
  );
}
