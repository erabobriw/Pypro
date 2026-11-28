export type ExploreSearch = {
  q: string;
  from: string;
  region: string;
  transport: string;
  difficulty: string;
  focus: string;
};

export function exploreSearch(partial: Partial<ExploreSearch> = {}): ExploreSearch {
  return {
    q: "",
    from: "",
    region: "all",
    transport: "all",
    difficulty: "all",
    focus: "",
    ...partial,
  };
}

export function readExploreSearch(search: Record<string, unknown>): ExploreSearch {
  const text = (value: unknown) => (typeof value === "string" ? value : "");
  return exploreSearch({
    q: text(search.q),
    from: text(search.from),
    region: text(search.region) || "all",
    transport: text(search.transport) || "all",
    difficulty: text(search.difficulty) || "all",
    focus: text(search.focus),
  });
}
