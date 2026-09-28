import { NextRequest, NextResponse } from "next/server";
import { loginAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const ok = await loginAdmin(String(body.login || ""), String(body.password || ""));
  if (!ok) return NextResponse.json({ error: "Неверный логин или пароль" }, { status: 401 });
  return NextResponse.json({ ok: true });
}
