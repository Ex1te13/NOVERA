import { AnalyticsDashboard } from "@/components/admin/AnalyticsDashboard";
import { analyticsSummary, cohorts, weeklySummaries } from "@/lib/analytics";
import { getSetting } from "@/lib/db";

export default function AdminAnalyticsPage() {
  const initial = {
    summary: analyticsSummary("7d"),
    weekly: weeklySummaries(12),
    cohorts: cohorts(10),
  };
  return <AnalyticsDashboard initial={initial} metrika={getSetting("YANDEX_METRIKA_ID")} />;
}
