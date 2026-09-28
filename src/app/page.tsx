import { Hero } from "@/components/home/Hero";
import { ShowcaseScroll } from "@/components/home/ShowcaseScroll";
import { ServicesAccordion } from "@/components/home/ServicesAccordion";
import { ProjectsStrip } from "@/components/home/ProjectsStrip";
import { Features } from "@/components/home/Features";
import { ReviewsCarousel } from "@/components/home/ReviewsCarousel";
import { CtaBanner } from "@/components/home/CtaBanner";
import { Marquee } from "@/components/ui";
import { ALL_SERVICES_LIST } from "@/data/content";

export default function HomePage() {
  return (
    <>
      <Hero />
      <div className="border-y border-white/10 bg-ink py-6">
        <Marquee items={ALL_SERVICES_LIST} />
      </div>
      <ShowcaseScroll />
      <ServicesAccordion />
      <ProjectsStrip />
      <Features />
      <ReviewsCarousel />
      <CtaBanner />
    </>
  );
}
