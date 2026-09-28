import { db } from "./db";

export type { Period } from "./periods";
export { PERIODS } from "./periods";

const DAY = 86400000;
const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

export function periodRange(period: string) {
  const now = new Date();
  let start = startOfDay(now);
  let end = new Date(now.getTime() + 60000);
  switch (period) {
    case "yesterday":
      start = startOfDay(new Date(now.getTime() - DAY));
      end = new Date(start.getTime() + DAY - 1);
      break;
    case "7d":
      start = startOfDay(new Date(now.getTime() - 6 * DAY));
      break;
    case "30d":
      start = startOfDay(new Date(now.getTime() - 29 * DAY));
      break;
    case "month":
      start = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    case "year":
      start = new Date(now.getFullYear(), 0, 1);
      break;
  }
  return { start: start.toISOString(), end: end.toISOString(), startDate: start, endDate: end };
}

const count = (sql: string, ...params: unknown[]) => (db.prepare(sql).get(...params) as { c: number }).c;

export function analyticsSummary(period: string) {
  const { start, end, startDate, endDate } = periodRange(period);
  const visits = count("SELECT COUNT(*) c FROM visits WHERE created_at BETWEEN ? AND ?", start, end);
  const uniques = count("SELECT COUNT(DISTINCT visitor_id) c FROM visits WHERE created_at BETWEEN ? AND ?", start, end);
  const leads = count("SELECT COUNT(*) c FROM leads WHERE created_at BETWEEN ? AND ?", start, end);
  const ev = (type: string) =>
    count("SELECT COUNT(*) c FROM events WHERE type = ? AND created_at BETWEEN ? AND ?", type, start, end);

  const sources = db
    .prepare(
      `SELECT
         CASE
           WHEN referral_code != '' THEN 'ref:' || referral_code
           WHEN utm LIKE '%utm_source%' THEN 'utm:' || COALESCE(json_extract(utm, '$.utm_source'), '?')
           WHEN referrer != '' THEN referrer
           ELSE 'direct'
         END AS source,
         COUNT(*) visits,
         COUNT(DISTINCT visitor_id) uniques
       FROM visits WHERE created_at BETWEEN ? AND ?
       GROUP BY source ORDER BY visits DESC LIMIT 15`
    )
    .all(start, end) as { source: string; visits: number; uniques: number }[];

  const leadSources = db
    .prepare(
      `SELECT
         CASE
           WHEN referral_code != '' THEN 'ref:' || referral_code
           WHEN utm LIKE '%utm_source%' THEN 'utm:' || COALESCE(json_extract(utm, '$.utm_source'), '?')
           WHEN referrer != '' THEN referrer
           ELSE 'direct'
         END AS source, COUNT(*) leads
       FROM leads WHERE created_at BETWEEN ? AND ? GROUP BY source`
    )
    .all(start, end) as { source: string; leads: number }[];
  const leadMap = new Map(leadSources.map((l) => [l.source, l.leads]));

  const pages = db
    .prepare(
      `SELECT path, COUNT(*) views FROM visits WHERE created_at BETWEEN ? AND ? GROUP BY path ORDER BY views DESC LIMIT 10`
    )
    .all(start, end) as { path: string; views: number }[];

  const ctas = db
    .prepare(
      `SELECT COALESCE(json_extract(payload, '$.cta'), '—') cta, COUNT(*) clicks
       FROM events WHERE type = 'cta' AND created_at BETWEEN ? AND ? GROUP BY cta ORDER BY clicks DESC LIMIT 10`
    )
    .all(start, end) as { cta: string; clicks: number }[];

  // daily series
  const days: { day: string; visits: number; uniques: number; leads: number }[] = [];
  const spanDays = Math.max(1, Math.min(366, Math.ceil((endDate.getTime() - startDate.getTime()) / DAY)));
  const rows = db
    .prepare(
      `SELECT substr(created_at, 1, 10) day, COUNT(*) visits, COUNT(DISTINCT visitor_id) uniques
       FROM visits WHERE created_at BETWEEN ? AND ? GROUP BY day`
    )
    .all(start, end) as { day: string; visits: number; uniques: number }[];
  const leadRows = db
    .prepare(`SELECT substr(created_at, 1, 10) day, COUNT(*) leads FROM leads WHERE created_at BETWEEN ? AND ? GROUP BY day`)
    .all(start, end) as { day: string; leads: number }[];
  const vMap = new Map(rows.map((r) => [r.day, r]));
  const lMap = new Map(leadRows.map((r) => [r.day, r.leads]));
  for (let i = 0; i < spanDays; i++) {
    const d = new Date(startDate.getTime() + i * DAY).toISOString().slice(0, 10);
    days.push({ day: d, visits: vMap.get(d)?.visits ?? 0, uniques: vMap.get(d)?.uniques ?? 0, leads: lMap.get(d) ?? 0 });
  }

  return {
    period,
    visits,
    uniques,
    leads,
    conversion: uniques ? Math.round((leads / uniques) * 1000) / 10 : 0,
    phone: ev("phone"),
    email: ev("email"),
    cta: ev("cta"),
    calculator: ev("calculator"),
    formStart: ev("form_start"),
    sources: sources.map((s) => ({ ...s, leads: leadMap.get(s.source) ?? 0 })),
    pages,
    ctas,
    days,
  };
}

export function weeklySummaries(weeks = 12) {
  const rows = [];
  const now = new Date();
  const monday = startOfDay(now);
  monday.setDate(monday.getDate() - ((monday.getDay() + 6) % 7));
  for (let i = weeks - 1; i >= 0; i--) {
    const start = new Date(monday.getTime() - i * 7 * DAY);
    const end = new Date(start.getTime() + 7 * DAY - 1);
    const s = start.toISOString();
    const e = end.toISOString();
    const visits = count("SELECT COUNT(*) c FROM visits WHERE created_at BETWEEN ? AND ?", s, e);
    const uniques = count("SELECT COUNT(DISTINCT visitor_id) c FROM visits WHERE created_at BETWEEN ? AND ?", s, e);
    const leads = count("SELECT COUNT(*) c FROM leads WHERE created_at BETWEEN ? AND ?", s, e);
    const phone = count("SELECT COUNT(*) c FROM events WHERE type='phone' AND created_at BETWEEN ? AND ?", s, e);
    const email = count("SELECT COUNT(*) c FROM events WHERE type='email' AND created_at BETWEEN ? AND ?", s, e);
    const cta = count("SELECT COUNT(*) c FROM events WHERE type='cta' AND created_at BETWEEN ? AND ?", s, e);
    rows.push({
      week: start.toISOString().slice(0, 10),
      visits,
      uniques,
      leads,
      phone,
      email,
      cta,
      conversion: uniques ? Math.round((leads / uniques) * 1000) / 10 : 0,
    });
  }
  return rows;
}

export function cohorts(weeks = 10) {
  const first = db
    .prepare("SELECT visitor_id, first_seen, referral_code FROM first_visits ORDER BY first_seen DESC LIMIT 5000")
    .all() as { visitor_id: string; first_seen: string; referral_code: string }[];
  const converted = new Set(
    (db.prepare("SELECT DISTINCT visitor_id FROM leads WHERE visitor_id IS NOT NULL AND visitor_id != ''").all() as {
      visitor_id: string;
    }[]).map((r) => r.visitor_id)
  );
  const returning = new Map<string, number>(
    (db.prepare("SELECT visitor_id, COUNT(DISTINCT session_id) s FROM visits GROUP BY visitor_id").all() as {
      visitor_id: string;
      s: number;
    }[]).map((r) => [r.visitor_id, r.s])
  );
  const map = new Map<string, { size: number; converted: number; returned: number; ref: number }>();
  for (const row of first) {
    const d = startOfDay(new Date(row.first_seen));
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    const key = d.toISOString().slice(0, 10);
    const cur = map.get(key) || { size: 0, converted: 0, returned: 0, ref: 0 };
    cur.size += 1;
    if (converted.has(row.visitor_id)) cur.converted += 1;
    if ((returning.get(row.visitor_id) ?? 0) > 1) cur.returned += 1;
    if (row.referral_code) cur.ref += 1;
    map.set(key, cur);
  }
  return Array.from(map.entries())
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))
    .slice(0, weeks)
    .map(([week, v]) => ({
      week,
      size: v.size,
      converted: v.converted,
      returned: v.returned,
      ref: v.ref,
      conversion: v.size ? Math.round((v.converted / v.size) * 1000) / 10 : 0,
      retention: v.size ? Math.round((v.returned / v.size) * 1000) / 10 : 0,
    }));
}

export function referralStats() {
  const refs = db.prepare("SELECT * FROM referrals ORDER BY created_at DESC").all() as {
    id: number;
    created_at: string;
    name: string;
    code: string;
  }[];
  return refs.map((r) => {
    const clicks = count("SELECT COUNT(*) c FROM visits WHERE referral_code = ?", r.code);
    const uniques = count("SELECT COUNT(DISTINCT visitor_id) c FROM visits WHERE referral_code = ?", r.code);
    const leads = count("SELECT COUNT(*) c FROM leads WHERE referral_code = ?", r.code);
    return { ...r, clicks, uniques, leads, conversion: uniques ? Math.round((leads / uniques) * 1000) / 10 : 0 };
  });
}
