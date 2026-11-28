import { useEffect, useState, type ComponentType } from "react";
import type { MapCanvasProps } from "@/components/kazakhstan-map";

export function MapCanvas(props: MapCanvasProps) {
  const [View, setView] = useState<ComponentType<MapCanvasProps> | null>(null);

  useEffect(() => {
    let live = true;
    void import("@/components/kazakhstan-map").then((mod) => {
      if (live) setView(() => mod.KazakhstanMap);
    });
    return () => {
      live = false;
    };
  }, []);

  return (
    <div
      id="tour-map"
      className={`map-frame relative overflow-hidden rounded-2xl border border-line ${props.compact ? "map-compact" : "map-stage"}`}
    >
      {View ? (
        <View {...props} />
      ) : (
        <div className="grid h-full place-items-center bg-surface text-sm text-muted">{props.loadingLabel}</div>
      )}
      {props.focusId ? null : (
        <p className="pointer-events-none absolute bottom-3 left-3 z-[1] max-w-[16rem] rounded-xl bg-bg/90 px-3 py-2 text-xs text-cream">
          {props.note}
        </p>
      )}
    </div>
  );
}
