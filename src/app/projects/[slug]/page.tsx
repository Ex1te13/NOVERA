import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/data/projects";
import { REVIEWS } from "@/data/content";
import { srcSet, u } from "@/data/images";
import { Gallery } from "@/components/Gallery";
import { ArrowIcon, Eyebrow, Img, Reveal } from "@/components/ui";
import { CtaBanner } from "@/components/home/CtaBanner";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProject(slug);
  return { title: p ? `${p.title} — проект` : "Проект", description: p?.excerpt };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getProject(slug);
  if (!p) notFound();
  const idx = projects.findIndex((x) => x.slug === p.slug);
  const next = projects[(idx + 1) % projects.length];
  const review = REVIEWS.find((r) => r.project === p.slug);

  return (
    <>
      <section className="relative h-[92svh] min-h-[600px] overflow-hidden">
        <img src={u(p.cover, 1920)} srcSet={srcSet(p.cover)} sizes="100vw" fetchPriority="high" alt={p.title} className="absolute inset-0 h-full w-full animate-ken object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/60 via-ink/10 to-ink" />
        <div className="container-x relative flex h-full flex-col justify-end pb-14">
          <Link href="/projects" className="eyebrow mb-8 inline-flex items-center gap-2 hover:text-bone">
            <ArrowIcon className="h-3 w-3 rotate-180" /> Все проекты
          </Link>
          <h1 className="h-display text-5xl md:text-7xl lg:text-8xl">{p.title}</h1>
          <p className="mt-4 max-w-xl font-serif text-2xl italic text-bone/80 md:text-3xl">{p.subtitle}</p>
          <dl className="mt-10 grid grid-cols-2 gap-6 border-t border-white/15 pt-6 text-[13px] md:grid-cols-5">
            {[
              ["Локация", p.location],
              ["Год", p.year],
              ["Площадь", p.area],
              ["Этажность", p.floors],
              ["Материал", p.material],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="eyebrow">{k}</dt>
                <dd className="mt-1 text-bone">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="bg-ink py-20 md:py-28">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <Eyebrow>О проекте</Eyebrow>
            <p className="mt-6 max-w-2xl font-serif text-3xl italic leading-snug text-bone/90 md:text-4xl">{p.excerpt}</p>
          </Reveal>
          <Reveal delay={0.1} className="lg:col-span-5">
            <div className={`rounded-[2rem] p-8 ${p.accent === "moss" ? "bg-moss-900/60" : "bg-wine-900/40"}`}>
              <Eyebrow>В этом проекте выполнено</Eyebrow>
              <ul className="mt-6 space-y-3">
                {p.works.map((w, i) => (
                  <li key={w} className="flex items-center gap-4 border-b border-white/10 pb-3 text-[15px] last:border-0">
                    <span className="font-mono text-[11px] text-bone/40">{String(i + 1).padStart(2, "0")}</span>
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-ink pb-20 md:pb-28">
        <div className="container-x">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <Eyebrow>Галерея</Eyebrow>
              <h2 className="h-display mt-4 text-3xl md:text-5xl">Дом, интерьер, участок</h2>
            </div>
            <span className="hidden font-mono text-[12px] text-ash md:block">{p.gallery.length} фотографий</span>
          </div>
          <Gallery items={p.gallery} />
        </div>
      </section>

      {review && (
        <section className="bg-coal py-20 md:py-28">
          <div className="container-x grid items-center gap-10 lg:grid-cols-12">
            <Reveal className="lg:col-span-8">
              <span className="font-serif text-[100px] leading-none text-wine-600">“</span>
              <p className="-mt-12 font-serif text-2xl italic leading-snug md:text-4xl">{review.text}</p>
              <p className="mt-8 font-semibold">{review.name}</p>
              <p className="text-[12px] uppercase tracking-wide2 text-bone/50">{review.location}</p>
            </Reveal>
            <Reveal delay={0.1} className="lg:col-span-4">
              <Img id={p.gallery[1]?.id || p.cover} className="aspect-[4/5] rounded-[2rem]" parallax={30} />
            </Reveal>
          </div>
        </section>
      )}

      <Link href={`/projects/${next.slug}`} className="group relative block h-[60vh] overflow-hidden">
        <img src={u(next.cover, 2000)} alt={next.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-[2000ms] ease-out group-hover:scale-105" />
        <div className="absolute inset-0 bg-ink/60 transition-colors group-hover:bg-ink/40" />
        <div className="container-x relative flex h-full flex-col items-start justify-center">
          <p className="eyebrow mb-4">Следующий проект</p>
          <p className="h-display text-4xl md:text-7xl">{next.title}</p>
          <p className="mt-3 font-serif text-2xl italic text-bone/70">{next.location}</p>
          <span className="btn-ghost mt-8">
            Смотреть <ArrowIcon />
          </span>
        </div>
      </Link>

      <CtaBanner image={p.gallery[2]?.id || p.cover} />
    </>
  );
}
