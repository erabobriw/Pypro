import { useEffect } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { useBookings } from "@/lib/bookings";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/lang";
import { exploreSearch } from "@/lib/search";

const langs: Lang[] = ["kk", "ru", "en"];

export function SiteHeader() {
  const { t, lang, setLang } = useI18n();
  const path = useRouterState({ select: (state) => state.location.pathname });
  const count = useBookings((state) => state.items.length);
  const names: Record<Lang, string> = { kk: t.langNameKk, ru: t.langNameRu, en: t.langNameEn };

  const links = [
    { to: "/explore" as const, label: t.navTours, on: path.startsWith("/explore") || path.startsWith("/tours") },
    { to: "/guides" as const, label: t.navGuides, on: path.startsWith("/guides") },
    { to: "/bookings" as const, label: t.navBookings, on: path.startsWith("/bookings") },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-9 place-items-center rounded-xl bg-copper text-ink" aria-hidden>
            <svg viewBox="0 0 24 24" className="size-4">
              <path d="M12 3 L21 20 H3 Z" fill="currentColor" />
            </svg>
          </span>
          <span>
            <span className="block text-sm font-semibold tracking-wide text-fg">{t.brand}</span>
            <span className="hidden text-xs text-muted sm:block">{t.tag}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-1 md:flex">
          {links.map((link) =>
            link.to === "/explore" ? (
              <Link
                key={link.to}
                to="/explore"
                search={exploreSearch()}
                className={`rounded-full px-3 py-2 text-sm ${link.on ? "bg-surface-2 text-fg" : "text-cream"}`}
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                className={`rounded-full px-3 py-2 text-sm ${link.on ? "bg-surface-2 text-fg" : "text-cream"}`}
              >
                {link.label}
                {link.to === "/bookings" && count > 0 ? (
                  <span className="ml-2 tabular-nums text-copper">{count}</span>
                ) : null}
              </Link>
            ),
          )}
        </nav>
        <div className="flex rounded-full border border-line bg-surface p-1">
          {langs.map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setLang(code)}
              className={`h-11 min-w-11 rounded-full px-3 text-xs font-semibold ${lang === code ? "bg-copper text-ink" : "text-muted"}`}
              aria-pressed={lang === code}
            >
              {names[code]}
            </button>
          ))}
        </div>
      </div>
      <nav className="flex gap-2 overflow-x-auto border-t border-line px-4 py-2 md:hidden">
        {links.map((link) =>
          link.to === "/explore" ? (
            <Link
              key={link.to}
              to="/explore"
              search={exploreSearch()}
              className={`shrink-0 rounded-full px-3 py-2 text-sm ${link.on ? "bg-surface-2 text-fg" : "text-cream"}`}
            >
              {link.label}
            </Link>
          ) : (
            <Link
              key={link.to}
              to={link.to}
              className={`shrink-0 rounded-full px-3 py-2 text-sm ${link.on ? "bg-surface-2 text-fg" : "text-cream"}`}
            >
              {link.label}
              {link.to === "/bookings" && count > 0 ? <span className="ml-2 text-copper">{count}</span> : null}
            </Link>
          ),
        )}
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const { t } = useI18n();
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{t.footerLine}</p>
        <p>{t.footerPhotos}</p>
      </div>
    </footer>
  );
}

export function BookingHydrate() {
  const hydrate = useBookings((state) => state.hydrate);
  useEffect(() => {
    hydrate();
  }, [hydrate]);
  return null;
}
