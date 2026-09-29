import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { LeadForm } from "@/components/LeadForm";
import { COMPANY } from "@/data/content";
import { HOUSES } from "@/data/images";
import { Eyebrow, Reveal } from "@/components/ui";

export const metadata: Metadata = {
  title: "Контакты и заявка",
  description: "Свяжитесь с NOVERA: Москва, ул. Волхонка, 15. Оставьте заявку на расчёт стоимости дома.",
};

export default function ContactsPage() {
  return (
    <>
      <PageHero eyebrow="Контакты" title="Начнём" accent="с разговора" text="Позвоните, напишите или оставьте заявку — ответим в течение рабочего дня." image={HOUSES.entrance} />

      <section className="bg-ink pb-20 md:pb-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="min-w-0 lg:col-span-4">
            <div className="space-y-10">
              <div>
                <Eyebrow>Телефон</Eyebrow>
                <a href={COMPANY.phoneHref} className="mt-3 block font-display text-2xl font-semibold hover:text-moss-400 md:text-3xl">
                  {COMPANY.phone}
                </a>
                <p className="mt-1 text-[13px] text-mist">{COMPANY.hours}</p>
              </div>
              <div>
                <Eyebrow>Email</Eyebrow>
                <a href={`mailto:${COMPANY.email}`} className="link-line mt-3 inline-block text-xl">
                  {COMPANY.email}
                </a>
              </div>
              <div>
                <Eyebrow>Офис</Eyebrow>
                <p className="mt-3 text-xl">{COMPANY.address}</p>
                <p className="mt-1 text-[13px] text-mist">Метро Кропоткинская, 3 минуты пешком</p>
              </div>
              <div>
                <Eyebrow>Мессенджеры</Eyebrow>
                <div className="mt-4 flex gap-3">
                  <a href={COMPANY.telegram} target="_blank" rel="noreferrer" data-track="social" className="glass rounded-full px-5 py-2.5 text-[11px] uppercase tracking-wide2 hover:bg-white/10">
                    Telegram
                  </a>
                  <a href={COMPANY.whatsapp} target="_blank" rel="noreferrer" data-track="social" className="glass rounded-full px-5 py-2.5 text-[11px] uppercase tracking-wide2 hover:bg-white/10">
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="min-w-0 lg:col-span-8">
            <div id="form" className="scroll-mt-28 rounded-[2rem] border border-white/10 bg-coal p-7 md:p-12">
              <Eyebrow>Заявка</Eyebrow>
              <h2 className="h-display mt-4 text-3xl md:text-4xl">Расскажите о проекте</h2>
              <div className="mt-10">
                <LeadForm source="contacts" />
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink px-3 pb-3 md:px-5 md:pb-5">
        <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem]">
          <iframe
            title="Карта: Москва, ул. Волхонка, 15"
            src="https://yandex.ru/map-widget/v1/?ll=37.606%2C55.746&z=16&pt=37.606%2C55.746%2Cpm2rdm&l=map"
            className="h-[60vh] w-full grayscale invert-[.92] hue-rotate-180 contrast-[.9]"
            loading="lazy"
            allowFullScreen
          />
          <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/10 md:rounded-[3rem]" />
          <div className="glass absolute bottom-6 left-6 rounded-2xl px-5 py-4">
            <p className="eyebrow">Офис NOVERA</p>
            <p className="mt-1 font-semibold">{COMPANY.address}</p>
          </div>
        </div>
      </section>
    </>
  );
}
