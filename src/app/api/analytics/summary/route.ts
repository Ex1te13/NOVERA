import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { analyticsSummary, cohorts, weeklySummaries } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const period = req.nextUrl.searchParams.get("period") || "7d";
  return NextResponse.json({
    summary: analyticsSummary(period),
    weekly: weeklySummaries(12),
    cohorts: cohorts(10),
  });
}
