import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { getSetting, setSetting } from "@/lib/db";
import { sendTelegramText, telegramDeleteWebhook, telegramGetMe, telegramSetWebhook } from "@/lib/telegram";

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const token = await getSetting("TELEGRAM_BOT_TOKEN");
  return NextResponse.json({
    hasToken: Boolean(token),
    tokenPreview: token ? token.slice(0, 10) + "…" : "",
    chatId: await getSetting("TELEGRAM_CHAT_ID"),
    siteUrl: process.env.SITE_URL || "http://localhost:3000",
    metrika: await getSetting("YANDEX_METRIKA_ID"),
  });
}

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (typeof body.token === "string" && body.token.trim()) await setSetting("TELEGRAM_BOT_TOKEN", body.token.trim());
  if (typeof body.chatId === "string") await setSetting("TELEGRAM_CHAT_ID", body.chatId.trim());
  if (typeof body.metrika === "string") await setSetting("YANDEX_METRIKA_ID", body.metrika.trim());

  const token = await getSetting("TELEGRAM_BOT_TOKEN");
  let result: unknown = null;
  if (body.action === "me" && token) result = await telegramGetMe(token);
  if (body.action === "webhook" && token) {
    const url = `${(process.env.SITE_URL || "http://localhost:3000").replace(/\/$/, "")}/api/telegram/webhook`;
    result = await telegramSetWebhook(token, url);
  }
  if (body.action === "unwebhook" && token) result = await telegramDeleteWebhook(token);
  if (body.action === "test") result = await sendTelegramText("🔔 NOVERA: тестовое уведомление. Бот подключён к сайту.");
  return NextResponse.json({ ok: true, result });
}
