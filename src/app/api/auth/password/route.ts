import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminSession, startAdminSession } from "@/lib/auth";
import { dbGet, dbRun } from "@/lib/db";

export async function POST(req: NextRequest) {
  const login = await getAdminSession();
  if (!login) return NextResponse.json({ error: "Войдите в админку заново" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const current = String(body.current || "");
  const next = String(body.next || "");
  if (next.length < 10) return NextResponse.json({ error: "Новый пароль должен быть не короче 10 символов" }, { status: 400 });

  const admin = await dbGet<{ password_hash: string }>("SELECT password_hash FROM admins WHERE login = ?", [login]);
  if (!admin || !(await bcrypt.compare(current, admin.password_hash))) {
    return NextResponse.json({ error: "Текущий пароль указан неверно" }, { status: 400 });
  }
  const hash = await bcrypt.hash(next, 10);
  await dbRun("UPDATE admins SET password_hash = ? WHERE login = ?", [hash, login]);
  await startAdminSession(login, hash);
  return NextResponse.json({ ok: true });
}
