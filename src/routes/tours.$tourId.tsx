import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { BookingPanel } from "@/components/booking-panel";
import { dayLabel, difficultyLabel, transportLabel } from "@/components/copy";
import { MapCanvas } from "@/components/map-canvas";
import { toMapTour } from "@/components/map-tours";
import { guideById, regionById, tourById } from "@/data/catalog";
import { routeKm } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/lang";
import { formatKzt } from "@/lib/money";
import { exploreSearch } from "@/lib/search";

export const Route = createFileRoute("/tours/$tourId")({ component: TourPage });

function TourPage() {
  const { tourId } = Route.useParams();
  const { lang, t } = useI18n();
  const tour = tourById(tourId);

  if (!tour) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl text-fg">{t.missingTitle}</h1>
        <p className="mt-3 text-cream">{t.missingBody}</p>
        <Link to="/explore" search={exploreSearch()} className="mt-6 inline-flex h-11 items-center text-copper">
          {t.detailBack}
        </Link>
      </main>
    );
  }

  const guide = guideById(tour.guideId);
  const region = regionById(tour.regionId);
  const road = tour.transport !== "hike";

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <Link to="/explore" search={exploreSearch({ focus: tour.id, region: tour.regionId })} className="text-sm text-copper">
        {t.detailBack}
      </Link>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-copper">{tx(region.name, lang)}</p>
          <h1 className="mt-2 text-4xl text-fg">{tx(tour.title, lang)}</h1>
          <p className="mt-3 text-sm text-muted">
            {dayLabel(tour.days, lang)} · {transportLabel(tour.transport, t)} · {difficultyLabel(tour.difficulty, t)} ·{" "}
            <span className="tabular-nums text-fg">{formatKzt(tour.priceKzt)}</span> {t.perPerson}
            {tour.route.length > 1 ? ` · ${routeKm(tour.route)} ${t.km}` : ""}
          </p>
          <img src={tour.image} alt={tx(tour.title, lang)} className="mt-5 h-72 w-full rounded-2xl object-cover sm:h-96" />
          <p className="mt-5 text-base leading-relaxed text-cream">{tx(tour.summary, lang)}</p>

          <h2 className="mt-8 text-2xl text-fg">{t.detailRoute}</h2>
          <p className="mt-2 text-sm text-cream">{road ? t.detailSchematic : t.detailNoRoad}</p>
          <div className="mt-4">
            <MapCanvas
              tours={[toMapTour(tour, lang)]}
              focusId={tour.id}
              onFocus={() => undefined}
              loadingLabel={t.mapLoading}
              openLabel={t.mapOpen}
              kmLabel={t.km}
              note={t.mapNote}
              daysLabel={t.daysShort}
              nightsLabel={t.nightsShort}
              includesLabel={t.includesShort}
              bookLabel={t.bookCta}
              profileLabels={{
                car: t.profileCar,
                foot: t.profileFoot,
                jeep: t.profileJeep,
                trail: t.profileTrail,
                wait: t.profileWait,
                sketch: t.profileSketch,
              }}
            />
          </div>
          <ol className="mt-4 space-y-2">
            {tour.stops.map((stop, index) => (
              <li key={tx(stop.name, lang)} className="flex gap-3 text-sm text-cream">
                <span className="tabular-nums text-copper">{String(index + 1).padStart(2, "0")}</span>
                {tx(stop.name, lang)}
              </li>
            ))}
          </ol>

          <h2 className="mt-8 text-2xl text-fg">{t.detailMeeting}</h2>
          <p className="mt-2 text-sm text-cream">{tx(tour.meeting, lang)}</p>
          <h2 className="mt-8 text-2xl text-fg">{t.detailIncludes}</h2>
          <ul className="mt-2 space-y-1 text-sm text-cream">
            {tour.includes.map((item) => (
              <li key={tx(item, lang)}>{tx(item, lang)}</li>
            ))}
          </ul>

          {guide ? (
            <Link
              to="/guides/$guideId"
              params={{ guideId: guide.id }}
              className="mt-8 flex items-start gap-3 rounded-2xl border border-line bg-surface p-4"
            >
              <span className="grid size-12 shrink-0 place-items-center rounded-full bg-surface-2 font-serif text-lg text-copper">
                {guide.name.slice(0, 1)}
              </span>
              <span>
                <span className="flex items-center gap-1 text-fg">
                  <BadgeCheck className="size-4 text-moss" aria-hidden />
                  {guide.name}
                  <span className="text-xs text-moss">{t.verified}</span>
                </span>
                <span className="mt-1 block text-sm text-cream">{tx(guide.bio, lang)}</span>
              </span>
            </Link>
          ) : null}
        </div>
        <BookingPanel tour={tour} />
      </div>
    </main>
  );
}
