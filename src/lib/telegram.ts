import fs from "node:fs";
import path from "node:path";
import { getSetting } from "./db";
import { formatMoney } from "./calculator";

export type LeadPayload = {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  region?: string | null;
  services?: string[];
  area?: number | null;
  description?: string | null;
  files?: { name: string; path: string; size: number }[];
  calculator?: CalcSnapshot | null;
  source?: string | null;
  referrer?: string | null;
  utm?: Record<string, string>;
  referral_code?: string | null;
  landing_page?: string | null;
};

export type CalcSnapshot = {
  total?: number;
  lines?: { label: string; amount: number }[];
  input?: Record<string, unknown>;
};

async function creds() {
  return {
    token: await getSetting("TELEGRAM_BOT_TOKEN"),
    chatId: await getSetting("TELEGRAM_CHAT_ID"),
  };
}

async function tg(method: string, body: unknown, token?: string) {
  const t = token || (await creds()).token;
  if (!t) return { ok: false, skipped: true };
  const res = await fetch(`https://api.telegram.org/bot${t}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return res.json();
}

export const telegramGetMe = (token: string) => fetch(`https://api.telegram.org/bot${token}/getMe`).then((r) => r.json());
export const telegramSetWebhook = (token: string, url: string) => tg("setWebhook", { url }, token);
export const telegramDeleteWebhook = (token: string) => tg("deleteWebhook", {}, token);

export async function sendTelegramText(text: string, overrideChat?: string) {
  const { chatId } = await creds();
  const chat = overrideChat || chatId;
  if (!chat) return { ok: false, skipped: true };
  return tg("sendMessage", { chat_id: chat, text, parse_mode: "HTML", disable_web_page_preview: true });
}

export async function sendTelegramDocument(filePath: string, caption?: string) {
  const { token, chatId } = await creds();
  if (!token || !chatId) return { ok: false, skipped: true };
  const abs = path.isAbsolute(filePath) ? filePath : path.join(process.cwd(), filePath);
  if (!fs.existsSync(abs)) return { ok: false, missing: true };
  const buf = fs.readFileSync(abs);
  const form = new FormData();
  form.append("chat_id", chatId);
  form.append("document", new Blob([new Uint8Array(buf)]), path.basename(abs).replace(/^\d+-/, ""));
  if (caption) form.append("caption", caption.slice(0, 1000));
  const res = await fetch(`https://api.telegram.org/bot${token}/sendDocument`, { method: "POST", body: form });
  return res.json();
}

const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] || c);

export function formatLeadMessage(lead: LeadPayload) {
  const parts: string[] = [
    `🏠 <b>NOVERA — новая заявка #${lead.id}</b>`,
    ``,
    `👤 <b>Имя:</b> ${esc(lead.name)}`,
    `📞 <b>Телефон:</b> ${esc(lead.phone)}`,
    `✉️ <b>Email:</b> ${esc(lead.email || "—")}`,
    `📍 <b>Регион:</b> ${esc(lead.region || "—")}`,
    `📐 <b>Площадь:</b> ${lead.area ? `${lead.area} м²` : "—"}`,
    `🛠 <b>Услуги:</b> ${esc((lead.services || []).join(", ") || "—")}`,
    `📝 <b>Описание:</b> ${esc(lead.description || "—")}`,
  ];

  const calc = lead.calculator;
  if (calc && (calc.total || calc.lines?.length)) {
    parts.push(``, `🧮 <b>Калькулятор</b>`);
    for (const l of calc.lines || []) parts.push(`  • ${esc(l.label)} — ${esc(formatMoney(l.amount))}`);
    if (calc.total) parts.push(`  <b>Итого: ${esc(formatMoney(calc.total))}</b>`);
    if (calc.input) {
      const i = calc.input as Record<string, unknown>;
      parts.push(
        `  <i>${esc(
          [
            i.area && `${i.area} м²`,
            i.floors && `${i.floors} эт.`,
            i.materialLabel,
            i.packLabel,
          ]
            .filter(Boolean)
            .join(" · ")
        )}</i>`
      );
    }
  }

  parts.push(
    ``,
    `📎 <b>Файлы:</b> ${
      lead.files?.length
        ? "\n" + lead.files.map((f) => `  • ${esc(f.name)} (${Math.max(1, Math.round(f.size / 1024))} КБ)`).join("\n")
        : "нет"
    }`,
    ``,
    `🔗 <b>Источник:</b> ${esc(lead.source || "site")}`,
    `↩️ <b>Реферер:</b> ${esc(lead.referrer || "—")}`,
    `🏷 <b>Реф. код:</b> ${esc(lead.referral_code || "—")}`,
    `📄 <b>Страница:</b> ${esc(lead.landing_page || "—")}`
  );
  const utm = lead.utm && Object.keys(lead.utm).length ? Object.entries(lead.utm).map(([k, v]) => `${k}=${v}`).join(", ") : "—";
  parts.push(`📊 <b>UTM:</b> ${esc(utm)}`);
  return parts.join("\n");
}

export async function notifyLead(lead: LeadPayload) {
  await sendTelegramText(formatLeadMessage(lead));
  for (const f of lead.files || []) {
    await sendTelegramDocument(f.path, `Заявка #${lead.id} · ${lead.name}: ${f.name}`);
  }
}
