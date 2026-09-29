"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { srcSet, u } from "@/data/images";

export const ease = [0.16, 1, 0.3, 1] as const;

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
  once = true,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-10% 0px" }}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Заголовок, появляющийся построчно */
export function SplitLines({ lines, className = "", delay = 0 }: { lines: string[]; className?: string; delay?: number }) {
  return (
    <span className={className}>
      {lines.map((line, i) => (
        <span key={i} className="block overflow-hidden">
          <motion.span
            className="block"
            initial={{ y: "110%" }}
            whileInView={{ y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease, delay: delay + i * 0.1 }}
          >
            {line}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`eyebrow eyebrow-dot ${className}`}>{children}</p>;
}

/** Картинка с плавным появлением и лёгким параллаксом при скролле */
export function Img({
  id,
  alt = "",
  w = 1600,
  className = "",
  imgClassName = "",
  parallax = 0,
  priority = false,
  sizes,
}: {
  id: string;
  alt?: string;
  w?: number;
  className?: string;
  imgClassName?: string;
  parallax?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  useEffect(() => {
    if (!parallax || !window.matchMedia("(min-width: 1024px) and (pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - window.innerHeight / 2;
        y.set((-center / window.innerHeight) * parallax);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [parallax, y]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img
        src={u(id, w)}
        srcSet={srcSet(id, Math.max(w, 640))}
        sizes={sizes || "(max-width: 768px) 100vw, 60vw"}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ y, scale: parallax ? 1 + Math.abs(parallax) / 600 : 1 }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease }}
        className={`h-full w-full object-cover ${imgClassName}`}
      />
    </div>
  );
}

export function Counter({ value, suffix = "", prefix = "", className = "" }: { value: number; suffix?: string; prefix?: string; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: 1800, bounce: 0 });
  const text = useTransform(spring, (v) => `${prefix}${Math.round(v).toLocaleString("ru-RU")}${suffix}`);
  useEffect(() => {
    if (inView) mv.set(value);
  }, [inView, value, mv]);
  return <motion.span ref={ref} className={className}>{text}</motion.span>;
}

export function Marquee({ items, className = "" }: { items: string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
        {row.map((it, i) => (
          <span key={i} className="flex items-center gap-10 font-serif text-2xl italic text-bone/60 md:text-3xl">
            {it}
            <span className="h-1.5 w-1.5 rounded-full bg-wine-500" />
          </span>
        ))}
      </div>
    </div>
  );
}

export function MagneticButton({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 200, damping: 18 });
  const y = useSpring(0, { stiffness: 200, damping: 18 });
  return (
    <motion.div
      ref={ref}
      style={{ x, y }}
      className={`inline-block ${className}`}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - r.left - r.width / 2) * 0.25);
        y.set((e.clientY - r.top - r.height / 2) * 0.35);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function ArrowIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}
