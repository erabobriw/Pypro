export const ORIGINS: { id: string; keys: string[] }[] = [
  { id: "almaty", keys: ["алматы", "almaty"] },
  { id: "astana", keys: ["астана", "astana", "нур-султан", "нурсултан", "nursultan"] },
  { id: "aktau", keys: ["актау", "ақтау", "aktau"] },
  { id: "shymkent", keys: ["шымкент", "шимкент", "shymkent"] },
  { id: "turkestan", keys: ["туркестан", "туркістан", "түркістан", "turkestan", "turkistan"] },
  { id: "saty", keys: ["саты", "saty"] },
  { id: "katon", keys: ["катон", "қатон", "katon"] },
  { id: "medeu", keys: ["медеу", "medeu"] },
];

const FROM: Record<string, string> = {
  "charyn-day": "almaty",
  kolsai: "almaty",
  kaindy: "saty",
  "big-almaty": "almaty",
  "kok-zhailau": "almaty",
  "singing-dune": "almaty",
  rakhman: "katon",
  belukha: "katon",
  burabay: "astana",
  bozzhyra: "aktau",
  aksu: "shymkent",
  turkestan: "turkestan",
};

export function tourOrigin(id: string): string {
  return FROM[id] ?? "";
}

export function matchOrigin(raw: string): string | null {
  const query = raw.trim().toLowerCase().replaceAll("ё", "е");
  if (query.length < 4) return null;
  const hit = ORIGINS.find((origin) => origin.keys.some((key) => query.includes(key) || key.includes(query)));
  return hit?.id ?? null;
}
