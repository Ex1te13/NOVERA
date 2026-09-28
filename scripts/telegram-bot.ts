/**
 * Локальный long-polling бот для менеджера NOVERA.
 * Использование: npm run bot   (нужен TELEGRAM_BOT_TOKEN в .env.local или в админке)
 * Напишите боту /start — chat id сохранится, и заявки начнут приходить в этот чат.
 */
import fs from "node:fs";
import path from "node:path";

// подгружаем .env.local вручную (без зависимостей)
const envPath = path.join(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}

async function main() {
  const { db, setSetting, getSetting } = await import("../src/lib/db");
  const { analyticsSummary } = await import("../src/lib/analytics");

  const token = () => getSetting("TELEGRAM_BOT_TOKEN");

async function api(method: string, body?: unknown) {
  const t = token();
  if (!t) {
    console.error("Нет TELEGRAM_BOT_TOKEN. Укажите токен в .env.local или в админке (Настройки).");
    process.exit(1);
  }
  const res = await fetch(`https://api.telegram.org/bot${t}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json();
}

async function reply(chatId: string, text: string) {
  await api("sendMessage", { chat_id: chatId, text, parse_mode: "HTML" });
}

async function loop() {
  await api("deleteWebhook");
  const me = await api("getMe");
  console.log(`NOVERA bot @${me?.result?.username || "?"} — polling…`);
  let offset = 0;
  for (;;) {
    try {
      const data = await api("getUpdates", { offset, timeout: 30 });
      for (const upd of data.result || []) {
        offset = upd.update_id + 1;
        const msg = upd.message;
        if (!msg) continue;
        const chatId = String(msg.chat.id);
        const text = String(msg.text || "").trim();
        if (text.startsWith("/start")) {
          setSetting("TELEGRAM_CHAT_ID", chatId);
          console.log("chat id сохранён:", chatId);
          await reply(
            chatId,
            "✅ <b>NOVERA</b>: этот чат подключён как чат менеджера.\nНовые заявки с сайта будут приходить сюда.\n\n/stats — сводка за 7 дней\n/last — последние 5 заявок"
          );
        } else if (text.startsWith("/stats")) {
          const s = analyticsSummary("7d");
          await reply(chatId, `📊 <b>7 дней</b>\nВизиты: ${s.visits}\nУникальные: ${s.uniques}\nЗаявки: ${s.leads}\nКонверсия: ${s.conversion}%`);
        } else if (text.startsWith("/last")) {
          const rows = db.prepare("SELECT id, created_at, name, phone, region FROM leads ORDER BY id DESC LIMIT 5").all() as {
            id: number;
            created_at: string;
            name: string;
            phone: string;
            region: string;
          }[];
          await reply(
            chatId,
            rows.length ? rows.map((r) => `#${r.id} · ${new Date(r.created_at).toLocaleString("ru-RU")}\n${r.name} · ${r.phone} · ${r.region || "—"}`).join("\n\n") : "Заявок пока нет"
          );
        }
      }
    } catch (e) {
      console.error(e);
      await new Promise((r) => setTimeout(r, 3000));
    }
  }
}

  await loop();
}

main();
