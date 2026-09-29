import { NextRequest, NextResponse } from "next/server";
import { dbAll, getSetting, setSetting } from "@/lib/db";
import { sendTelegramText, telegramWebhookSecret } from "@/lib/telegram";
import { analyticsSummary } from "@/lib/analytics";

export async function POST(req: NextRequest) {
  const token = await getSetting("TELEGRAM_BOT_TOKEN");
  if (!token || req.headers.get("x-telegram-bot-api-secret-token") !== telegramWebhookSecret(token)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  const update = await req.json().catch(() => null);
  const message = update?.message;
  if (!message) return NextResponse.json({ ok: true });
  const chatId = String(message.chat?.id || "");
  const text = String(message.text || "").trim();
  if (!chatId) return NextResponse.json({ ok: true });

  const managerChat = await getSetting("TELEGRAM_CHAT_ID");

  if (text.startsWith("/start")) {
    if (managerChat && managerChat !== chatId) {
      await sendTelegramText(
        "⛔️ К сайту NOVERA уже подключён другой менеджер.\nЧтобы подключить этот чат, очистите поле Chat ID в админке (Настройки) и снова отправьте /start.",
        chatId
      );
      return NextResponse.json({ ok: true });
    }
    await setSetting("TELEGRAM_CHAT_ID", chatId);
    await sendTelegramText(
      "✅ <b>NOVERA</b>: этот чат подключён как чат менеджера.\nНовые заявки с сайта будут приходить сюда.\n\nКоманды:\n/stats — сводка за 7 дней\n/last — последние 5 заявок",
      chatId
    );
    return NextResponse.json({ ok: true });
  }

  if (chatId !== managerChat) return NextResponse.json({ ok: true });

  if (text.startsWith("/stats")) {
    const s = await analyticsSummary("7d");
    await sendTelegramText(
      `📊 <b>7 дней</b>\nВизиты: ${s.visits}\nУникальные: ${s.uniques}\nЗаявки: ${s.leads}\nКонверсия: ${s.conversion}%\nКлики по телефону: ${s.phone}\nCTA: ${s.cta}`,
      chatId
    );
  } else if (text.startsWith("/last")) {
    const rows = await dbAll<{ id: number; created_at: string; name: string; phone: string; region: string }>(
      "SELECT id, created_at, name, phone, region FROM leads ORDER BY id DESC LIMIT 5"
    );
    await sendTelegramText(
      rows.length
        ? rows.map((r) => `#${r.id} · ${new Date(r.created_at).toLocaleString("ru-RU", { timeZone: "Europe/Moscow" })}\n${r.name} · ${r.phone} · ${r.region || "—"}`).join("\n\n")
        : "Заявок пока нет",
      chatId
    );
  }
  return NextResponse.json({ ok: true });
}
