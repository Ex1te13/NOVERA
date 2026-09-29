"use client";

import { useEffect, useState } from "react";

type S = { hasToken: boolean; tokenPreview: string; chatId: string; siteUrl: string; metrika: string };

export function Settings() {
  const [s, setS] = useState<S | null>(null);
  const [token, setToken] = useState("");
  const [chatId, setChatId] = useState("");
  const [metrika, setMetrika] = useState("");
  const [log, setLog] = useState<string>("");
  const [busy, setBusy] = useState(false);

  const load = () =>
    fetch("/api/telegram/settings")
      .then((r) => r.json())
      .then((d: S) => {
        setS(d);
        setChatId(d.chatId || "");
        setMetrika(d.metrika || "");
      });
  useEffect(() => {
    load();
  }, []);

  const post = async (body: Record<string, unknown>) => {
    setBusy(true);
    const res = await fetch("/api/telegram/settings", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const d = await res.json();
    setLog(JSON.stringify(d.result ?? d, null, 2));
    setBusy(false);
    setToken("");
    load();
  };

  return (
    <div className="max-w-3xl">
      <p className="eyebrow">Настройки</p>
      <h1 className="mt-2 font-display text-3xl font-bold">Telegram, Метрика и пароль</h1>

      <div className="admin-card mt-6">
        <h2 className="font-medium">Telegram-бот менеджера</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-mist">
          <li>
            Откройте <a href="https://t.me/BotFather" target="_blank" className="text-moss-400 underline">@BotFather</a>, команда <code>/newbot</code>, скопируйте токен.
          </li>
          <li>Вставьте токен ниже и сохраните.</li>
          <li>Нажмите «Подключить webhook».</li>
          <li>
            Менеджер пишет боту <code>/start</code> — его chat id сохранится автоматически. Чтобы сменить менеджера, очистите Chat ID, сохраните и попросите нового менеджера отправить <code>/start</code>.
          </li>
          <li>Нажмите «Тестовое сообщение» — оно должно прийти в Telegram.</li>
        </ol>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Токен бота</label>
            <input value={token} onChange={(e) => setToken(e.target.value)} placeholder={s?.hasToken ? `сохранён: ${s.tokenPreview}` : "123456:ABC-DEF…"} className="admin-input font-mono" />
          </div>
          <div>
            <label className="label">Chat ID менеджера</label>
            <input value={chatId} onChange={(e) => setChatId(e.target.value)} placeholder="заполнится после /start" className="admin-input font-mono" />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <button disabled={busy} onClick={() => post({ token: token || undefined, chatId })} className="admin-btn">
            Сохранить
          </button>
          <button disabled={busy || !s?.hasToken} onClick={() => post({ action: "me" })} className="admin-btn-ghost">
            Проверить бота
          </button>
          <button disabled={busy || !s?.hasToken} onClick={() => post({ action: "webhook" })} className="admin-btn-ghost">
            Подключить webhook
          </button>
          <button disabled={busy || !s?.hasToken} onClick={() => post({ action: "unwebhook" })} className="admin-btn-ghost">
            Отключить webhook
          </button>
          <button disabled={busy || !s?.hasToken || !s?.chatId} onClick={() => post({ action: "test" })} className="admin-btn-ghost">
            Тестовое сообщение
          </button>
        </div>
        <p className="mt-3 text-xs text-mist">
          Webhook: <code>{s?.siteUrl}/api/telegram/webhook</code>. <code>npm run bot</code> на компьютере отключает этот webhook — после него нажмите «Подключить webhook» снова.
        </p>
      </div>

      <div className="admin-card mt-4">
        <h2 className="font-medium">Яндекс Метрика</h2>
        <p className="mt-2 text-sm text-mist">Укажите номер счётчика. Код вставится на все страницы, цели PHONE, EMAIL, CTA, CALCULATOR, FORM_START и LEAD_SUBMIT будут отправляться автоматически.</p>
        <div className="mt-4 flex gap-2">
          <input value={metrika} onChange={(e) => setMetrika(e.target.value)} placeholder="12345678" className="admin-input max-w-xs font-mono" />
          <button disabled={busy} onClick={() => post({ metrika })} className="admin-btn">
            Сохранить
          </button>
        </div>
      </div>

      <PasswordCard />

      {log && (
        <pre className="admin-card mt-4 overflow-x-auto whitespace-pre-wrap text-xs text-mist">{log}</pre>
      )}
    </div>
  );
}

function PasswordCard() {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [repeat, setRepeat] = useState("");
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== repeat) return setMsg({ ok: false, text: "Новые пароли не совпадают" });
    setBusy(true);
    const res = await fetch("/api/auth/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current, next }) });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setMsg({ ok: false, text: d.error || "Не удалось сменить пароль" });
    setCurrent("");
    setNext("");
    setRepeat("");
    setMsg({ ok: true, text: "Пароль изменён. Все остальные входы в админку завершены." });
  };

  return (
    <form onSubmit={submit} className="admin-card mt-4">
      <h2 className="font-medium">Пароль админки</h2>
      <p className="mt-2 text-sm text-mist">Не короче 10 символов. После смены все, кто был залогинен, выйдут из админки.</p>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Текущий пароль</label>
          <input type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} required className="admin-input" />
        </div>
        <div>
          <label className="label">Новый пароль</label>
          <input type="password" autoComplete="new-password" minLength={10} value={next} onChange={(e) => setNext(e.target.value)} required className="admin-input" />
        </div>
        <div>
          <label className="label">Ещё раз</label>
          <input type="password" autoComplete="new-password" minLength={10} value={repeat} onChange={(e) => setRepeat(e.target.value)} required className="admin-input" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button disabled={busy} className="admin-btn">
          Сменить пароль
        </button>
        {msg && <p className={`text-sm ${msg.ok ? "text-moss-400" : "text-red-400"}`}>{msg.text}</p>}
      </div>
    </form>
  );
}
