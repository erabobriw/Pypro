import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import type { Tour } from "@/data/catalog";
import { seatsLeft, upcomingSaturdays } from "@/lib/departures";
import { useBookings } from "@/lib/bookings";
import { useI18n } from "@/lib/i18n";
import { formatKzt, quote } from "@/lib/money";

export function BookingPanel({ tour }: { tour: Tour }) {
  const { t, lang } = useI18n();
  const add = useBookings((state) => state.add);
  const holds = useBookings((state) => state.items);
  const hydrate = useBookings((state) => state.hydrate);
  const [date, setDate] = useState("");
  const [people, setPeople] = useState(2);
  const [dates, setDates] = useState<string[]>([]);
  const [held, setHeld] = useState(false);
  const [error, setError] = useState<"date" | "full" | null>(null);

  useEffect(() => {
    hydrate();
    const next = upcomingSaturdays(6);
    setDates(next);
    setDate(next[0] ?? "");
  }, [hydrate]);

  const numbers = quote(tour.priceKzt, people);
  const left = date ? seatsLeft(tour.id, date, holds) : 0;

  function hold() {
    if (!date) {
      setError("date");
      return;
    }
    if (left < people) {
      setError("full");
      return;
    }
    add({ tourId: tour.id, date, people, pay: numbers.pay, fee: numbers.fee, payout: numbers.payout });
    setHeld(true);
    setError(null);
  }

  return (
    <section className="rounded-2xl border border-line bg-surface p-4 lg:sticky lg:top-28">
      <h2 className="text-2xl text-fg">{t.bookingTitle}</h2>
      <p className="mt-1 text-sm text-muted">{t.departuresTitle}</p>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {dates.map((day) => {
          const seats = seatsLeft(tour.id, day, holds);
          const active = day === date;
          return (
            <button
              key={day}
              type="button"
              onClick={() => {
                setDate(day);
                setError(null);
                setHeld(false);
              }}
              className={`shrink-0 rounded-2xl border px-3 py-2 text-left ${
                active ? "border-copper bg-bg" : "border-line bg-bg/40"
              }`}
            >
              <span className="block text-sm text-fg">{formatDay(day, lang)}</span>
              <span className={`block text-xs tabular-nums ${seats === 0 ? "text-copper" : "text-muted"}`}>
                {seats === 0 ? t.spotsNone : `${seats} ${t.spotsLeft}`}
              </span>
            </button>
          );
        })}
      </div>
      <label className="mt-3 block text-sm text-muted">
        {t.bookingPeople}
        <select
          value={people}
          onChange={(event) => {
            setPeople(Number(event.target.value));
            setHeld(false);
          }}
          className="mt-1 h-11 w-full rounded-xl border border-line bg-bg px-3 text-fg"
        >
          {Array.from({ length: 8 }, (_, index) => index + 1).map((count) => (
            <option key={count} value={count}>
              {count}
            </option>
          ))}
        </select>
      </label>
      <dl className="mt-4 space-y-2 text-sm">
        <Row label={t.bookingPay} value={formatKzt(numbers.pay)} />
        <Row label={t.bookingFee} value={formatKzt(numbers.fee)} />
        <Row label={t.bookingPayout} value={formatKzt(numbers.payout)} />
      </dl>
      {error === "date" ? <p className="mt-3 text-sm text-copper">{t.bookingNeedDate}</p> : null}
      {error === "full" ? <p className="mt-3 text-sm text-copper">{t.bookingFull}</p> : null}
      {held ? (
        <p className="mt-4 rounded-xl bg-surface-2 px-3 py-3 text-sm text-cream">
          {t.bookingHeld}.{" "}
          <Link to="/bookings" className="text-copper">
            {t.bookingMine}
          </Link>
        </p>
      ) : (
        <button
          type="button"
          onClick={hold}
          disabled={left < people}
          className="mt-4 h-12 w-full rounded-full bg-copper text-sm font-semibold text-ink disabled:opacity-40"
        >
          {t.bookingHold}
        </button>
      )}
      <p className="mt-3 text-xs leading-relaxed text-muted">{t.bookingDemo}</p>
    </section>
  );
}

function formatDay(iso: string, lang: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(year!, (month ?? 1) - 1, day);
  return new Intl.DateTimeFormat(lang === "en" ? "en-GB" : lang === "kk" ? "kk-KZ" : "ru-RU", {
    day: "numeric",
    month: "short",
  }).format(date);
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-line pb-2">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular-nums text-fg">{value}</dd>
    </div>
  );
}
