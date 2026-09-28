import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { databaseConfigured } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function AdminPanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getAdminSession();
  if (!user) redirect("/admin/login");
  if (!databaseConfigured()) {
    return (
      <div className="flex min-h-screen flex-col bg-ink lg:flex-row">
        <AdminNav user={user} />
        <div className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">
          <p className="eyebrow">Аналитика</p>
          <h1 className="mt-2 font-display text-3xl font-bold">База не подключена</h1>
          <p className="mt-4 max-w-xl text-sm text-mist">
            На опубликованном сайте посещения и заявки сохраняются только в постоянной базе Turso. В настройках проекта Vercel добавьте
            TURSO_DATABASE_URL и TURSO_AUTH_TOKEN, затем перезапустите деплой.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex min-h-screen flex-col bg-ink lg:flex-row">
      <AdminNav user={user} />
      <div className="min-w-0 flex-1 px-4 py-6 md:px-8 md:py-8">{children}</div>
    </div>
  );
}
