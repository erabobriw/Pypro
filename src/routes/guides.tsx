import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { langList } from "@/components/copy";
import { guides, regionById, toursForGuide } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/lang";

export const Route = createFileRoute("/guides")({ component: GuidesPage });

function GuidesPage() {
  const { lang, t } = useI18n();

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl text-fg">{t.navGuides}</h1>
      <p className="mt-3 max-w-2xl text-sm text-cream">{t.demo}</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {guides.map((guide) => {
          const region = regionById(guide.regionId);
          return (
            <Link
              key={guide.id}
              to="/guides/$guideId"
              params={{ guideId: guide.id }}
              className="rounded-2xl border border-line bg-surface p-4"
            >
              <div className="flex items-start gap-3">
                <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-2 font-serif text-xl text-copper">
                  {guide.name.slice(0, 1)}
                </span>
                <div>
                  <h2 className="flex items-center gap-2 text-xl text-fg">
                    {guide.name}
                    {guide.verified ? <BadgeCheck className="size-4 text-moss" aria-label={t.verified} /> : null}
                  </h2>
                  <p className="mt-1 text-sm text-muted">
                    {tx(guide.village, lang)} · {tx(region.name, lang)}
                  </p>
                  <p className="mt-2 text-sm text-cream">{tx(guide.bio, lang)}</p>
                  <p className="mt-3 text-xs text-muted">
                    {guide.years} {t.guideYears} · {t.guideLangs}: {langList(guide.languages)} · {toursForGuide(guide.id).length}{" "}
                    {t.navTours.toLowerCase()}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </main>
  );
}
