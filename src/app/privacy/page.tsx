import type { Metadata } from "next";
import { COMPANY } from "@/data/content";

export const metadata: Metadata = { title: "Политика конфиденциальности" };

export default function PrivacyPage() {
  return (
    <section className="bg-ink pb-24 pt-36">
      <div className="container-x max-w-3xl">
        <p className="eyebrow eyebrow-dot">Документы</p>
        <h1 className="h-display mt-6 hyphens-auto text-[clamp(1.2rem,5vw,2.5rem)]">Политика конфиденциальности</h1>
        <div className="mt-10 space-y-6 text-[15px] leading-relaxed text-bone/80">
          <p>
            Настоящая политика описывает, как {COMPANY.name} обрабатывает персональные данные, которые вы оставляете на сайте: имя, телефон, электронную почту, регион, описание проекта и приложенные файлы.
          </p>
          <p>Данные используются исключительно для связи с вами по вашему запросу, подготовки расчёта и предложения. Мы не передаём их третьим лицам, кроме случаев, предусмотренных законом.</p>
          <p>Для анализа посещаемости сайт использует собственную обезличенную статистику и сервис Яндекс Метрика. Вы можете отключить cookies в настройках браузера.</p>
          <p>
            Вы вправе запросить удаление своих данных, написав на <a href={`mailto:${COMPANY.email}`} className="underline">{COMPANY.email}</a>.
          </p>
          <p className="text-mist">Адрес: {COMPANY.address}. Телефон: {COMPANY.phone}.</p>
        </div>
      </div>
    </section>
  );
}
