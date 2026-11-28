import { createFileRoute, Link } from "@tanstack/react-router";
import { tourById } from "@/data/catalog";
import { useBookings } from "@/lib/bookings";
import { useI18n } from "@/lib/i18n";
import { tx } from "@/lib/lang";
import { formatKzt } from "@/lib/money";
import { exploreSearch } from "@/lib/search";

export const Route = createFileRoute("/bookings")({ component: BookingsPage });

function BookingsPage() {
  const { lang, t } = useI18n();
  const items = useBookings((state) => state.items);
  const ready = useBookings((state) => state.ready);
  const remove = useBookings((state) => state.remove);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-4xl text-fg">{t.bookingMine}</h1>
      <p className="mt-3 text-sm text-cream">{t.bookingDemo}</p>
      {!ready ? null : items.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-line bg-surface p-6">
          <p className="text-cream">{t.bookingEmpty}</p>
          <Link to="/explore" search={exploreSearch()} className="mt-4 inline-flex h-11 items-center text-copper">
            {t.navTours}
          </Link>
        </div>
      ) : (
        <ul className="mt-6 space-y-3">
          {items.map((item) => {
            const tour = tourById(item.tourId);
            return (
              <li key={item.id} className="rounded-2xl border border-line bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    {tour ? (
                      <Link to="/tours/$tourId" params={{ tourId: tour.id }} className="font-serif text-xl text-fg">
                        {tx(tour.title, lang)}
                      </Link>
                    ) : (
                      <p className="text-fg">{item.tourId}</p>
                    )}
                    <p className="mt-1 text-sm text-muted">
                      {t.bookingWhen}: <span className="tabular-nums text-cream">{item.date}</span> · {item.people}
                    </p>
                  </div>
                  <span className="rounded-full bg-copper/15 px-3 py-1 text-xs font-semibold text-copper">{t.bookingStatus}</span>
                </div>
                <dl className="mt-3 grid grid-cols-3 gap-2 text-sm">
                  <div>
                    <dt className="text-muted">{t.bookingPay}</dt>
                    <dd className="tabular-nums text-fg">{formatKzt(item.pay)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">{t.bookingFee}</dt>
                    <dd className="tabular-nums text-copper">{formatKzt(item.fee)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">{t.bookingPayout}</dt>
                    <dd className="tabular-nums text-fg">{formatKzt(item.payout)}</dd>
                  </div>
                </dl>
                <button type="button" onClick={() => remove(item.id)} className="mt-4 h-11 text-sm text-muted">
                  {t.bookingCancel}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
