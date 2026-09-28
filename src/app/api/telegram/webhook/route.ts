import { NextRequest, NextResponse } from "next/server";
import { db, setSetting } from "@/lib/db";
import { sendTelegramText } from "@/lib/telegram";
import { analyticsSummary } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  const update = await req.json().catch(() => null);
  const message = update?.message;
  if (!message) return NextResponse.json({ ok: true });
  const chatId = String(message.chat?.id || "");
  const text = String(message.text || "").trim();
  if (!chatId) return NextResponse.json({ ok: true });

  if (text.startsWith("/start")) {
    setSetting("TELEGRAM_CHAT_ID", chatId);
    await sendTelegramText(
      "✅ <b>NOVERA</b>: этот чат подключён как чат менеджера.\nНовые заявки с сайта будут приходить сюда.\n\nКоманды:\n/stats — сводка за 7 дней\n/last — последние 5 заявок",
      chatId
    );
  } else if (text.startsWith("/stats")) {
    const s = analyticsSummary("7d");
    await sendTelegramText(
      `📊 <b>7 дней</b>\nВизиты: ${s.visits}\nУникальные: ${s.uniques}\nЗаявки: ${s.leads}\nКонверсия: ${s.conversion}%\nКлики по телефону: ${s.phone}\nCTA: ${s.cta}`,
      chatId
    );
  } else if (text.startsWith("/last")) {
    const rows = db.prepare("SELECT id, created_at, name, phone, region FROM leads ORDER BY id DESC LIMIT 5").all() as {
      id: number;
      created_at: string;
      name: string;
      phone: string;
      region: string;
    }[];
    await sendTelegramText(
      rows.length
        ? rows.map((r) => `#${r.id} · ${new Date(r.created_at).toLocaleString("ru-RU")}\n${r.name} · ${r.phone} · ${r.region || "—"}`).join("\n\n")
        : "Заявок пока нет",
      chatId
    );
  }
  return NextResponse.json({ ok: true });
}
