import { useEffect, useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MapContainer, Marker, Polyline, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Transport } from "@/data/catalog";
import { routeKm } from "@/lib/geo";
import type { RoadProfile } from "@/lib/osrm";
import { useRoadTraces } from "@/components/use-roads";

export type MapStop = { name: string; position: [number, number]; night?: boolean; photo?: string };

export type MapTour = {
  id: string;
  title: string;
  priceLabel: string;
  transport: Transport;
  position: [number, number];
  route: [number, number][];
  stops: MapStop[];
  days: number;
  nights: number;
  includes: string[];
};

export type MapCanvasProps = {
  tours: MapTour[];
  focusId: string | null;
  onFocus: (id: string) => void;
  compact?: boolean;
  loadingLabel: string;
  openLabel: string;
  kmLabel: string;
  note: string;
  transportFilter?: string;
  onTransportChange?: (id: string) => void;
  showChips?: boolean;
  chipLabels?: Partial<Record<Transport | "all", string>>;
  nightLabel?: string;
  profileLabels?: Partial<Record<RoadProfile | "wait" | "sketch", string>>;
  daysLabel?: string;
  nightsLabel?: string;
  includesLabel?: string;
  bookLabel?: string;
};

const KZ: [number, number][] = [
  [40.8, 46.8],
  [55.2, 87.2],
];

const TRANSPORTS: Transport[] = ["car", "suv", "bus", "horse", "mixed", "hike"];

function pin(active: boolean) {
  return L.divIcon({
    className: "",
    html: `<i class="gm-pin${active ? " is-on" : ""}"></i>`,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
  });
}

function stopIcon(night: boolean) {
  return L.divIcon({
    className: "",
    html: `<i class="gm-stop${night ? " is-night" : ""}"></i>`,
    iconSize: night ? [12, 12] : [8, 8],
    iconAnchor: night ? [6, 6] : [4, 4],
  });
}

function lineStyle(transport: Transport, active: boolean, dimmed: boolean, live: boolean) {
  const base =
    transport === "hike" || transport === "horse"
      ? { color: transport === "hike" ? "#8eae86" : "#d4a574", dashArray: live ? undefined : "2 7" }
      : transport === "mixed" || transport === "suv"
        ? { color: "#d4a574", dashArray: live ? undefined : "7 8" }
        : { color: "#c46a3a", dashArray: undefined as string | undefined };
  if (active) return { ...base, weight: 5, opacity: 0.95 };
  if (dimmed) return { ...base, weight: 2, opacity: 0.25 };
  return { ...base, weight: live ? 4 : 3, opacity: live ? 0.85 : 0.55 };
}

function Frame({ focusId, tours }: { focusId: string | null; tours: MapTour[] }) {
  const map = useMap();
  const signature = `${focusId ?? ""}|${tours.map((tour) => tour.id).join(",")}`;

  useEffect(() => {
    const focused = focusId ? tours.find((item) => item.id === focusId) : undefined;
    const pts = focused
      ? focused.route.length > 1
        ? focused.route
        : focused.stops.map((stop) => stop.position)
      : tours.flatMap((tour) => (tour.route.length ? tour.route : [tour.position]));
    if (pts.length >= 2) map.fitBounds(pts as [number, number][], { padding: [48, 48], maxZoom: focused ? 11 : 7 });
    else if (pts.length === 1) map.setView(pts[0]!, 8);
    else map.fitBounds(KZ, { padding: [24, 24] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature, map]);

  useEffect(() => {
    const box = map.getContainer();
    const watcher = new ResizeObserver(() => map.invalidateSize());
    watcher.observe(box);
    return () => watcher.disconnect();
  }, [map]);

  return null;
}

export function KazakhstanMap({
  tours,
  focusId,
  onFocus,
  openLabel,
  kmLabel,
  transportFilter,
  onTransportChange,
  showChips = true,
  chipLabels,
  nightLabel = "ночёвка",
  profileLabels,
  daysLabel = "дн.",
  nightsLabel = "ночей",
  includesLabel = "В цене",
  bookLabel = "Забронировать",
}: MapCanvasProps) {
  const [localFilter, setLocalFilter] = useState("all");
  const filter = onTransportChange ? (transportFilter && transportFilter !== "" ? transportFilter : "all") : localFilter;

  const visible = useMemo(
    () => (filter === "all" ? tours : tours.filter((tour) => tour.transport === filter)),
    [tours, filter],
  );

  const roads = useRoadTraces(visible);
  const focused = visible.find((tour) => tour.id === focusId) ?? null;

  const present = TRANSPORTS.filter((id) => tours.some((tour) => tour.transport === id));

  function pick(id: string) {
    if (onTransportChange) onTransportChange(id === "all" ? "all" : id);
    else setLocalFilter(id);
  }

  const lineFor = (tour: MapTour) => {
    const road = roads[tour.id];
    if (road && road.positions.length > 1) return road.positions;
    if (tour.stops.length > 1) return tour.stops.map((stop) => stop.position);
    return tour.route;
  };

  const kmOf = (tour: MapTour) => {
    const road = roads[tour.id];
    if (road && road.km > 0) return road.km;
    if (tour.route.length > 1) return routeKm(tour.route);
    return 0;
  };

  const profileOf = (tour: MapTour) => {
    const road = roads[tour.id];
    if (!road) return profileLabels?.wait ?? "…";
    if (!road.ok) return profileLabels?.sketch ?? "схема";
    return profileLabels?.[road.profile] ?? road.profile;
  };

  return (
    <div className="relative h-full w-full">
      <MapContainer bounds={KZ} scrollWheelZoom={false} className="h-full w-full" zoomControl={false}>
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution="&copy; OpenStreetMap &copy; CARTO"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Frame focusId={focused ? focusId : null} tours={visible} />
        {visible.map((tour) => {
          const positions = lineFor(tour);
          if (positions.length < 2) return null;
          const active = tour.id === focusId;
          const road = roads[tour.id];
          return (
            <Polyline
              key={`${tour.id}-line`}
              positions={positions}
              pathOptions={lineStyle(tour.transport, active, Boolean(focused) && !active, Boolean(road?.ok))}
              eventHandlers={{ click: () => onFocus(tour.id) }}
            />
          );
        })}
        {(focused
          ? focused.stops.map((stop) => ({ tourId: focused.id, stop }))
          : filter !== "all"
            ? visible.flatMap((tour) => tour.stops.map((stop) => ({ tourId: tour.id, stop })))
            : []
        ).map(({ tourId, stop }, index) => (
          <Marker key={`${tourId}-stop-${index}`} position={stop.position} icon={stopIcon(Boolean(stop.night))}>
            <Popup minWidth={180}>
              <span className="block text-sm text-fg">
                {stop.photo ? (
                  <img src={stop.photo} alt="" className="mb-2 h-24 w-full rounded-lg object-cover" />
                ) : null}
                {stop.name}
                {stop.night ? ` · ${nightLabel}` : ""}
              </span>
            </Popup>
          </Marker>
        ))}
        {visible.map((tour) => {
          const km = kmOf(tour);
          return (
            <Marker
              key={tour.id}
              position={tour.position}
              icon={pin(tour.id === focusId)}
              zIndexOffset={tour.id === focusId ? 500 : 0}
              eventHandlers={{ click: () => onFocus(tour.id) }}
            >
              <Popup>
                <div className="space-y-1">
                  <p className="font-serif text-base text-fg">{tour.title}</p>
                  <p className="text-sm tabular-nums text-cream">
                    {tour.priceLabel}
                    {km > 0 ? ` · ${km} ${kmLabel}` : ""}
                  </p>
                  <p className="text-xs text-muted">
                    {tour.transport} · {profileOf(tour)}
                    {tour.nights > 0 ? ` · ${nightLabel}` : ""}
                  </p>
                  <Link to="/tours/$tourId" params={{ tourId: tour.id }} className="text-sm text-copper">
                    {openLabel}
                  </Link>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>

      {showChips && present.length > 1 ? (
        <div className="pointer-events-none absolute inset-x-2 top-2 z-[500]">
          <div className="gm-chips pointer-events-auto flex flex-nowrap gap-1 overflow-x-auto rounded-full border border-line bg-bg/90 p-1 backdrop-blur-sm">
            <Chip active={filter === "all"} onClick={() => pick("all")} label={chipLabels?.all ?? "Все"} />
            {present.map((id) => (
              <Chip key={id} active={filter === id} onClick={() => pick(id)} label={chipLabels?.[id] ?? id} />
            ))}
          </div>
        </div>
      ) : null}

      {focused ? (
        <aside className="pointer-events-auto absolute inset-x-2 bottom-2 z-[500] max-h-[48%] overflow-y-auto rounded-2xl border border-line bg-bg/95 p-3 shadow-none">
          <p className="font-serif text-lg leading-tight text-fg">{focused.title}</p>
          <p className="mt-1 text-xs text-cream">
            {focused.days} {daysLabel}
            {kmOf(focused) > 0 ? ` · ${kmOf(focused)} ${kmLabel}` : ""}
            {focused.nights > 0 ? ` · ${focused.nights} ${nightsLabel}` : ""}
            {` · ${profileOf(focused)}`}
          </p>
          <p className="mt-1 text-sm tabular-nums text-copper">{focused.priceLabel}</p>
          {focused.includes.length > 0 ? (
            <p className="mt-2 text-xs leading-relaxed text-muted">
              <span className="text-cream">{includesLabel}: </span>
              {focused.includes.join(" · ")}
            </p>
          ) : null}
          <Link
            to="/tours/$tourId"
            params={{ tourId: focused.id }}
            className="mt-3 inline-flex h-10 items-center rounded-full bg-copper px-4 text-sm font-semibold text-ink"
          >
            {bookLabel}
          </Link>
        </aside>
      ) : null}
    </div>
  );
}

function Chip({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-8 shrink-0 rounded-full px-3 text-xs font-semibold ${
        active ? "bg-copper text-ink" : "bg-surface text-cream"
      }`}
    >
      {label}
    </button>
  );
}
