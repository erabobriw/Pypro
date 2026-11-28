import { createFileRoute, Link } from "@tanstack/react-router";
import { BadgeCheck } from "lucide-react";
import { langList } from "@/components/copy";
import { MapCanvas } from "@/components/map-canvas";
import { toMapTour } from "@/components/map-tours";
import { TourCard } from "@/components/tour-card";
import { guideById, regionById, toursForGuide } from "@/data/catalog";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/lang";

export const Route = createFileRoute("/guides/$guideId")({ component: GuidePage });

function GuidePage() {
  const { guideId } = Route.useParams();
  const { lang, t } = useI18n();
  const guide = guideById(guideId);

  if (!guide) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-3xl text-fg">{t.missingTitle}</h1>
        <Link to="/guides" className="mt-4 inline-flex text-copper">
          {t.navGuides}
        </Link>
      </main>
    );
  }

  const region = regionById(guide.regionId);
  const mine = toursForGuide(guide.id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <Link to="/guides" className="text-sm text-copper">
        {t.navGuides}
      </Link>
      <div className="mt-4 flex items-start gap-4">
        <span className="grid size-16 place-items-center rounded-full bg-surface font-serif text-2xl text-copper">
          {guide.name.slice(0, 1)}
        </span>
        <div>
          <h1 className="flex items-center gap-2 text-4xl text-fg">
            {guide.name}
            <BadgeCheck className="size-5 text-moss" aria-label={t.verified} />
          </h1>
          <p className="mt-2 text-sm text-muted">
            {tx(guide.village, lang)} · {tx(region.name, lang)} · {guide.years} {t.guideYears}
          </p>
          <p className="mt-1 text-sm text-cream">
            {t.guideLangs}: {langList(guide.languages)}
          </p>
        </div>
      </div>
      <p className="mt-5 max-w-2xl text-base text-cream">{tx(guide.bio, lang)}</p>
      <div className="mt-6">
        <MapCanvas
          compact
          tours={mine.map((tour) => toMapTour(tour, lang))}
          focusId={null}
          onFocus={() => undefined}
          loadingLabel={t.mapLoading}
          openLabel={t.mapOpen}
          kmLabel={t.km}
          note={t.mapNote}
        />
      </div>
      <h2 className="mt-8 text-2xl text-fg">{t.guideTours}</h2>
      <div className="mt-4 grid gap-4 md:grid-cols-2">
        {mine.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </main>
  );
}
