"use client";

import Link from "next/link";
import { HOUSES } from "@/data/images";
import { ArrowIcon, Img, MagneticButton, Reveal } from "@/components/ui";

export function CtaBanner({ image = HOUSES.darkModern2, title, text }: { image?: string; title?: React.ReactNode; text?: string }) {
  return (
    <section className="relative bg-ink px-3 pb-3 md:px-5 md:pb-5">
      <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem]">
        <Img id={image} w={2200} className="absolute inset-0 h-full w-full" parallax={60} sizes="100vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/50 to-ink/20" />
        <div className="absolute inset-0 bg-wine-950/30 mix-blend-multiply" />
        <div className="container-x relative flex min-h-[70vh] flex-col justify-end py-16 md:py-24">
          <Reveal>
            <p className="eyebrow eyebrow-dot mb-6">Начнём с разговора</p>
            <h2 className="h-display max-w-4xl text-4xl md:text-7xl">
              {title ?? (
                <>
                  Расскажите <span className="h-serif normal-case tracking-normal text-wine-400">о доме</span>, который хотите
                </>
              )}
            </h2>
            <p className="mt-6 max-w-lg text-bone/70">
              {text ?? "Предварительный расчёт за минуту в калькуляторе. Точная смета — после встречи и выезда на участок."}
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <MagneticButton>
                <Link href="/pricing#calculator" data-track="cta" data-cta="banner-calc" className="btn-primary">
                  Рассчитать стоимость <ArrowIcon />
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link href="/contacts" data-track="cta" data-cta="banner-request" className="btn-ghost">
                  Оставить заявку
                </Link>
              </MagneticButton>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
