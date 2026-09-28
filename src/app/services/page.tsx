import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { SERVICES, ALL_SERVICES_LIST } from "@/data/content";
import { INTERIORS } from "@/data/images";
import { ArrowIcon, Eyebrow, Img, Marquee, Reveal } from "@/components/ui";
import { CtaBanner } from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "Услуги",
  description: "Строительство под ключ, архитектура, интерьер, инженерные системы и благоустройство территории. Полный цикл или отдельные услуги.",
};

const STEPS = [
  { t: "Знакомство", d: "Разговор о вашем доме, участке и бюджете. Выезд на участок — бесплатно." },
  { t: "Проект и смета", d: "Ваш проект или наш. Фиксируем смету в договоре — она не меняется." },
  { t: "Стройка", d: "Своя бригада, прораб на объекте, еженедельные фотоотчёты в чате." },
  { t: "Интерьер и участок", d: "Отделка, свет, мебель, газон, деревья. Дом сдаём готовым к жизни." },
  { t: "Гарантия", d: "5 лет на конструктив и инженерию. Остаёмся на связи после сдачи." },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Услуги"
        title="Пять направлений"
        accent="один подрядчик"
        text="Можно заказать полный цикл — от проекта до газона. Или отдельную услугу: только интерьер, только инженерию, только участок. Со своим проектом или дизайнером — тоже можно."
        image={INTERIORS.darkKitchen}
      />

      <div className="border-y border-white/10 bg-ink py-5">
        <Marquee items={ALL_SERVICES_LIST} />
      </div>

      {SERVICES.map((s, i) => (
        <section key={s.id} id={s.id} className={`scroll-mt-24 py-20 md:py-28 ${i % 2 ? "bg-coal" : "bg-ink"}`}>
          <div className="container-x grid items-center gap-10 lg:grid-cols-12">
            <Reveal className={`lg:col-span-6 ${i % 2 ? "lg:order-2" : ""}`}>
              <div className="relative">
                <Img id={s.image} className="aspect-[4/5] rounded-[2rem]" parallax={40} sizes="(max-width: 1024px) 100vw, 50vw" />
                <div className="absolute -bottom-8 -right-4 hidden w-2/5 md:block">
                  <Img id={s.image2} className="aspect-[4/3] rounded-[1.5rem] shadow-2xl shadow-ink" parallax={-30} sizes="25vw" />
                </div>
                <span className="absolute left-6 top-6 font-display text-7xl font-black text-bone/20">{s.index}</span>
              </div>
            </Reveal>
            <Reveal delay={0.1} className={`lg:col-span-6 ${i % 2 ? "lg:pr-12" : "lg:pl-12"}`}>
              <Eyebrow>{s.short}</Eyebrow>
              <h2 className="h-display mt-4 text-[clamp(1.5rem,5.5vw,2.75rem)] lg:text-[clamp(1.75rem,2.8vw,2.75rem)]">{s.title}</h2>
              <p className="mt-6 text-mist">{s.description}</p>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {s.items.map((it) => (
                  <li key={it} className="flex items-center gap-3 text-[14px]">
                    <span className={`h-1.5 w-1.5 rounded-full ${i % 2 ? "bg-wine-500" : "bg-moss-400"}`} />
                    {it}
                  </li>
                ))}
              </ul>
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <span className="font-serif text-3xl italic text-moss-400">{s.price}</span>
                <Link href="/contacts#form" data-track="cta" data-cta={`service-${s.id}`} className="btn-ghost">
                  Обсудить <ArrowIcon />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      ))}

      <section className="bg-moss-950 py-24 md:py-36">
        <div className="container-x">
          <Eyebrow>Как мы работаем</Eyebrow>
          <h2 className="h-display mt-4 text-3xl md:text-5xl">Пять шагов до ключей</h2>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-[2rem] bg-white/10 md:grid-cols-5">
            {STEPS.map((st, i) => (
              <Reveal key={st.t} delay={i * 0.06} className="bg-moss-950">
                <li className="h-full p-7 transition-colors hover:bg-moss-900">
                  <span className="font-display text-4xl font-black text-bone/15">0{i + 1}</span>
                  <h3 className="mt-6 font-display text-base font-semibold uppercase">{st.t}</h3>
                  <p className="mt-3 text-[13px] text-bone/60">{st.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <CtaBanner />
    </>
  );
}
