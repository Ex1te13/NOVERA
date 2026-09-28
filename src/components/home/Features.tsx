"use client";

import { STATS } from "@/data/content";
import { HOUSES, INTERIORS, LAND } from "@/data/images";
import { Counter, Eyebrow, Img, Reveal } from "@/components/ui";

const FEATURES = [
  { t: "С 2005 года", d: "Двадцать лет строим дома и делаем интерьеры. Пережили все кризисы и ни одного не бросили." },
  { t: "Вся Россия", d: "Собственные бригады и партнёры в 47 регионах — от Калининграда до Владивостока." },
  { t: "Полный цикл", d: "Проект, стройка, инженерия, интерьер, участок. Одна команда и один договор." },
  { t: "Любая технология", d: "Кирпич, газобетон, клеёный брус, каркас, монолит. Материал выбираете вы." },
  { t: "Ваш проект — пожалуйста", d: "Строим по вашему проекту и работаем с вашим дизайнером без наценки." },
  { t: "Гарантия 5 лет", d: "На конструктив и инженерные системы. Фиксированная смета в договоре." },
];

export function Features() {
  return (
    <section className="relative overflow-hidden bg-moss-950 py-24 md:py-36">
      <div className="pointer-events-none absolute -right-40 top-0 h-[60vw] w-[60vw] rounded-full bg-moss-700/20 blur-[160px]" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[40vw] w-[40vw] rounded-full bg-wine-800/20 blur-[160px]" />

      <div className="container-x relative">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <Eyebrow>О компании</Eyebrow>
            <h2 className="h-display mt-4 text-4xl md:text-6xl">
              Дом — это <span className="h-serif normal-case tracking-normal text-moss-400">надолго</span>.
              <br />
              Мы тоже.
            </h2>
            <p className="mt-8 max-w-md text-mist">
              NOVERA — строительная компания, которая берёт на себя весь дом: от первой линии на плане до последнего куста на участке. Мы говорим по-человечески, считаем честно и делаем так, как обещали.
            </p>

            <dl className="mt-12 grid grid-cols-2 gap-8">
              {STATS.map((s) => (
                <div key={s.label}>
                  <dt className="font-display text-5xl font-bold tracking-tight md:text-6xl">
                    <Counter value={s.value} suffix={s.suffix} />
                  </dt>
                  <dd className="mt-2 text-[12px] uppercase tracking-wide2 text-bone/50">{s.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <Img id={INTERIORS.greenLiving} className="col-span-2 aspect-[16/9] rounded-[1.5rem] md:col-span-2" parallax={30} />
              <Img id={HOUSES.brickDusk} className="aspect-[3/4] rounded-[1.5rem]" parallax={50} />
              <Img id={LAND.birch} className="aspect-[3/4] rounded-[1.5rem]" parallax={40} />
              <Img id={INTERIORS.bathWood} className="col-span-2 aspect-[16/9] rounded-[1.5rem] md:col-span-2" parallax={30} />
            </div>
          </div>
        </div>

        <div className="mt-20 grid gap-px overflow-hidden rounded-[2rem] bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <Reveal key={f.t} delay={i * 0.05} className="bg-moss-950">
              <div className="group h-full p-8 transition-colors duration-500 hover:bg-moss-900">
                <span className="font-mono text-[11px] text-wine-400">0{i + 1}</span>
                <h3 className="mt-6 font-display text-lg font-semibold uppercase tracking-tight">{f.t}</h3>
                <p className="mt-3 text-[14px] text-bone/60">{f.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
