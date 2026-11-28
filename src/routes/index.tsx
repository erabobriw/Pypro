import { useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { guides, regions, tours } from "@/data/catalog";
import { FeeTable } from "@/components/fee-table";
import { MapCanvas } from "@/components/map-canvas";
import { toMapTour } from "@/components/map-tours";
import { TourCard } from "@/components/tour-card";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/lang";
import { exploreSearch } from "@/lib/search";
import { matchOrigin } from "@/lib/origins";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [from, setFrom] = useState("");
  const featured = tours.slice(0, 3);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="grid items-center gap-8 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-copper">{t.heroKicker}</p>
          <h1 className="mt-3 text-4xl text-fg sm:text-5xl">{t.heroTitle}</h1>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-cream">{t.heroBody}</p>
          <p className="mt-3 text-sm text-muted">
            {tours.length} {t.navTours.toLowerCase()} · {guides.length} {t.navGuides.toLowerCase()}
          </p>
          <form
            className="mt-6 flex flex-col gap-2 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              void navigate({
                to: "/explore",
                search: exploreSearch({
                  q: matchOrigin(q) ? "" : q,
                  from: from || (matchOrigin(q) ? q : ""),
                }),
              });
            }}
          >
            <label className="sr-only" htmlFor="q">
              {t.searchSubmit}
            </label>
            <input
              id="from"
              aria-label={t.fromLabel}
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              placeholder={t.fromPlaceholder}
              className="h-12 flex-1 rounded-full border border-line bg-surface px-4 text-fg"
            />
            <input
              id="q"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder={t.searchPlaceholder}
              className="h-12 flex-1 rounded-full border border-line bg-surface px-4 text-fg"
            />
            <button type="submit" className="h-12 rounded-full bg-copper px-5 font-semibold text-ink">
              {t.searchSubmit}
            </button>
          </form>
          <div className="mt-4 flex flex-wrap gap-2">
            {regions.map((region) => (
              <Link
                key={region.id}
                to="/explore"
                search={exploreSearch({ region: region.id })}
                className="rounded-full border border-line px-3 py-2 text-xs text-cream"
              >
                {tx(region.name, lang)}
              </Link>
            ))}
          </div>
        </div>
        <img
          src="/tours/altai.jpg"
          alt={t.heroTitle}
          className="h-72 w-full rounded-2xl object-cover sm:h-96"
        />
      </section>

      <p className="mt-6 rounded-2xl border border-line bg-surface px-4 py-3 text-sm text-cream">{t.demo}</p>

      <section className="mt-12 grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-copper">{t.feeLabel}</p>
          <p className="mt-2 font-serif text-5xl text-copper">{t.feeValue}</p>
          <p className="mt-3 text-sm leading-relaxed text-cream">{t.feeNote}</p>
        </div>
        <FeeTable />
      </section>

      <section className="mt-14">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="text-3xl text-fg">{t.mapTitle}</h2>
          <Link to="/explore" search={exploreSearch()} className="text-sm text-copper">
            {t.allTours}
          </Link>
        </div>
        <MapCanvas
          compact
          tours={tours.map((tour) => toMapTour(tour, lang))}
          focusId={null}
          onFocus={(id) => {
            void navigate({ to: "/explore", search: exploreSearch({ focus: id }) });
          }}
          loadingLabel={t.mapLoading}
          openLabel={t.mapOpen}
          kmLabel={t.km}
          note={t.mapNote}
        />
        <ul className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-6 bg-copper" />
            {t.mapRoad}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-6 border-t border-dashed border-copper" />
            {t.mapHorse}
          </li>
          <li className="flex items-center gap-2">
            <span className="h-0.5 w-6 border-t border-dotted border-moss" />
            {t.mapFoot}
          </li>
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="text-3xl text-fg">{t.featured}</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {featured.map((tour) => (
            <TourCard key={tour.id} tour={tour} />
          ))}
        </div>
      </section>

      <section className="mt-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-copper">{t.stepsKicker}</p>
        <h2 className="mt-2 text-3xl text-fg">{t.stepsTitle}</h2>
        <ol className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["01", t.step1, t.step1t],
            ["02", t.step2, t.step2t],
            ["03", t.step3, t.step3t],
            ["04", t.step4, t.step4t],
          ].map(([num, title, body]) => (
            <li key={num} className="rounded-2xl border border-line bg-surface p-4">
              <span className="text-xs font-semibold text-copper">{num}</span>
              <h3 className="mt-2 text-lg text-fg">{title}</h3>
              <p className="mt-2 text-sm text-cream">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <p className="text-xs font-semibold uppercase tracking-widest text-copper">{t.whoKicker}</p>
        <h2 className="mt-2 text-3xl text-fg">{t.whoTitle}</h2>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {[
            [t.whoTravel, t.whoTravelt],
            [t.whoGuide, t.whoGuidet],
            [t.whoPartner, t.whoPartnert],
          ].map(([title, body]) => (
            <article key={title} className="rounded-2xl border border-line bg-surface p-4">
              <h3 className="text-lg text-fg">{title}</h3>
              <p className="mt-2 text-sm text-cream">{body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-14 rounded-2xl border border-line bg-surface-2 p-6">
        <p className="text-xs font-semibold uppercase tracking-widest text-copper">{t.pilotKicker}</p>
        <h2 className="mt-2 text-3xl text-fg">{t.pilotTitle}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream">{t.pilotBody}</p>
        <p className="mt-4 inline-flex rounded-full border border-copper px-3 py-2 text-sm text-copper">{t.pilotChip}</p>
      </section>
    </main>
  );
}
