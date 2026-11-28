import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { guideById, regionById, regions, tours, type Difficulty, type Transport } from "@/data/catalog";
import { difficultyLabel, transportLabel } from "@/components/copy";
import { MapCanvas } from "@/components/map-canvas";
import { toMapTour } from "@/components/map-tours";
import { TourCard } from "@/components/tour-card";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/lang";
import { exploreSearch, readExploreSearch, type ExploreSearch } from "@/lib/search";
import { matchOrigin, tourOrigin } from "@/lib/origins";

const transports: Transport[] = ["car", "suv", "bus", "horse", "mixed", "hike"];
const difficulties: Difficulty[] = ["easy", "moderate", "hard"];

export const Route = createFileRoute("/explore")({
  validateSearch: (search): ExploreSearch => readExploreSearch(search),
  component: ExplorePage,
});

function ExplorePage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { t, lang } = useI18n();

  const filtered = tours.filter((tour) => {
    if (search.region !== "all" && tour.regionId !== search.region) return false;
    if (search.transport !== "all" && tour.transport !== search.transport) return false;
    if (search.difficulty !== "all" && tour.difficulty !== search.difficulty) return false;
    if (search.from.trim()) {
      const origin = matchOrigin(search.from);
      if (origin) {
        if (tourOrigin(tour.id) !== origin) return false;
      } else if (!tx(tour.meeting, lang).toLowerCase().includes(search.from.trim().toLowerCase())) {
        return false;
      }
    }
    const query = search.q.trim().toLowerCase();
    if (query) {
      const region = regionById(tour.regionId);
      const guide = guideById(tour.guideId);
      const blob = [
        tour.title.kk,
        tour.title.ru,
        tour.title.en,
        tour.summary.kk,
        tour.summary.ru,
        tour.summary.en,
        region.name.kk,
        region.name.ru,
        region.name.en,
        guide?.name ?? "",
        guide?.village.kk ?? "",
        guide?.village.ru ?? "",
        guide?.village.en ?? "",
      ]
        .join(" ")
        .toLowerCase();
      if (!blob.includes(query)) return false;
    }
    return true;
  });

  const focusId = filtered.some((tour) => tour.id === search.focus) ? search.focus : null;

  function patch(partial: Partial<ExploreSearch>) {
    void navigate({ to: "/explore", search: { ...search, ...partial }, replace: true });
  }

  function showOnMap(id: string) {
    patch({ focus: id });
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("tour-map")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "nearest" });
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-3xl text-fg">{t.mapTitle}</h1>
      <p className="mt-2 max-w-2xl text-sm text-cream">{t.mapNote}</p>

      <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        <label className="text-xs text-muted">
          {t.fromLabel}
          <input
            value={search.from}
            onChange={(event) => patch({ from: event.target.value, focus: "" })}
            placeholder={t.fromPlaceholder}
            className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-fg"
          />
        </label>
        <label className="text-xs text-muted">
          {t.searchSubmit}
          <input
            value={search.q}
            onChange={(event) => patch({ q: event.target.value })}
            placeholder={t.searchPlaceholder}
            className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-fg"
          />
        </label>
        <Select
          label={t.filtersRegion}
          value={search.region}
          onChange={(region) => patch({ region, focus: "" })}
          options={[{ id: "all", name: t.filtersAll }, ...regions.map((region) => ({ id: region.id, name: tx(region.name, lang) }))]}
        />
        <Select
          label={t.filtersTransport}
          value={search.transport}
          onChange={(transport) => patch({ transport, focus: "" })}
          options={[
            { id: "all", name: t.filtersAll },
            ...transports.map((id) => ({ id, name: transportLabel(id, t) })),
          ]}
        />
        <Select
          label={t.filtersDifficulty}
          value={search.difficulty}
          onChange={(difficulty) => patch({ difficulty, focus: "" })}
          options={[
            { id: "all", name: t.filtersAll },
            ...difficulties.map((id) => ({ id, name: difficultyLabel(id, t) })),
          ]}
        />
      </div>

      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
        <div className="order-2 lg:order-1">
          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-line bg-surface p-6">
              <p className="text-cream">{t.filtersEmpty}</p>
              <button
                type="button"
                onClick={() => void navigate({ to: "/explore", search: exploreSearch() })}
                className="mt-4 h-11 rounded-full border border-line px-4 text-sm text-fg"
              >
                {t.filtersClear}
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filtered.map((tour) => (
                <div key={tour.id} className={tour.id === focusId ? "rounded-2xl ring-2 ring-copper" : ""}>
                  <TourCard tour={tour} onMap={showOnMap} />
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="order-1 lg:sticky lg:top-28 lg:order-2">
          <MapCanvas
            tours={filtered.map((tour) => toMapTour(tour, lang))}
            focusId={focusId}
            onFocus={(id) => patch({ focus: id })}
            loadingLabel={t.mapLoading}
            openLabel={t.mapOpen}
            kmLabel={t.km}
            note={t.mapNote}
            showChips
            transportFilter={search.transport}
            onTransportChange={(transport) => patch({ transport, focus: "" })}
            chipLabels={{
              all: t.filtersAll,
              car: t.trCar,
              suv: t.trSuv,
              bus: t.trBus,
              horse: t.trHorse,
              mixed: t.trMixed,
              hike: t.trHike,
            }}
            nightLabel={lang === "en" ? "overnight" : lang === "kk" ? "түндеу" : "ночёвка"}
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
      </div>
    </main>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { id: string; name: string }[];
}) {
  return (
    <label className="text-xs text-muted">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-1 h-11 w-full rounded-xl border border-line bg-surface px-3 text-sm text-fg"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </label>
  );
}
