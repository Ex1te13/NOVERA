"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FORM_SERVICES, REGIONS } from "@/data/content";
import { formatMoney } from "@/lib/calculator";
import { getTrackingContext, track } from "./AnalyticsTracker";
import { CALC_KEY } from "./Calculator";
import { ArrowIcon, ease } from "./ui";

type Calc = { total?: number; lines?: { label: string; amount: number }[]; input?: { area?: number; packLabel?: string; materialLabel?: string; floors?: number } };

const MAX_FILES = 5;
const ACCEPT = ".pdf,.jpg,.jpeg,.png,.webp,.gif,.heic,image/*,application/pdf";

export function LeadForm({ compact = false, source = "site" }: { compact?: boolean; source?: string }) {
  const [calc, setCalc] = useState<Calc | null>(null);
  const [useCalc, setUseCalc] = useState(true);
  const [services, setServices] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [area, setArea] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [error, setError] = useState("");
  const [drag, setDrag] = useState(false);
  const started = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(CALC_KEY);
      if (raw) {
        const c = JSON.parse(raw) as Calc;
        if (c?.total) {
          setCalc(c);
          if (c.input?.area) setArea(String(c.input.area));
          const auto: string[] = [];
          if (c.input?.packLabel) auto.push(c.input.packLabel === "Под ключ" ? "Строительство под ключ" : c.input.packLabel === "Тёплый контур" ? "Тёплый контур" : "Предчистовая отделка");
          for (const l of c.lines || []) {
            if (/Архитектурный/.test(l.label)) auto.push("Проектирование");
            if (/Дизайн/.test(l.label)) auto.push("Дизайн интерьера");
            if (/Ландшафт/.test(l.label)) auto.push("Ландшафтный проект");
            if (/Газон/.test(l.label)) auto.push("Газон");
            if (/Озеленение/.test(l.label)) auto.push("Озеленение и деревья");
            if (/Освещение/.test(l.label)) auto.push("Освещение участка");
            if (/Терраса|Беседка/.test(l.label)) auto.push("Терраса / беседка");
          }
          setServices(Array.from(new Set(auto)).filter((s) => FORM_SERVICES.includes(s)));
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  const onStart = () => {
    if (!started.current) {
      started.current = true;
      track("form_start", { source });
    }
  };

  const addFiles = (list: FileList | File[]) => {
    setError("");
    const incoming = Array.from(list).filter((f) => /\.(pdf|jpe?g|png|webp|gif|heic|heif)$/i.test(f.name) || f.type.startsWith("image/") || f.type === "application/pdf");
    if (incoming.length !== Array.from(list).length) setError("Принимаем только PDF и изображения");
    setFiles((prev) => [...prev, ...incoming].slice(0, MAX_FILES));
  };

  const toggle = (s: string) => setServices((v) => (v.includes(s) ? v.filter((x) => x !== s) : [...v, s]));

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    fd.delete("files");
    files.forEach((f) => fd.append("files", f));
    fd.set("services", JSON.stringify(services));
    fd.set("calculator", JSON.stringify(useCalc && calc ? calc : {}));
    fd.set("source", source);
    const ctx = getTrackingContext();
    fd.set("utm", JSON.stringify(ctx.utm || {}));
    fd.set("referrer", ctx.referrer || "");
    fd.set("referral_code", ctx.referral_code || "");
    fd.set("landing_page", ctx.landing_page || "");
    fd.set("visitor_id", ctx.visitor_id || "");
    fd.set("session_id", ctx.session_id || "");
    setState("sending");
    try {
      const res = await fetch("/api/leads", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Ошибка отправки");
      setState("ok");
      track("lead_submit", { id: data.id, source });
      sessionStorage.removeItem(CALC_KEY);
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Не удалось отправить заявку");
    }
  };

  if (state === "ok") {
    return (
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease }} className="rounded-[2rem] bg-moss-900/60 p-10 text-center md:p-16">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.2 }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-moss-500"
        >
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12l5 5L20 7" />
          </svg>
        </motion.div>
        <h3 className="h-display mt-8 text-3xl md:text-4xl">Заявка отправлена</h3>
        <p className="mx-auto mt-4 max-w-md text-mist">
          Спасибо! Менеджер NOVERA свяжется с вами в течение рабочего дня. Если удобнее — напишите нам в Telegram.
        </p>
        <button onClick={() => setState("idle")} className="btn-ghost mt-8">
          Отправить ещё одну
        </button>
      </motion.div>
    );
  }

  return (
    <form ref={formRef} onSubmit={submit} onFocus={onStart} className="space-y-10" noValidate>
      <AnimatePresence>
        {calc && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="rounded-2xl border border-moss-700/60 bg-moss-900/40 p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="eyebrow">Расчёт из калькулятора</p>
                <p className="mt-2 font-display text-2xl font-bold">{formatMoney(calc.total || 0)}</p>
                <p className="mt-1 text-[12px] text-mist">
                  {[calc.input?.area && `${calc.input.area} м²`, calc.input?.floors && `${calc.input.floors} эт.`, calc.input?.materialLabel, calc.input?.packLabel].filter(Boolean).join(" · ")}
                </p>
              </div>
              <label className="flex cursor-pointer items-center gap-2 text-[12px] text-mist">
                <input type="checkbox" checked={useCalc} onChange={(e) => setUseCalc(e.target.checked)} className="h-4 w-4 accent-moss-500" />
                Приложить к заявке
              </label>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`grid gap-8 ${compact ? "md:grid-cols-2" : "md:grid-cols-2"}`}>
        <div>
          <label className="label" htmlFor="name">
            Имя *
          </label>
          <input id="name" name="name" required placeholder="Как к вам обращаться" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="phone">
            Телефон *
          </label>
          <input id="phone" name="phone" type="tel" required placeholder="+7 (___) ___-__-__" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="email">
            Email *
          </label>
          <input id="email" name="email" type="email" required placeholder="name@example.ru" className="field" />
        </div>
        <div>
          <label className="label" htmlFor="region">
            Регион
          </label>
          <select id="region" name="region" className="field appearance-none" defaultValue="">
            <option value="" disabled>
              Выберите регион
            </option>
            {REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span className="label">Какие услуги интересуют</span>
        <div className="mt-3 flex flex-wrap gap-2">
          {FORM_SERVICES.map((s) => (
            <button type="button" key={s} onClick={() => toggle(s)} className={`chip ${services.includes(s) ? "chip-on" : ""}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div>
          <label className="label" htmlFor="area">
            Площадь, м²
          </label>
          <input id="area" name="area" type="number" min={0} value={area} onChange={(e) => setArea(e.target.value)} placeholder="180" className="field" />
        </div>
        <div className="md:col-span-2">
          <label className="label" htmlFor="description">
            Описание проекта
          </label>
          <textarea id="description" name="description" rows={3} placeholder="Участок, пожелания, сроки — всё, что считаете важным" className="field resize-none" />
        </div>
      </div>

      <div>
        <span className="label">Файлы — до 5, PDF или изображения</span>
        <label
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDrag(false);
            addFiles(e.dataTransfer.files);
          }}
          className={`mt-3 flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-6 py-8 text-center transition-colors ${
            drag ? "border-moss-400 bg-moss-900/40" : "border-white/20 hover:border-white/40"
          }`}
        >
          <input type="file" name="files" multiple accept={ACCEPT} className="hidden" onChange={(e) => e.target.files && addFiles(e.target.files)} />
          <span className="text-[13px] text-bone/80">Перетащите файлы сюда или нажмите, чтобы выбрать</span>
          <span className="mt-1 text-[11px] text-ash">Планировки, эскизы, фото участка, референсы</span>
        </label>
        {files.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {files.map((f, i) => (
              <li key={f.name + i} className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[12px]">
                <span className="max-w-[180px] truncate">{f.name}</span>
                <span className="text-ash">{Math.max(1, Math.round(f.size / 1024))} КБ</span>
                <button type="button" onClick={() => setFiles((v) => v.filter((_, j) => j !== i))} aria-label="Удалить" className="text-ash hover:text-bone">
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <label className="flex cursor-pointer items-start gap-3 text-[13px] text-mist">
        <input type="checkbox" name="consent" value="true" required className="mt-1 h-4 w-4 accent-moss-500" />
        <span>
          Согласен(на) на обработку персональных данных в соответствии с{" "}
          <a href="/privacy" className="underline hover:text-bone">
            политикой конфиденциальности
          </a>
          .
        </span>
      </label>

      {error && <p className="rounded-xl border border-wine-600/50 bg-wine-900/30 px-4 py-3 text-[13px] text-wine-400">{error}</p>}

      <button type="submit" disabled={state === "sending"} data-track="cta" data-cta="lead-submit" className="btn-primary w-full md:w-auto">
        {state === "sending" ? "Отправляем…" : "Отправить заявку"} <ArrowIcon />
      </button>
    </form>
  );
}
