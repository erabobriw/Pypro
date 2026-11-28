import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { routeKm } from "@/lib/geo";

const point = z.tuple([z.number(), z.number()]);

export type RoadProfile = "car" | "foot" | "jeep" | "trail";

export type RoadResult = {
  ok: boolean;
  positions: [number, number][];
  km: number;
  profile: RoadProfile;
};

function decimate(points: [number, number][], max: number): [number, number][] {
  if (points.length <= max) return points;
  const step = (points.length - 1) / (max - 1);
  const out: [number, number][] = [];
  for (let i = 0; i < max; i++) out.push(points[Math.round(i * step)]!);
  return out;
}

function hav(a: [number, number], b: [number, number]): number {
  const r = 6371;
  const dLat = ((b[0] - a[0]) * Math.PI) / 180;
  const dLng = ((b[1] - a[1]) * Math.PI) / 180;
  const lat1 = (a[0] * Math.PI) / 180;
  const lat2 = (b[0] * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * r * Math.asin(Math.min(1, Math.sqrt(h)));
}

function hugsLine(sample: [number, number][], line: [number, number][], km = 0.55): boolean {
  if (line.length < 2 || sample.length < 2) return false;
  const step = Math.max(1, Math.ceil(line.length / 90));
  let hits = 0;
  for (const pt of sample) {
    let near = false;
    for (let i = 0; i < line.length; i += step) {
      if (hav(pt, line[i]!) < km) {
        near = true;
        break;
      }
    }
    if (near) hits += 1;
  }
  return hits / sample.length > 0.7;
}

function asTrail(points: [number, number][]): RoadResult {
  const positions = decimate(points, 220);
  return { ok: positions.length > 1, positions, km: routeKm(positions), profile: "trail" };
}

function straight(points: [number, number][], profile: RoadProfile): RoadResult {
  return { ok: false, positions: points, km: routeKm(points), profile };
}

async function osrmLeg(profile: "driving" | "foot", points: [number, number][]): Promise<RoadResult | null> {
  const coords = points.map(([lat, lng]) => `${lng.toFixed(5)},${lat.toFixed(5)}`).join(";");
  const url = `https://router.project-osrm.org/route/v1/${profile}/${coords}?overview=full&geometries=geojson&steps=false`;
  const res = await fetch(url, {
    signal: AbortSignal.timeout(14000),
    headers: { Accept: "application/json" },
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    code?: string;
    routes?: { distance?: number; geometry?: { coordinates?: [number, number][] } }[];
  };
  const route = json.routes?.[0];
  const geom = route?.geometry?.coordinates;
  if (json.code !== "Ok" || !geom || geom.length < 2) return null;
  const positions = decimate(
    geom.map(([lng, lat]) => [lat, lng] as [number, number]),
    220,
  );
  return {
    ok: true,
    positions,
    km: Math.round((route.distance ?? 0) / 1000),
    profile: profile === "foot" ? "foot" : "car",
  };
}

function decode6(str: string): [number, number][] {
  let index = 0;
  let lat = 0;
  let lng = 0;
  const out: [number, number][] = [];
  const factor = 1e6;
  while (index < str.length) {
    let result = 0;
    let shift = 0;
    let byte = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lat += result & 1 ? ~(result >> 1) : result >> 1;
    result = 0;
    shift = 0;
    do {
      byte = str.charCodeAt(index++) - 63;
      result |= (byte & 0x1f) << shift;
      shift += 5;
    } while (byte >= 0x20);
    lng += result & 1 ? ~(result >> 1) : result >> 1;
    out.push([lat / factor, lng / factor]);
  }
  return out;
}

async function jeepLeg(points: [number, number][]): Promise<RoadResult | null> {
  const res = await fetch("https://valhalla1.openstreetmap.de/route", {
    method: "POST",
    signal: AbortSignal.timeout(14000),
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      locations: points.map(([lat, lon]) => ({ lat, lon })),
      costing: "auto",
      costing_options: {
        auto: { use_highways: 0.05, use_tolls: 0, use_tracks: 1, exclude_unpaved: false },
      },
      directions_options: { units: "kilometers" },
    }),
  });
  if (!res.ok) return null;
  const json = (await res.json()) as {
    trip?: { summary?: { length?: number }; legs?: { shape?: string }[] };
  };
  const legs = json.trip?.legs ?? [];
  const positions = decimate(
    legs.flatMap((leg) => (leg.shape ? decode6(leg.shape) : [])),
    220,
  );
  if (positions.length < 2) return null;
  const km = Math.round(json.trip?.summary?.length ?? routeKm(positions));
  return { ok: true, positions, km, profile: "jeep" };
}

export const traceTour = createServerFn({ method: "POST" })
  .validator(
    z.object({
      mode: z.enum(["car", "foot", "jeep", "trail", "mixed"]),
      points: z.array(point).min(2).max(16),
      trail: z.array(point).max(40).optional(),
    }),
  )
  .handler(async ({ data }): Promise<RoadResult> => {
    const points = data.points as [number, number][];
    const trail = (data.trail && data.trail.length >= 2 ? data.trail : points) as [number, number][];
    try {
      if (data.mode === "trail") return asTrail(trail);

      if (data.mode === "jeep") {
        const track = await jeepLeg(points);
        const drive = await osrmLeg("driving", points);
        if (track && (!drive || !hugsLine(decimate(track.positions, 20), drive.positions))) return track;
        return asTrail(trail);
      }

      if (data.mode === "foot") {
        const walked = await osrmLeg("foot", points);
        const drive = await osrmLeg("driving", points);
        if (walked && (!drive || !hugsLine(decimate(walked.positions, 20), drive.positions))) return walked;
        return asTrail(trail);
      }

      if (data.mode === "mixed" && points.length >= 3) {
        const road = await osrmLeg("driving", points.slice(0, -1));
        const last = asTrail(trail.slice(-2));
        if (road && last.positions.length >= 2) {
          return {
            ok: true,
            positions: [...road.positions, ...last.positions.slice(1)],
            km: road.km + last.km,
            profile: "car",
          };
        }
        if (road) return road;
        return asTrail(trail);
      }

      const traced = await osrmLeg("driving", points);
      if (traced) return traced;
      return straight(trail, "car");
    } catch {
      return data.mode === "car" ? straight(trail, "car") : asTrail(trail);
    }
  });
