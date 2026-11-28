import { useEffect, useState } from "react";
import type { Transport } from "@/data/catalog";
import { traceTour, type RoadResult } from "@/lib/osrm";

export type RoadTrace = RoadResult;

const memory = new Map<string, RoadTrace>();

function modeOf(transport: Transport): "car" | "foot" | "jeep" | "trail" | "mixed" {
  if (transport === "horse") return "trail";
  if (transport === "hike") return "foot";
  if (transport === "suv") return "jeep";
  if (transport === "mixed") return "mixed";
  return "car";
}

function cacheKey(mode: string, points: [number, number][]) {
  return `${mode}:${points.map(([a, b]) => `${a.toFixed(3)},${b.toFixed(3)}`).join(";")}`;
}

async function pool<T>(items: T[], size: number, worker: (item: T) => Promise<void>) {
  let index = 0;
  async function next() {
    while (index < items.length) {
      const current = items[index];
      index += 1;
      if (current) await worker(current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, () => next()));
}

export function useRoadTraces(
  tours: {
    id: string;
    transport: Transport;
    route: [number, number][];
    stops: { position: [number, number] }[];
  }[],
) {
  const signature = tours.map((tour) => `${tour.id}:${tour.transport}:${tour.stops.length}`).join("|");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let dead = false;
    const jobs = tours.flatMap((tour) => {
      const points = tour.stops.map((stop) => stop.position);
      if (points.length < 2) return [];
      const mode = modeOf(tour.transport);
      const key = cacheKey(mode, points);
      if (memory.has(key)) return [];
      return [{ mode, points, trail: tour.route, key }];
    });
    if (jobs.length === 0) return;
    void pool(jobs, 2, async (job) => {
      if (dead || memory.has(job.key)) return;
      try {
        const result = await traceTour({ data: { mode: job.mode, points: job.points, trail: job.trail } });
        memory.set(job.key, result);
      } catch {
        memory.set(job.key, { ok: false, positions: job.points, km: 0, profile: "trail" });
      }
      if (!dead) setTick((value) => value + 1);
    });
    return () => {
      dead = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  void tick;
  const roads: Record<string, RoadTrace> = {};
  for (const tour of tours) {
    const points = tour.stops.map((stop) => stop.position);
    const hit = memory.get(cacheKey(modeOf(tour.transport), points));
    if (hit) roads[tour.id] = hit;
  }
  return roads;
}
