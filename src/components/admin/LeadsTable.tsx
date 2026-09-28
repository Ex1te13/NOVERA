"use client";

import { Fragment, useMemo, useState } from "react";
import type { LeadRow } from "@/lib/db";
import { formatMoney } from "@/lib/calculator";

const STATUSES = [
  { id: "new", label: "Новая", cls: "bg-wine-700/60" },
  { id: "contacted", label: "В работе", cls: "bg-moss-700/60" },
  { id: "done", label: "Закрыта", cls: "bg-white/10" },
];

const j = <T,>(s: string | null, fb: T): T => {
  try {
    return s ? (JSON.parse(s) as T) : fb;
  } catch {
    return fb;
  }
};

type Calc = { total?: number; lines?: { label: string; amount: number }[]; input?: Record<string, unknown> };
type FileMeta = { name: string; path: string; size: number };

export function LeadsTable({ initial }: { initial: LeadRow[] }) {
  const [rows, setRows] = useState(initial);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [open, setOpen] = useState<number | null>(null);

  const list = useMemo(
    () =>
      rows.filter((r) => {
        if (status !== "all" && (r.status || "new") !== status) return false;
        if (!q) return true;
        const hay = `${r.name} ${r.phone} ${r.email} ${r.region} ${r.description} ${r.referral_code}`.toLowerCase();
        return hay.includes(q.toLowerCase());
      }),
    [rows, q, status]
  );

  const setLeadStatus = async (id: number, s: string) => {
    setRows((v) => v.map((r) => (r.id === id ? { ...r, status: s } : r)));
    await fetch("/api/leads", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, status: s }) });
  };

  return (
    <div className="admin-card p-0">
      <div className="flex flex-wrap items-center gap-3 border-b border-white/10 p-4">
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Поиск: имя, телефон, email, регион…" className="admin-input max-w-sm" />
        <div className="flex gap-1">
          {[{ id: "all", label: "Все" }, ...STATUSES].map((s) => (
            <button key={s.id} onClick={() => setStatus(s.id)} className={`rounded-lg px-3 py-1.5 text-xs ${status === s.id ? "bg-white/15" : "text-mist hover:bg-white/5"}`}>
              {s.label}
            </button>
          ))}
        </div>
        <span className="ml-auto text-xs text-mist">{list.length} записей</span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1100px] text-left">
          <thead className="border-b border-white/10">
            <tr>
              {["#", "Дата", "Статус", "Клиент", "Регион", "Услуги", "м²", "Расчёт", "Файлы", "Источник", "Реф.", ""].map((h) => (
                <th key={h} className="admin-th">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-12 text-center text-sm text-mist">
                  Заявок пока нет. Отправьте тестовую с сайта — она появится здесь и в Telegram.
                </td>
              </tr>
            )}
            {list.map((r) => {
              const calc = j<Calc>(r.calculator, {});
              const files = j<FileMeta[]>(r.files, []);
              const services = j<string[]>(r.services, []);
              const utm = j<Record<string, string>>(r.utm, {});
              const isOpen = open === r.id;
              const st = STATUSES.find((s) => s.id === (r.status || "new")) || STATUSES[0];
              return (
                <Fragment key={r.id}>
                  <tr className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="admin-td font-mono text-xs text-mist">{r.id}</td>
                    <td className="admin-td whitespace-nowrap text-xs">{new Date(r.created_at).toLocaleString("ru-RU", { dateStyle: "short", timeStyle: "short" })}</td>
                    <td className="admin-td">
                      <select
                        value={r.status || "new"}
                        onChange={(e) => setLeadStatus(r.id, e.target.value)}
                        className={`rounded-md border-0 px-2 py-1 text-xs ${st.cls}`}
                      >
                        {STATUSES.map((s) => (
                          <option key={s.id} value={s.id} className="bg-ink">
                            {s.label}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="admin-td">
                      <p className="font-medium">{r.name}</p>
                      <a href={`tel:${r.phone}`} className="block text-xs text-moss-400">
                        {r.phone}
                      </a>
                      <a href={`mailto:${r.email}`} className="block text-xs text-mist">
                        {r.email}
                      </a>
                    </td>
                    <td className="admin-td text-xs">{r.region || "—"}</td>
                    <td className="admin-td max-w-[220px] text-xs text-mist">{services.join(", ") || "—"}</td>
                    <td className="admin-td text-xs">{r.area || "—"}</td>
                    <td className="admin-td whitespace-nowrap text-xs">{calc.total ? formatMoney(calc.total) : "—"}</td>
                    <td className="admin-td text-xs">
                      {files.length ? (
                        <div className="flex flex-col gap-1">
                          {files.map((f) => (
                            <a key={f.path} href={`/api/files/${encodeURIComponent(f.path.split("/").pop() || "")}`} target="_blank" className="truncate text-moss-400 hover:underline" style={{ maxWidth: 160 }}>
                              {f.name}
                            </a>
                          ))}
                        </div>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="admin-td text-xs text-mist">
                      {r.source || "site"}
                      {Object.keys(utm).length > 0 && <span className="block text-[10px]">{utm.utm_source}</span>}
                    </td>
                    <td className="admin-td text-xs">{r.referral_code ? <span className="rounded bg-wine-800/60 px-1.5 py-0.5 font-mono">{r.referral_code}</span> : "—"}</td>
                    <td className="admin-td">
                      <button onClick={() => setOpen(isOpen ? null : r.id)} className="text-xs text-mist hover:text-bone">
                        {isOpen ? "Скрыть" : "Детали"}
                      </button>
                    </td>
                  </tr>
                  {isOpen && (
                    <tr className="border-b border-white/10 bg-white/[0.02]">
                      <td colSpan={12} className="px-4 py-5">
                        <div className="grid gap-6 text-sm md:grid-cols-3">
                          <div>
                            <p className="text-[11px] uppercase tracking-wide2 text-mist">Описание</p>
                            <p className="mt-2 whitespace-pre-wrap text-bone/90">{r.description || "—"}</p>
                          </div>
                          <div>
                            <p className="text-[11px] uppercase tracking-wide2 text-mist">Калькулятор</p>
                            {calc.lines?.length ? (
                              <ul className="mt-2 space-y-1 text-xs">
                                {calc.lines.map((l) => (
                                  <li key={l.label} className="flex justify-between gap-3">
                                    <span className="text-bone/70">{l.label}</span>
                                    <span className="tabular-nums">{formatMoney(l.amount)}</span>
                                  </li>
                                ))}
                                <li className="flex justify-between gap-3 border-t border-white/10 pt-1 font-semibold">
                                  <span>Итого</span>
                                  <span>{formatMoney(calc.total || 0)}</span>
                                </li>
                              </ul>
                            ) : (
                              <p className="mt-2 text-xs text-mist">Не использовался</p>
                            )}
                          </div>
                          <div className="text-xs">
                            <p className="text-[11px] uppercase tracking-wide2 text-mist">Источник и реферальные данные</p>
                            <dl className="mt-2 grid grid-cols-[110px_1fr] gap-y-1 text-bone/80">
                              <dt className="text-mist">Страница</dt>
                              <dd className="truncate">{r.landing_page || "—"}</dd>
                              <dt className="text-mist">Реферер</dt>
                              <dd className="truncate">{r.referrer || "—"}</dd>
                              <dt className="text-mist">UTM</dt>
                              <dd className="truncate">{Object.entries(utm).map(([k, v]) => `${k}=${v}`).join(", ") || "—"}</dd>
                              <dt className="text-mist">Реф. код</dt>
                              <dd>{r.referral_code || "—"}</dd>
                              <dt className="text-mist">Visitor</dt>
                              <dd className="truncate font-mono">{r.visitor_id || "—"}</dd>
                              <dt className="text-mist">IP</dt>
                              <dd>{r.ip || "—"}</dd>
                              <dt className="text-mist">UA</dt>
                              <dd className="truncate">{r.user_agent || "—"}</dd>
                            </dl>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
