import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { dbAll, dbRun, uploadDir, type LeadRow } from "@/lib/db";
import { notifyLead } from "@/lib/telegram";
import { getAdminSession } from "@/lib/auth";

const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/webp", "image/gif", "image/heic", "image/heif"]);
const MAX_SIZE = 15 * 1024 * 1024;

const parse = <T,>(raw: unknown, fallback: T): T => {
  try {
    return JSON.parse(String(raw || "")) as T;
  } catch {
    return fallback;
  }
};

export async function POST(req: NextRequest) {
  const form = await req.formData();
  const name = String(form.get("name") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const email = String(form.get("email") || "").trim();
  const region = String(form.get("region") || "").trim();
  const description = String(form.get("description") || "").trim();
  const consent = form.get("consent");

  if (!name || !phone || !email) return NextResponse.json({ error: "Заполните имя, телефон и email" }, { status: 400 });
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return NextResponse.json({ error: "Проверьте email" }, { status: 400 });
  if (phone.replace(/\D/g, "").length < 10) return NextResponse.json({ error: "Проверьте телефон" }, { status: 400 });
  if (!consent || consent === "false") return NextResponse.json({ error: "Нужно согласие на обработку данных" }, { status: 400 });

  const services = parse<string[]>(form.get("services"), []);
  const calculator = parse<Record<string, unknown>>(form.get("calculator"), {});
  const utm = parse<Record<string, string>>(form.get("utm"), {});
  const area = Number(form.get("area") || 0) || null;

  const incoming = form.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  if (incoming.length > 5) return NextResponse.json({ error: "Не больше 5 файлов" }, { status: 400 });

  const filesMeta: { name: string; path: string; size: number; type: string }[] = [];
  for (const file of incoming) {
    const okType = ALLOWED_TYPES.has(file.type) || /\.(pdf|jpe?g|png|webp|gif|heic|heif)$/i.test(file.name);
    if (!okType) return NextResponse.json({ error: `Файл «${file.name}»: только PDF и изображения` }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: `Файл «${file.name}» больше 15 МБ` }, { status: 400 });
    const safe = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}-${file.name.replace(/[^\w.\-а-яА-ЯёЁ]+/g, "_")}`;
    fs.writeFileSync(path.join(uploadDir, safe), Buffer.from(await file.arrayBuffer()));
    filesMeta.push({ name: file.name, path: `data/uploads/${safe}`, size: file.size, type: file.type });
  }

  const now = new Date().toISOString();
  const source = String(form.get("source") || "site");
  const referrer = String(form.get("referrer") || "");
  const referral_code = String(form.get("referral_code") || "");
  const landing_page = String(form.get("landing_page") || "");
  const visitor_id = String(form.get("visitor_id") || "");
  const session_id = String(form.get("session_id") || "");

  const info = await dbRun(
    `INSERT INTO leads (created_at, name, phone, email, region, services, area, description, files, calculator, source, referrer, utm, referral_code, landing_page, visitor_id, user_agent, ip, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'new')`,
    [
      now,
      name,
      phone,
      email,
      region,
      JSON.stringify(services),
      area,
      description,
      JSON.stringify(filesMeta),
      JSON.stringify(calculator),
      source,
      referrer,
      JSON.stringify(utm),
      referral_code,
      landing_page,
      visitor_id,
      req.headers.get("user-agent") || "",
      (req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "").split(",")[0].trim(),
    ]
  );
  const id = Number(info.lastInsertRowid);

  await dbRun(
    `INSERT INTO events (created_at, visitor_id, session_id, type, payload, path, referral_code) VALUES (?, ?, ?, 'lead', ?, ?, ?)`,
    [now, visitor_id || "anon", session_id, JSON.stringify({ lead_id: id, source }), landing_page, referral_code]
  );

  notifyLead({
    id,
    name,
    phone,
    email,
    region,
    services,
    area,
    description,
    files: filesMeta,
    calculator,
    source,
    referrer,
    utm,
    referral_code,
    landing_page,
  }).catch((e) => console.error("telegram", e));

  return NextResponse.json({ ok: true, id });
}

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const rows = await dbAll<LeadRow>("SELECT * FROM leads ORDER BY id DESC");
  return NextResponse.json(rows);
}

export async function PATCH(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const body = await req.json();
  const id = Number(body.id);
  const status = String(body.status || "new");
  if (!id) return NextResponse.json({ error: "id" }, { status: 400 });
  await dbRun("UPDATE leads SET status = ? WHERE id = ?", [status, id]);
  return NextResponse.json({ ok: true });
}
