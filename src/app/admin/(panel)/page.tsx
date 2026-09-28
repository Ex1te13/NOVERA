import { dbAll, type LeadRow } from "@/lib/db";
import { LeadsTable } from "@/components/admin/LeadsTable";

export default async function AdminLeadsPage() {
  const rows = await dbAll<LeadRow>("SELECT * FROM leads ORDER BY id DESC");
  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Админка</p>
          <h1 className="mt-2 font-display text-3xl font-bold">Заявки</h1>
          <p className="mt-2 max-w-xl text-sm text-mist">Все поля заявки, файлы, источник и реферальные данные. Это таблица, не CRM.</p>
        </div>
        <a href="/api/export/excel" className="admin-btn">
          Скачать Excel
        </a>
      </div>
      <LeadsTable initial={rows} />
    </div>
  );
}
