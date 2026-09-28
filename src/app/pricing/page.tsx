import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Calculator } from "@/components/Calculator";
import { PRICES } from "@/data/content";
import { HOUSES } from "@/data/images";
import { Eyebrow, Reveal } from "@/components/ui";
import { CtaBanner } from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "Стоимость и калькулятор",
  description: "Тёплый контур от 65 000 ₽/м², предчистовая от 85 000 ₽/м², под ключ от 110 000 ₽/м². Интерактивный калькулятор стоимости дома.",
};

export default function PricingPage() {
  return (
    <>
      <PageHero
        eyebrow="Стоимость"
        title="Честные цифры"
        accent="до первой встречи"
        text="Базовые ставки за квадратный метр и интерактивный калькулятор. Точную смету зафиксируем в договоре после выезда на участок."
        image={HOUSES.greyFarm}
      />

      <section className="bg-ink pb-20 md:pb-28">
        <div className="container-x">
          <div className="grid gap-px overflow-hidden rounded-[2rem] bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {PRICES.map((p, i) => (
              <Reveal key={p.label} delay={i * 0.04} className="bg-ink">
                <div className={`h-full p-7 transition-colors hover:bg-coal ${i < 3 ? "lg:col-span-1" : ""}`}>
                  <p className="eyebrow">{p.label}</p>
                  <p className={`mt-4 font-display font-bold tracking-tight ${p.value.length > 18 ? "text-xl md:text-2xl" : "text-2xl md:text-3xl"}`}>{p.value}</p>
                  <p className="mt-3 text-[13px] text-mist">{p.note}</p>
                </div>
              </Reveal>
            ))}
            <div className="hidden bg-gradient-to-br from-moss-900 to-wine-950 p-7 lg:block">
              <p className="eyebrow">Что входит</p>
              <p className="mt-4 font-serif text-2xl italic">Материалы, работа, прораб, фотоотчёты, гарантия 5 лет</p>
            </div>
          </div>
        </div>
      </section>

      <section id="calculator" className="scroll-mt-20 bg-coal py-20 md:py-28">
        <div className="container-x">
          <div className="mb-14 max-w-2xl">
            <Eyebrow>Калькулятор</Eyebrow>
            <h2 className="h-display mt-4 text-3xl md:text-5xl">Соберите свой дом</h2>
            <p className="mt-5 text-mist">Меняйте параметры — стоимость пересчитывается сразу. Результат автоматически подставится в заявку.</p>
          </div>
          <Calculator />
        </div>
      </section>

      <CtaBanner image={HOUSES.brickDusk} title={<>Точная смета — <span className="h-serif normal-case tracking-normal text-wine-400">бесплатно</span></>} text="Приедем на участок, обсудим проект и в течение недели пришлём детальную смету с фиксированной ценой." />
    </>
  );
}
