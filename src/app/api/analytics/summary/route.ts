import { NextRequest, NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth";
import { analyticsSummary, cohorts, weeklySummaries } from "@/lib/analytics";

export async function GET(req: NextRequest) {
  if (!(await getAdminSession())) return NextResponse.json({ error: "auth" }, { status: 401 });
  const period = req.nextUrl.searchParams.get("period") || "7d";
  const [summary, weekly, cohortRows] = await Promise.all([analyticsSummary(period), weeklySummaries(12), cohorts(10)]);
  return NextResponse.json({
    summary,
    weekly,
    cohorts: cohortRows,
  });
}
