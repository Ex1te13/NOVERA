"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

type Ym = (id: number, action: string, ...args: unknown[]) => void;
const ym = (): Ym | undefined => (typeof window !== "undefined" ? (window as unknown as { ym?: Ym }).ym : undefined);

function stored(key: string, storage: Storage) {
  let v = storage.getItem(key);
  if (!v) {
    v = crypto.randomUUID();
    storage.setItem(key, v);
  }
  return v;
}

export function getTrackingContext() {
  if (typeof window === "undefined") return {};
  const p = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"].forEach((k) => {
    const v = p.get(k) || sessionStorage.getItem("nv_" + k);
    if (v) {
      utm[k] = v;
      sessionStorage.setItem("nv_" + k, v);
    }
  });
  return {
    visitor_id: stored("nv_vid", localStorage),
    session_id: stored("nv_sid", sessionStorage),
    referral_code: localStorage.getItem("nv_ref") || "",
    referrer: sessionStorage.getItem("nv_referrer") || document.referrer || "",
    landing_page: sessionStorage.getItem("nv_landing") || window.location.pathname,
    utm,
  };
}

export function track(type: string, payload: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  const ctx = getTrackingContext();
  fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    keepalive: true,
    body: JSON.stringify({ type, payload, path: window.location.pathname, ...ctx }),
  }).catch(() => {});
  const id = Number(document.documentElement.dataset.metrika || 0);
  const y = ym();
  if (id && y) y(id, "reachGoal", type.toUpperCase(), payload);
}

export function AnalyticsTracker({ metrikaId }: { metrikaId?: string }) {
  const path = usePathname();

  useEffect(() => {
    if (metrikaId) document.documentElement.dataset.metrika = metrikaId;
  }, [metrikaId]);

  useEffect(() => {
    if (path?.startsWith("/admin")) return;
    const ref = new URLSearchParams(window.location.search).get("ref");
    if (ref) {
      localStorage.setItem("nv_ref", ref);
      document.cookie = `nv_ref=${encodeURIComponent(ref)};path=/;max-age=15552000`;
    }
    if (!sessionStorage.getItem("nv_landing")) {
      sessionStorage.setItem("nv_landing", window.location.pathname + window.location.search);
      sessionStorage.setItem("nv_referrer", document.referrer);
    }
    const ctx = getTrackingContext();
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "pageview", path, user_agent: navigator.userAgent, ...ctx, referrer: document.referrer }),
    }).catch(() => {});
    const y = ym();
    if (metrikaId && y) y(Number(metrikaId), "hit", path);
  }, [path, metrikaId]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-track], a[href^='tel:'], a[href^='mailto:']") as HTMLElement | null;
      if (!el) return;
      const href = el.getAttribute("href") || "";
      let type = el.getAttribute("data-track") || "";
      if (href.startsWith("tel:")) type = "phone";
      if (href.startsWith("mailto:")) type = "email";
      if (!type) return;
      track(type, { cta: el.getAttribute("data-cta"), href, text: el.textContent?.trim().slice(0, 80) });
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  if (!metrikaId) return null;
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js","ym");ym(${Number(metrikaId)},"init",{clickmap:true,trackLinks:true,accurateTrackBounce:true,webvisor:true,ecommerce:false});`,
        }}
      />
      <noscript>
        <div>
          <img src={`https://mc.yandex.ru/watch/${Number(metrikaId)}`} style={{ position: "absolute", left: -9999 }} alt="" />
        </div>
      </noscript>
    </>
  );
}
