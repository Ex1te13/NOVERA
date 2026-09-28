"use client";

import { useState } from "react";
import type { referralStats } from "@/lib/analytics";

type Row = ReturnType<typeof referralStats>[number];

export function Referrals({ initial, siteUrl }: { initial: Row[]; siteUrl: string }) {
  const [rows, setRows] = useState(initial);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const reload = async () => setRows(await fetch("/api/referrals").then((r) => r.json()));

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/referrals", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, code }) });
    const d = await res.json();
    if (!res.ok) return setError(d.error || "Ошибка");
    setName("");
    setCode("");
    reload();
  };

  const remove = async (id: number) => {
    if (!confirm("Удалить ссылку? Статистика визитов сохранится.")) return;
    await fetch(`/api/referrals?id=${id}`, { method: "DELETE" });
    reload();
  };

  const gen = () => setCode(Math.random().toString(36).slice(2, 8));
  const link = (c: string) => `${siteUrl.replace(/\/$/, "")}/?ref=${c}`;
  const copy = async (c: string) => {
    await navigator.clipboard.writeText(link(c));
    setCopied(c);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div>
      <p className="eyebrow">Реферальная система</p>
      <h1 className="mt-2 font-display text-3xl font-bold">Реферальные ссылки</h1>
      <p className="mt-2 max-w-xl text-sm text-mist">
        Создайте ссылку с уникальным кодом и передайте партнёру. Все переходы, уникальные посетители и заявки по ней будут учитываться автоматически.
      </p>

      <form onSubmit={create} className="admin-card mt-6 flex flex-wrap items-end gap-3">
        <div className="min-w-[200px] flex-1">
          <label className="label">Название</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="admin-input" placeholder="Например, Партнёр Иванов" required />
        </div>
        <div className="w-48">
          <label className="label">Короткий код</label>
          <div className="flex gap-2">
            <input value={code} onChange={(e) => setCode(e.target.value)} className="admin-input font-mono" placeholder="ivanov" required />
            <button type="button" onClick={gen} className="admin-btn-ghost px-3" title="Сгенерировать">
              ⟳
            </button>
          </div>
        </div>
        <button className="admin-btn">Создать</button>
        {error && <p className="w-full text-sm text-wine-400">{error}</p>}
      </form>

      <div className="admin-card mt-4 p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left">
            <thead className="border-b border-white/10">
              <tr>
                {["Название", "Ссылка", "Дата", "Клики", "Уникальные", "Заявки", "Конверсия", ""].map((h) => (
                  <th key={h} className="admin-th">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-10 text-center text-sm text-mist">
                    Ссылок пока нет
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-white/5">
                  <td className="admin-td font-medium">{r.name}</td>
                  <td className="admin-td">
                    <button onClick={() => copy(r.code)} className="font-mono text-xs text-moss-400 hover:underline">
                      {link(r.code)}
                    </button>
                    {copied === r.code && <span className="ml-2 text-xs text-mist">скопировано</span>}
                  </td>
                  <td className="admin-td whitespace-nowrap text-xs">{new Date(r.created_at).toLocaleDateString("ru-RU")}</td>
                  <td className="admin-td tabular-nums">{r.clicks}</td>
                  <td className="admin-td tabular-nums">{r.uniques}</td>
                  <td className="admin-td tabular-nums">{r.leads}</td>
                  <td className="admin-td tabular-nums">{r.conversion}%</td>
                  <td className="admin-td">
                    <button onClick={() => remove(r.id)} className="text-xs text-mist hover:text-wine-400">
                      Удалить
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
