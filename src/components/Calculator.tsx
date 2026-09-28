"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { calculate, defaultCalculator, EXTRAS, formatMoney, MATERIALS, PACKAGES, type CalculatorInput } from "@/lib/calculator";
import { track } from "./AnalyticsTracker";
import { ArrowIcon, ease } from "./ui";

export const CALC_KEY = "nv_calc";

function Range({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  onChange: (v: number) => void;
}) {
  const p = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-end justify-between">
        <span className="label mb-0">{label}</span>
        <span className="font-display text-2xl font-semibold tabular-nums">
          {value.toLocaleString("ru-RU")} <span className="text-sm font-normal text-mist">{unit}</span>
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        style={{ ["--p" as string]: `${p}%` }}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full"
      />
      <div className="mt-2 flex justify-between text-[11px] text-ash">
        <span>
          {min} {unit}
        </span>
        <span>
          {max} {unit}
        </span>
      </div>
    </div>
  );
}

function AnimatedMoney({ value }: { value: number }) {
  const mv = useMotionValue(value);
  const spring = useSpring(mv, { stiffness: 120, damping: 24 });
  const text = useTransform(spring, (v) => formatMoney(Math.round(v)));
  useEffect(() => {
    mv.set(value);
  }, [value, mv]);
  return <motion.span>{text}</motion.span>;
}

export function Calculator({ onResult }: { onResult?: (r: ReturnType<typeof calculate>) => void }) {
  const [input, setInput] = useState<CalculatorInput>(defaultCalculator());
  const result = useMemo(() => calculate(input), [input]);
  const touched = useRef(false);

  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(CALC_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.input) setInput({ ...defaultCalculator(), ...parsed.input });
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(CALC_KEY, JSON.stringify(result));
    onResult?.(result);
    if (touched.current) {
      const t = setTimeout(() => track("calculator", { total: result.total, pack: input.pack, material: input.material, area: input.area }), 1200);
      return () => clearTimeout(t);
    }
  }, [result, onResult, input.pack, input.material, input.area]);

  const set = <K extends keyof CalculatorInput>(k: K, v: CalculatorInput[K]) => {
    touched.current = true;
    setInput((s) => ({ ...s, [k]: v }));
  };
  const toggle = (id: string) => {
    touched.current = true;
    setInput((s) => ({ ...s, extras: s.extras.includes(id) ? s.extras.filter((e) => e !== id) : [...s.extras, id] }));
  };
  const has = (id: string) => input.extras.includes(id);

  return (
    <div className="grid gap-8 lg:grid-cols-12">
      <div className="space-y-12 lg:col-span-7">
        <Range label="Площадь дома" value={input.area} min={60} max={600} step={5} unit="м²" onChange={(v) => set("area", v)} />

        <div>
          <span className="label">Этажность</span>
          <div className="mt-3 flex gap-2">
            {[1, 2, 3].map((f) => (
              <button key={f} onClick={() => set("floors", f)} className={`chip flex-1 py-3 ${input.floors === f ? "chip-on" : ""}`}>
                {f} {f === 1 ? "этаж" : "этажа"}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="label">Материал стен</span>
          <div className="mt-3 flex flex-wrap gap-2">
            {MATERIALS.map((m) => (
              <button key={m.id} onClick={() => set("material", m.id)} className={`chip ${input.material === m.id ? "chip-on" : ""}`}>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="label">Комплектация</span>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            {PACKAGES.map((p) => {
              const on = input.pack === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => set("pack", p.id)}
                  className={`rounded-2xl border p-4 text-left transition-all duration-300 ${
                    on ? "border-moss-400 bg-moss-800/50" : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span className="block font-display text-sm font-semibold uppercase">{p.label}</span>
                  <span className="mt-1 block font-serif text-xl italic text-moss-400">от {formatMoney(p.price)}/м²</span>
                  <span className="mt-2 block text-[12px] text-mist">{p.hint}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <span className="label">Дополнительно</span>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {EXTRAS.map((e) => {
              const on = has(e.id);
              return (
                <button
                  key={e.id}
                  onClick={() => toggle(e.id)}
                  className={`flex items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-300 ${
                    on ? "border-wine-500 bg-wine-900/40" : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${on ? "border-wine-400 bg-wine-500" : "border-white/30"}`}>
                      {on && (
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M2 6l3 3 5-6" />
                        </svg>
                      )}
                    </span>
                    <span className="text-[14px]">{e.label}</span>
                  </span>
                  <span className="text-[11px] text-mist">{e.price}</span>
                </button>
              );
            })}
          </div>
        </div>

        <AnimatePresence>
          {(has("lawn") || has("trees") || has("terrace")) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.5, ease }}
              className="space-y-10 overflow-hidden"
            >
              {has("lawn") && <Range label="Площадь газона" value={input.lawnArea} min={50} max={3000} step={50} unit="м²" onChange={(v) => set("lawnArea", v)} />}
              {has("trees") && <Range label="Крупномеры и деревья" value={input.treeCount} min={1} max={60} unit="шт." onChange={(v) => set("treeCount", v)} />}
              {has("terrace") && <Range label="Площадь террасы" value={input.terraceArea} min={10} max={150} step={5} unit="м²" onChange={(v) => set("terraceArea", v)} />}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* итог */}
      <div className="lg:col-span-5">
        <div className="sticky top-28 overflow-hidden rounded-[2rem] bg-gradient-to-br from-moss-900 via-coal to-wine-950 p-7 md:p-9">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-moss-600/30 blur-[90px]" />
          <p className="eyebrow">Предварительный расчёт</p>
          <p className="mt-4 font-display text-4xl font-bold tabular-nums tracking-tight md:text-5xl">
            <AnimatedMoney value={result.total} />
          </p>
          <p className="mt-2 text-[12px] text-mist">
            ≈ {formatMoney(Math.round(result.total / Math.max(1, input.area)))} за м² · {input.area} м² · {input.floors} эт.
          </p>

          <ul className="mt-8 space-y-3 border-t border-white/10 pt-6 text-[13px]">
            <AnimatePresence initial={false}>
              {result.lines.map((l) => (
                <motion.li
                  key={l.label}
                  layout
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.35 }}
                  className="flex justify-between gap-4"
                >
                  <span className="text-bone/70">{l.label}</span>
                  <span className={`shrink-0 tabular-nums ${l.amount < 0 ? "text-moss-400" : ""}`}>{l.amount === 0 ? "—" : formatMoney(l.amount)}</span>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>

          <Link
            href="/contacts#form"
            data-track="cta"
            data-cta="calc-to-form"
            onClick={() => sessionStorage.setItem(CALC_KEY, JSON.stringify(result))}
            className="btn-primary mt-8 w-full"
          >
            Получить точную смету <ArrowIcon />
          </Link>
          <p className="mt-4 text-[11px] leading-relaxed text-ash">
            Расчёт ориентировочный и не является публичной офертой. Точная стоимость — после выезда на участок и согласования проекта.
          </p>
        </div>
      </div>
    </div>
  );
}
