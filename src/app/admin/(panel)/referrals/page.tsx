import { Referrals } from "@/components/admin/Referrals";
import { referralStats } from "@/lib/analytics";

export default async function AdminReferralsPage() {
  const siteUrl = process.env.SITE_URL || "http://localhost:3000";
  return <Referrals initial={await referralStats()} siteUrl={siteUrl} />;
}
