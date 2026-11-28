import { Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { dayLabel, difficultyLabel, transportLabel } from "@/components/copy";
import { guideById, regionById, type Tour } from "@/data/catalog";
import { routeKm } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/lang";
import { formatKzt } from "@/lib/money";

export function TourCard({ tour, onMap }: { tour: Tour; onMap?: (id: string) => void }) {
  const { lang, t } = useI18n();
  const guide = guideById(tour.guideId);
  const region = regionById(tour.regionId);

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      <img src={tour.image} alt={tx(tour.title, lang)} className="h-44 w-full object-cover" />
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-copper">{tx(region.name, lang)}</p>
          <p className="text-right text-sm font-semibold tabular-nums text-fg">
            {formatKzt(tour.priceKzt)}
            <span className="block text-xs font-normal text-muted">{t.perPerson}</span>
          </p>
        </div>
        <h3 className="mt-2 text-xl text-fg">{tx(tour.title, lang)}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cream">{tx(tour.summary, lang)}</p>
        <p className="mt-3 text-sm text-muted">
          {dayLabel(tour.days, lang)} · {transportLabel(tour.transport, t)} · {difficultyLabel(tour.difficulty, t)}
          {tour.route.length > 1 ? ` · ${routeKm(tour.route)} ${t.km}` : ""}
        </p>
        {guide ? (
          <p className="mt-2 flex items-center gap-1 text-sm text-cream">
            <BadgeCheck className="size-4 text-moss" aria-hidden />
            {guide.name}
          </p>
        ) : null}
        <div className="mt-4 flex gap-2">
          <Link
            to="/tours/$tourId"
            params={{ tourId: tour.id }}
            className="inline-flex h-11 items-center rounded-full bg-copper px-4 text-sm font-semibold text-ink"
          >
            {t.viewTour}
          </Link>
          {onMap ? (
            <button
              type="button"
              onClick={() => onMap(tour.id)}
              className="inline-flex h-11 items-center rounded-full border border-line px-4 text-sm text-fg"
            >
              {t.onMap}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}
