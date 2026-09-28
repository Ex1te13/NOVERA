import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body) return NextResponse.json({ ok: false }, { status: 400 });
  const now = new Date().toISOString();
  const visitor = String(body.visitor_id || "anon").slice(0, 64);
  const session = String(body.session_id || "").slice(0, 64);
  const type = String(body.type || "pageview").slice(0, 32);
  const refCode = String(body.referral_code || "").slice(0, 64);
  const utm = JSON.stringify(body.utm || {});
  const path = String(body.path || "").slice(0, 300);
  const referrer = String(body.referrer || "").slice(0, 500);

  if (type === "pageview") {
    db.prepare(
      `INSERT INTO visits (created_at, visitor_id, session_id, path, referrer, utm, referral_code, user_agent) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    ).run(now, visitor, session, path, referrer, utm, refCode, String(body.user_agent || "").slice(0, 300));
    db.prepare(
      `INSERT INTO first_visits (visitor_id, first_seen, referral_code, utm, referrer) VALUES (?, ?, ?, ?, ?) ON CONFLICT(visitor_id) DO NOTHING`
    ).run(visitor, now, refCode, utm, referrer);
  } else {
    db.prepare(
      `INSERT INTO events (created_at, visitor_id, session_id, type, payload, path, referral_code) VALUES (?, ?, ?, ?, ?, ?, ?)`
    ).run(now, visitor, session, type, JSON.stringify(body.payload || {}), path, refCode);
  }
  return NextResponse.json({ ok: true });
}
