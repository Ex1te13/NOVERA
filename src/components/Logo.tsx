import Link from "next/link";

export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden>
      {/* Кровля дома — две линии, образующие N */}
      <path d="M8 40V12l16 16 16-16v28" stroke="currentColor" strokeWidth="3.2" strokeLinejoin="round" strokeLinecap="round" />
      <path d="M8 40h32" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" opacity=".45" />
      <circle cx="24" cy="34" r="2.6" className="fill-wine-500" />
    </svg>
  );
}

export function Logo({ compact = false, light = true }: { compact?: boolean; light?: boolean }) {
  return (
    <Link href="/" className={`group inline-flex items-center gap-3 ${light ? "text-bone" : "text-ink"}`} aria-label="NOVERA — на главную">
      <LogoMark className="h-9 w-9 transition-transform duration-500 group-hover:rotate-[-6deg]" />
      {!compact && (
        <span className="leading-none">
          <span className="block font-display text-[15px] font-bold uppercase tracking-[0.22em]">Novera</span>
          <span className="mt-1 block text-[9px] uppercase tracking-[0.3em] opacity-60">дома · интерьеры · участки</span>
        </span>
      )}
    </Link>
  );
}
