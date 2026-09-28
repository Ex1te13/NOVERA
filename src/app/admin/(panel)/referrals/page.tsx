import { Referrals } from "@/components/admin/Referrals";
import { referralStats } from "@/lib/analytics";

export default function AdminReferralsPage() {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  return <Referrals initial={referralStats()} siteUrl={siteUrl} />;
}
