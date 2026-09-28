import Link from "next/link";
import { ArrowIcon } from "@/components/ui";

export default function NotFound() {
  return (
    <section className="flex min-h-screen items-center bg-ink">
      <div className="container-x py-32">
        <p className="eyebrow eyebrow-dot">Ошибка 404</p>
        <h1 className="h-display mt-6 text-6xl md:text-9xl">Такой страницы нет</h1>
        <p className="mt-6 max-w-md text-mist">Возможно, ссылка устарела. Давайте вернёмся к домам.</p>
        <Link href="/" className="btn-primary mt-10">
          На главную <ArrowIcon />
        </Link>
      </div>
    </section>
  );
}
