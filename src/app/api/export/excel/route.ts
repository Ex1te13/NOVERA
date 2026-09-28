import { NextResponse } from "next/server";
import ExcelJS from "exceljs";
import { getAdminSession } from "@/lib/auth";
import { dbAll, type LeadRow } from "@/lib/db";
import { formatMoney } from "@/lib/calculator";

const safeJson = <T,>(s: string | null, fb: T): T => {
  try {
    return s ? (JSON.parse(s) as T) : fb;
  } catch {
    return fb;
  }
};

export async function GET() {
  if (!(await getAdminSession())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const rows = await dbAll<LeadRow>("SELECT * FROM leads ORDER BY id DESC");

  const wb = new ExcelJS.Workbook();
  wb.creator = "NOVERA";
  const ws = wb.addWorksheet("Заявки", { views: [{ state: "frozen", ySplit: 1 }] });
  ws.columns = [
    { header: "ID", key: "id", width: 7 },
    { header: "Дата", key: "created_at", width: 20 },
    { header: "Статус", key: "status", width: 12 },
    { header: "Имя", key: "name", width: 22 },
    { header: "Телефон", key: "phone", width: 18 },
    { header: "Email", key: "email", width: 26 },
    { header: "Регион", key: "region", width: 20 },
    { header: "Услуги", key: "services", width: 40 },
    { header: "Площадь, м²", key: "area", width: 12 },
    { header: "Описание", key: "description", width: 50 },
    { header: "Файлы", key: "files", width: 40 },
    { header: "Расчёт, ₽", key: "calc_total", width: 16 },
    { header: "Параметры калькулятора", key: "calculator", width: 60 },
    { header: "Источник", key: "source", width: 14 },
    { header: "Реферер", key: "referrer", width: 30 },
    { header: "UTM", key: "utm", width: 30 },
    { header: "Реф. код", key: "referral_code", width: 12 },
    { header: "Страница", key: "landing_page", width: 30 },
    { header: "Visitor ID", key: "visitor_id", width: 36 },
    { header: "User-Agent", key: "user_agent", width: 40 },
    { header: "IP", key: "ip", width: 16 },
  ];
  ws.getRow(1).font = { bold: true };
  ws.getRow(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF10261F" } };
  ws.getRow(1).font = { bold: true, color: { argb: "FFF4EFE6" } };

  for (const r of rows) {
    const calc = safeJson<{ total?: number; lines?: { label: string; amount: number }[]; input?: Record<string, unknown> }>(r.calculator, {});
    const files = safeJson<{ name: string }[]>(r.files, []);
    const utm = safeJson<Record<string, string>>(r.utm, {});
    ws.addRow({
      id: r.id,
      created_at: new Date(r.created_at).toLocaleString("ru-RU"),
      status: r.status,
      name: r.name,
      phone: r.phone,
      email: r.email,
      region: r.region,
      services: safeJson<string[]>(r.services, []).join(", "),
      area: r.area ?? "",
      description: r.description,
      files: files.map((f) => f.name).join(", "),
      calc_total: calc.total ? formatMoney(calc.total) : "",
      calculator: calc.lines?.map((l) => `${l.label}: ${formatMoney(l.amount)}`).join("; ") || "",
      source: r.source,
      referrer: r.referrer,
      utm: Object.entries(utm)
        .map(([k, v]) => `${k}=${v}`)
        .join("; "),
      referral_code: r.referral_code,
      landing_page: r.landing_page,
      visitor_id: r.visitor_id,
      user_agent: r.user_agent,
      ip: r.ip,
    });
  }

  const buf = await wb.xlsx.writeBuffer();
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(Buffer.from(buf), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "Content-Disposition": `attachment; filename="novera-leads-${date}.xlsx"`,
    },
  });
}
