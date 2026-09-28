import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { STATS } from "@/data/content";
import { HOUSES, INTERIORS, LAND } from "@/data/images";
import { ArrowIcon, Counter, Eyebrow, Img, Reveal } from "@/components/ui";
import { CtaBanner } from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "О компании",
  description: "NOVERA с 2005 года строит частные дома по всей России. Полный цикл, любые технологии, работа с вашим проектом и дизайнером, гарантия.",
};

const PRINCIPLES = [
  {
    t: "С 2005 года",
    d: "Мы начинали с одного дома под Москвой. Сейчас за плечами больше трёхсот объектов, но каждый новый дом по-прежнему собирается вручную — нашими людьми, а не подрядчиками подрядчиков.",
  },
  {
    t: "Вся Россия",
    d: "Строим от Калининграда до Владивостока. В 47 регионах у нас есть проверенные бригады, поставщики и прорабы, которые знают местный климат и грунты.",
  },
  {
    t: "Полный цикл",
    d: "Архитектура, стройка, инженерия, интерьер, ландшафт. Один договор и один ответственный. Но если нужна только часть — сделаем только её.",
  },
  {
    t: "Любая технология",
    d: "Кирпич, газобетон, клеёный брус, каркас, монолит. Мы не продаём «свою» технологию — подбираем ту, что подходит вашему участку, бюджету и образу жизни.",
  },
  {
    t: "Ваш проект и ваш дизайнер",
    d: "Пришли с готовым проектом — адаптируем и построим. Работаете с любимым дизайнером — будем работать с ним. Без наценок и обид.",
  },
  {
    t: "Опыт и гарантии",
    d: "Пять лет гарантии на конструктив и инженерные системы. Смета фиксируется в договоре и не растёт в процессе. Так работаем двадцать лет.",
  },
];

const TIMELINE = [
  { y: "2005", t: "Первый дом в Подмосковье. Команда из шести человек." },
  { y: "2009", t: "Собственное проектное бюро и первый дизайнер интерьеров в штате." },
  { y: "2013", t: "Выход в регионы: Казань, Нижний Новгород, Краснодар." },
  { y: "2017", t: "Направление ландшафта и благоустройства. Свой питомник крупномеров." },
  { y: "2021", t: "Сотый дом под ключ. Инженерное подразделение и умный дом." },
  { y: "2025", t: "47 регионов, 340+ объектов. Продолжаем строить по одному дому за раз." },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="О компании"
        title="Дом — это надолго."
        accent="Мы тоже"
        text="NOVERA — строительная компания, которая берёт на себя весь дом: от первой линии на плане до последнего куста на участке. Строим с 2005 года по всей России."
        image={HOUSES.fieldSunset}
      />

      <section className="bg-ink py-20 md:py-28">
        <div className="container-x grid gap-4 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <Img id={INTERIORS.livingWood} className="aspect-[16/10] rounded-[2rem]" parallax={40} />
          </Reveal>
          <Reveal delay={0.1} className="md:col-span-5">
            <Img id={HOUSES.entrance} className="aspect-[4/5] rounded-[2rem] md:h-full" parallax={60} />
          </Reveal>
        </div>
        <div className="container-x mt-16 grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="border-t border-white/15 pt-6">
              <p className="font-display text-5xl font-bold tracking-tight md:text-6xl">
                <Counter value={s.value} suffix={s.suffix} />
              </p>
              <p className="mt-2 text-[12px] uppercase tracking-wide2 text-bone/50">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-coal py-20 md:py-28">
        <div className="container-x">
          <Eyebrow>Что для нас важно</Eyebrow>
          <h2 className="h-display mt-4 max-w-3xl text-3xl md:text-5xl">Мы говорим по-человечески, считаем честно и делаем так, как обещали</h2>
          <div className="mt-14 grid gap-x-12 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
            {PRINCIPLES.map((p, i) => (
              <Reveal key={p.t} delay={i * 0.05}>
                <span className="font-mono text-[11px] text-wine-400">0{i + 1}</span>
                <h3 className="mt-4 font-display text-xl font-semibold uppercase tracking-tight">{p.t}</h3>
                <p className="mt-3 text-[14px] leading-relaxed text-mist">{p.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-moss-950 py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>Путь</Eyebrow>
            <h2 className="h-display mt-4 text-3xl md:text-5xl">Двадцать лет по одному дому за раз</h2>
            <Img id={LAND.plans} className="mt-10 aspect-[4/3] rounded-[2rem]" parallax={30} />
          </div>
          <ol className="relative lg:col-span-7 lg:pl-12">
            <span className="absolute left-0 top-0 hidden h-full w-px bg-white/10 lg:block" />
            {TIMELINE.map((t, i) => (
              <Reveal key={t.y} delay={i * 0.05}>
                <li className="relative flex gap-8 border-b border-white/10 py-7 last:border-0">
                  <span className="absolute -left-12 top-9 hidden h-2 w-2 -translate-x-1/2 rounded-full bg-wine-500 lg:block" />
                  <span className="font-display text-3xl font-bold text-moss-400">{t.y}</span>
                  <p className="pt-2 text-bone/80">{t.t}</p>
                </li>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-ink py-20 md:py-28">
        <div className="container-x grid items-center gap-10 lg:grid-cols-12">
          <Reveal className="lg:col-span-6">
            <Eyebrow>Гарантии</Eyebrow>
            <h2 className="h-display mt-4 text-3xl md:text-5xl">Что записано в договоре</h2>
            <ul className="mt-10 space-y-5">
              {[
                ["Фиксированная смета", "Итоговая стоимость не меняется после подписания. Все изменения — только по вашей инициативе и с отдельным соглашением."],
                ["Сроки с неустойкой", "Срок сдачи — в договоре. За каждую неделю просрочки платим неустойку."],
                ["5 лет гарантии", "На фундамент, стены, кровлю и инженерные системы. Приезжаем и устраняем за свой счёт."],
                ["Прозрачная стройка", "Еженедельные фотоотчёты, доступ к чату с прорабом, приёмка каждого этапа."],
              ].map(([t, d]) => (
                <li key={t} className="flex gap-5">
                  <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-moss-800">
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12l5 5L20 7" />
                    </svg>
                  </span>
                  <div>
                    <p className="font-semibold">{t}</p>
                    <p className="mt-1 text-[14px] text-mist">{d}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link href="/contacts" className="btn-primary mt-10">
              Познакомиться <ArrowIcon />
            </Link>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-6">
            <Img id={HOUSES.woodModern} className="aspect-[4/5] rounded-[2rem]" parallax={50} />
          </Reveal>
        </div>
      </section>

      <CtaBanner image={HOUSES.darkSlats} />
    </>
  );
}
