"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PERIODS } from "@/lib/periods";
import type { analyticsSummary, cohorts, weeklySummaries } from "@/lib/analytics";

type Data = { summary: ReturnType<typeof analyticsSummary>; weekly: ReturnType<typeof weeklySummaries>; cohorts: ReturnType<typeof cohorts> };

function Bars({ data, keys, colors }: { data: Record<string, number | string>[]; keys: string[]; colors: string[] }) {
  const max = Math.max(1, ...data.flatMap((d) => keys.map((k) => Number(d[k]) || 0)));
  return (
    <div className="flex h-40 items-end gap-1">
      {data.map((d, i) => (
        <div key={i} className="group relative flex flex-1 items-end justify-center gap-px" title={String(d.day || d.week)}>
          {keys.map((k, j) => (
            <div key={k} className={`w-full rounded-t ${colors[j]} transition-all`} style={{ height: `${Math.max(2, ((Number(d[k]) || 0) / max) * 100)}%` }} />
          ))}
          <span className="pointer-events-none absolute -top-8 hidden whitespace-nowrap rounded bg-black/80 px-2 py-1 text-[10px] group-hover:block">
            {String(d.day || d.week).slice(5)} · {keys.map((k) => `${k}: ${d[k]}`).join(" · ")}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsDashboard({ initial, metrika }: { initial: Data; metrika: string }) {
  const [period, setPeriod] = useState(initial.summary.period);
  const [data, setData] = useState(initial);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (period === initial.summary.period && data === initial) return;
    setLoading(true);
    fetch(`/api/analytics/summary?period=${period}`)
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const s = data.summary;
  const kpis = [
    ["Посещения", s.visits],
    ["Уникальные", s.uniques],
    ["Заявки", s.leads],
    ["Конверсия", `${s.conversion}%`],
    ["Клики телефон", s.phone],
    ["Клики email", s.email],
    ["Клики CTA", s.cta],
    ["Калькулятор", s.calculator],
  ];

  return (
    <div className={loading ? "opacity-60 transition" : "transition"}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Аналитика</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Поведение и источники</h1>
        </div>
        <div className="flex flex-wrap gap-1 rounded-xl bg-white/5 p-1">
          {PERIODS.map((p) => (
            <button key={p.id} onClick={() => setPeriod(p.id)} className={`rounded-lg px-3 py-1.5 text-xs ${period === p.id ? "bg-moss-700 text-bone" : "text-mist hover:text-bone"}`}>
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(([l, v]) => (
          <div key={String(l)} className="admin-card">
            <p className="text-[11px] uppercase tracking-wide2 text-mist">{l}</p>
            <p className="mt-2 font-display text-3xl font-bold tabular-nums">{v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="admin-card lg:col-span-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Посещения и заявки по дням</p>
            <div className="flex gap-4 text-[11px] text-mist">
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded bg-moss-500" /> визиты
              </span>
              <span className="flex items-center gap-1">
                <span className="h-2 w-2 rounded bg-wine-500" /> заявки
              </span>
            </div>
          </div>
          <div className="mt-6">
            <Bars data={s.days} keys={["visits", "leads"]} colors={["bg-moss-500", "bg-wine-500"]} />
          </div>
        </div>

        <div className="admin-card">
          <p className="text-sm font-medium">Источники</p>
          <ul className="mt-4 space-y-2 text-xs">
            {s.sources.length === 0 && <li className="text-mist">Пока нет данных</li>}
            {s.sources.map((src) => (
              <li key={src.source} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
                <span className="truncate text-bone/80">{src.source}</span>
                <span className="shrink-0 tabular-nums text-mist">
                  {src.visits} / {src.uniques} · <span className="text-wine-400">{src.leads} заявок</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="admin-card">
          <p className="text-sm font-medium">Популярные страницы</p>
          <ul className="mt-4 space-y-2 text-xs">
            {s.pages.map((p) => (
              <li key={p.path} className="flex justify-between border-b border-white/5 pb-2">
                <span className="truncate text-bone/80">{p.path || "/"}</span>
                <span className="tabular-nums text-mist">{p.views}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="admin-card">
          <p className="text-sm font-medium">Клики по CTA</p>
          <ul className="mt-4 space-y-2 text-xs">
            {s.ctas.length === 0 && <li className="text-mist">Пока нет данных</li>}
            {s.ctas.map((c) => (
              <li key={c.cta} className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-bone/80">{c.cta}</span>
                <span className="tabular-nums text-mist">{c.clicks}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-8 admin-card">
        <p className="text-sm font-medium">Недельные сводки — 12 недель</p>
        <div className="mt-6">
          <Bars data={data.weekly} keys={["uniques", "leads"]} colors={["bg-moss-600", "bg-wine-500"]} />
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                {["Неделя с", "Визиты", "Уникальные", "Заявки", "Телефон", "Email", "CTA", "Конверсия"].map((h) => (
                  <th key={h} className="admin-th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.weekly.map((w) => (
                <tr key={w.week} className="border-t border-white/5">
                  <td className="px-3 py-2 font-mono">{w.week}</td>
                  <td className="px-3 py-2 tabular-nums">{w.visits}</td>
                  <td className="px-3 py-2 tabular-nums">{w.uniques}</td>
                  <td className="px-3 py-2 tabular-nums">{w.leads}</td>
                  <td className="px-3 py-2 tabular-nums">{w.phone}</td>
                  <td className="px-3 py-2 tabular-nums">{w.email}</td>
                  <td className="px-3 py-2 tabular-nums">{w.cta}</td>
                  <td className="px-3 py-2 tabular-nums">{w.conversion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 admin-card">
        <p className="text-sm font-medium">Когортная аналитика</p>
        <p className="mt-1 text-xs text-mist">Посетители группируются по неделе первого визита. Смотрим, сколько из них вернулись и оставили заявку.</p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr>
                {["Когорта (неделя)", "Новых", "По реф. ссылкам", "Вернулись", "Retention", "Заявки", "Конверсия"].map((h) => (
                  <th key={h} className="admin-th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.cohorts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-6 text-center text-mist">
                    Данные появятся после первых визитов
                  </td>
                </tr>
              )}
              {data.cohorts.map((c) => (
                <tr key={c.week} className="border-t border-white/5">
                  <td className="px-3 py-2 font-mono">{c.week}</td>
                  <td className="px-3 py-2 tabular-nums">{c.size}</td>
                  <td className="px-3 py-2 tabular-nums">{c.ref}</td>
                  <td className="px-3 py-2 tabular-nums">{c.returned}</td>
                  <td className="px-3 py-2">
                    <span className="inline-block h-2 rounded bg-moss-500" style={{ width: `${Math.max(2, c.retention)}%`, maxWidth: 120 }} /> <span className="ml-2 tabular-nums">{c.retention}%</span>
                  </td>
                  <td className="px-3 py-2 tabular-nums">{c.converted}</td>
                  <td className="px-3 py-2 tabular-nums">{c.conversion}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 admin-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium">Яндекс Метрика</p>
          <p className="mt-1 text-xs text-mist">
            {metrika ? (
              <>
                Подключена, счётчик <span className="font-mono">{metrika}</span>. Цели: PHONE, EMAIL, CTA, CALCULATOR, FORM_START, LEAD_SUBMIT.
              </>
            ) : (
              "Не подключена. Укажите номер счётчика в настройках — код и цели подставятся автоматически."
            )}
          </p>
        </div>
        <Link href="/admin/settings" className="admin-btn-ghost">
          Настройки
        </Link>
      </div>
    </div>
  );
}
