import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { dbRun } from "@/lib/db";
import { referralStats } from "@/lib/analytics";

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: "auth" }, { status: 401 });
  return NextResponse.json(await referralStats());
}

export async function POST(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const name = String(body.name || "").trim();
  const code = String(body.code || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, "");
  if (!name || !code) return NextResponse.json({ error: "Укажите название и код" }, { status: 400 });
  if (code.length < 2 || code.length > 24) return NextResponse.json({ error: "Код 2–24 символа" }, { status: 400 });
  try {
    await dbRun("INSERT INTO referrals (created_at, name, code) VALUES (?, ?, ?)", [new Date().toISOString(), name, code]);
  } catch {
    return NextResponse.json({ error: "Такой код уже существует" }, { status: 409 });
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const id = Number(req.nextUrl.searchParams.get("id"));
  if (!id) return NextResponse.json({ error: "id" }, { status: 400 });
  await dbRun("DELETE FROM referrals WHERE id = ?", [id]);
  return NextResponse.json({ ok: true });
}
