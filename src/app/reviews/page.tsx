import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { REVIEWS } from "@/data/content";
import { getProject } from "@/data/projects";
import { INTERIORS, u } from "@/data/images";
import { ArrowIcon, Reveal } from "@/components/ui";
import { CtaBanner } from "@/components/home/CtaBanner";

export const metadata: Metadata = {
  title: "Отзывы",
  description: "Отзывы заказчиков NOVERA о строительстве домов, интерьерах и благоустройстве участков.",
};

export default function ReviewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Отзывы"
        title="Говорят"
        accent="заказчики"
        text="Шесть историй о том, как строился дом. Каждый отзыв связан с реальным проектом из нашего портфолио."
        image={INTERIORS.livingWarm}
      />
      <section className="bg-ink pb-24 md:pb-36">
        <div className="container-x grid gap-5 md:grid-cols-2">
          {REVIEWS.map((r, i) => {
            const p = getProject(r.project);
            return (
              <Reveal key={r.name} delay={(i % 2) * 0.08}>
                <article className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] p-8 md:p-10 ${i % 3 === 0 ? "bg-moss-900/50" : i % 3 === 1 ? "bg-coal" : "bg-wine-950/70"}`}>
                  <div className="flex items-center gap-1 text-wine-400">
                    {Array.from({ length: r.rating }).map((_, k) => (
                      <svg key={k} viewBox="0 0 20 20" className="h-3.5 w-3.5 fill-current">
                        <path d="M10 1.5l2.6 5.6 6.1.7-4.5 4.2 1.2 6-5.4-3-5.4 3 1.2-6L1.3 7.8l6.1-.7z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-6 flex-1 font-serif text-xl italic leading-snug text-bone/90 md:text-2xl">{r.text}</p>
                  <div className="mt-8 flex items-center justify-between gap-4 border-t border-white/10 pt-6">
                    <div>
                      <p className="font-semibold">{r.name}</p>
                      <p className="text-[12px] uppercase tracking-wide2 text-bone/50">{r.location}</p>
                    </div>
                    {p && (
                      <Link href={`/projects/${p.slug}`} className="flex items-center gap-3 text-right">
                        <span>
                          <span className="eyebrow block text-bone/50">Проект</span>
                          <span className="text-[13px]">{p.title}</span>
                        </span>
                        <span className="relative h-14 w-14 overflow-hidden rounded-xl">
                          <img src={u(p.cover, 300)} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        </span>
                        <ArrowIcon className="h-4 w-4 text-bone/50" />
                      </Link>
                    )}
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>
      <CtaBanner />
    </>
  );
}
