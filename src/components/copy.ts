import type { Difficulty, Transport } from "@/data/catalog";
import type { Dict } from "@/lib/i18n";
import type { Lang } from "@/lib/lang";

export function transportLabel(transport: Transport, t: Dict): string {
  const map: Record<Transport, string> = {
    car: t.trCar,
    suv: t.trSuv,
    bus: t.trBus,
    horse: t.trHorse,
    mixed: t.trMixed,
    hike: t.trHike,
  };
  return map[transport];
}

export function difficultyLabel(difficulty: Difficulty, t: Dict): string {
  if (difficulty === "easy") return t.diffEasy;
  if (difficulty === "hard") return t.diffHard;
  return t.diffModerate;
}

export function dayLabel(days: number, lang: Lang): string {
  if (lang === "en") return `${days} ${days === 1 ? "day" : "days"}`;
  if (lang === "kk") return `${days} күн`;
  const mod10 = days % 10;
  const mod100 = days % 100;
  if (mod10 === 1 && mod100 !== 11) return `${days} день`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${days} дня`;
  return `${days} дней`;
}

export function langList(codes: Lang[]): string {
  const names: Record<Lang, string> = { kk: "қаз", ru: "рус", en: "en" };
  return codes.map((code) => names[code]).join(" · ");
}
