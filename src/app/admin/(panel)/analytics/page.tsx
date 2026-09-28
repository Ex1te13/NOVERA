import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { analyticsSummary, cohorts, weeklySummaries } from "@/lib/analytics";
import { getSetting } from "@/lib/db";

export default async function AdminAnalyticsPage() {
  const [summary, weekly, cohortRows, metrika] = await Promise.all([
    analyticsSummary("7d"),
    weeklySummaries(12),
    cohorts(10),
    getSetting("YANDEX_METRIKA_ID"),
  ]);
  return <AnalyticsDashboard initial={{ summary, weekly, cohorts: cohortRows }} metrika={metrika} />;
}
