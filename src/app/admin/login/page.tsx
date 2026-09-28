"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogoMark } from "@/components/Logo";

export default function LoginPage() {
  const router = useRouter();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, password }),
    });
    setBusy(false);
    if (!res.ok) {
      setError("Неверный логин или пароль");
      return;
    }
    router.push("/admin");
    router.refresh();
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[radial-gradient(ellipse_at_top,#10261f_0%,#0a0c0b_60%)] px-5">
      <form onSubmit={submit} className="w-full max-w-sm rounded-3xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur">
        <div className="flex items-center gap-3">
          <LogoMark className="h-9 w-9" />
          <div className="leading-none">
            <p className="font-display text-sm font-bold uppercase tracking-[0.2em]">Novera</p>
            <p className="mt-1 text-[10px] uppercase tracking-wide2 text-mist">Вход в панель</p>
          </div>
        </div>
        <div className="mt-8 space-y-4">
          <div>
            <label className="label">Логин</label>
            <input value={login} onChange={(e) => setLogin(e.target.value)} className="admin-input" autoComplete="username" autoFocus />
          </div>
          <div>
            <label className="label">Пароль</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="admin-input" autoComplete="current-password" />
          </div>
        </div>
        {error && <p className="mt-4 text-sm text-wine-400">{error}</p>}
        <button disabled={busy} className="admin-btn mt-6 w-full justify-center">
          {busy ? "Проверяем…" : "Войти"}
        </button>
      </form>
    </div>
  );
}
