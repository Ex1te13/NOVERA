import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProjectsGrid } from "@/components/ProjectsGrid";
import { CtaBanner } from "@/components/home/CtaBanner";
import { HOUSES } from "@/data/images";

export const metadata: Metadata = {
  title: "Проекты",
  description: "12 реализованных проектов NOVERA: дома, интерьеры, отделка, участки, озеленение, террасы и беседки.",
};

export default function ProjectsPage() {
  return (
    <>
      <PageHero
        eyebrow="Проекты"
        title="Построено"
        accent="и обжито"
        text="Двенадцать домов в разных регионах России. У каждого — фотогалерея дома, интерьера, отделки и участка, а также список того, что мы выполнили."
        image={HOUSES.darkModern3}
      />
      <ProjectsGrid />
      <CtaBanner image={HOUSES.lakeHouse} />
    </>
  );
}
